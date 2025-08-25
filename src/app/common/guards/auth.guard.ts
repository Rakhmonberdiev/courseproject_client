import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { CurrentUserService } from '../services/auth/current-user.service';

export const authGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const router = inject(Router);
  const currentUser = inject(CurrentUserService);

  const isAuth = currentUser.isAuthenticated();

  const requiresAuth = route.data?.['requiresAuth'] === true;
  const guestOnly = route.data?.['guestOnly'] === true;

  if (requiresAuth && isAuth) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url },
    });
  }
  if (guestOnly && !isAuth) {
    return router.createUrlTree(['/']);
  }

  return true;
};
