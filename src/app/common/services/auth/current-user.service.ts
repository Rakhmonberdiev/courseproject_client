import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { AuthResponse } from '../../models/auth.model';
import { catchError, finalize, Observable, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CurrentUserService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + 'auth/';
  private currentUser = signal<AuthResponse | null>(null);
  readonly currentUser$ = this.currentUser.asReadonly();
  readonly ready = signal(false);
  setUser(user: AuthResponse | null) {
    this.currentUser.set(user);
  }
  logout(): Observable<void> {
    return this.http
      .post<void>(this.baseUrl + 'logout', {}, { withCredentials: true })
      .pipe(tap(() => this.setUser(null)));
  }
  initUser(): void {
    this.ready.set(false);
    this.loadUser()
      .pipe(finalize(() => this.ready.set(true)))
      .subscribe();
  }
  private loadUser(): Observable<AuthResponse | null> {
    return this.http
      .get<AuthResponse>(this.baseUrl + 'me', { withCredentials: true })
      .pipe(
        tap((user) => this.currentUser.set(user)),
        catchError(() => {
          this.currentUser.set(null);
          return of(null);
        })
      );
  }
  isAuthenticated(): boolean {
    return !!this.currentUser();
  }
}
