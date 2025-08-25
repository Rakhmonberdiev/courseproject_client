import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../common/services/auth/auth.service';
import { Router } from '@angular/router';
import {
  latinLettersOnly,
  matchFields,
} from '../../../common/utils/validators';
import { RegisterRequest } from '../../../common/models/auth.model';
import { TextInput } from '../../../shared/forms/text-input/text-input';
import { TranslateModule } from '@ngx-translate/core';
import { CurrentUserService } from '../../../common/services/auth/current-user.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, TextInput, FormsModule, TranslateModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  registerForm?: FormGroup;
  loading = signal(false);
  errorMessages = signal<string[] | null>(null);
  private currentUserService = inject(CurrentUserService);
  constructor() {
    if (this.currentUserService.isAuthenticated()) {
      this.router.navigateByUrl('/');
      return;
    }
    this.registerForm = this.fb.group(
      {
        userName: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
            latinLettersOnly(),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(1)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: [matchFields('password', 'confirmPassword')] }
    );
  }
  get f() {
    return this.registerForm?.controls;
  }
  register() {
    if (this.registerForm?.invalid) return;

    this.loading.set(true);
    this.errorMessages.set(null);

    const registerRequest: RegisterRequest = this.registerForm?.getRawValue();
    this.authService.register(registerRequest).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.loading.set(false);

        const apiErrors: string[] =
          err?.error?.errors ??
          (typeof err?.error === 'string'
            ? [err.error]
            : ['Registration failed']);
        this.errorMessages.set(apiErrors);
      },
    });
  }
}
