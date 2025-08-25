import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../common/services/auth/auth.service';
import { Router } from '@angular/router';
import { LoginRequest } from '../../../common/models/auth.model';
import { TranslateModule } from '@ngx-translate/core';
import { TextInput } from '../../../shared/forms/text-input/text-input';
import { ErrorLocalizerService } from '../../../common/services/errors/error-localizer.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, TranslateModule, TextInput],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  loginForm: FormGroup;
  loading = signal(false);
  errorMessages = signal<string[] | null>(null);
  private errLoc = inject(ErrorLocalizerService);
  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(1)]],
      isPersistent: [false, Validators.required],
    });
  }
  get f() {
    return this.loginForm.controls;
  }
  register() {
    if (this.loginForm.invalid) return;

    this.loading.set(true);
    this.errorMessages.set(null);

    const loginReq: LoginRequest = this.loginForm.getRawValue();
    this.authService.login(loginReq).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.loading.set(false);

        const keys: string[] =
          err?.errorKeys ?? this.errLoc.fromStatus(err?.status, err?.url);
        this.errorMessages.set(keys);
      },
    });
  }
}
