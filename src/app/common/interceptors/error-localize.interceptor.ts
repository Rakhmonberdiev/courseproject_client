import { Injectable, inject } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorLocalizerService } from '../services/errors/error-localizer.service';

@Injectable()
export class ErrorLocalizeInterceptor implements HttpInterceptor {
  private errLoc = inject(ErrorLocalizerService);

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((err: unknown) => {
        if (err instanceof HttpErrorResponse) {
          const keys = this.errLoc.fromStatus(err.status, err.url ?? undefined);
          return throwError(() => ({
            ...err,
            errorKeys: keys,
          }));
        }
        return throwError(() => err);
      })
    );
  }
}
