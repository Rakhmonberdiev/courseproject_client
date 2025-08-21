import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from '../../models/auth.model';
import { environment } from '../../../../environments/environment';
import { CurrentUserService } from './current-user.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + 'auth/';
  private store = inject(CurrentUserService);

  login(req: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(this.baseUrl + 'login', req, {
        withCredentials: true,
      })
      .pipe(tap((user) => this.store.setUser(user)));
  }

  register(req: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(this.baseUrl + 'register', req, {
        withCredentials: true,
      })
      .pipe(tap((user) => this.store.setUser(user)));
  }
}
