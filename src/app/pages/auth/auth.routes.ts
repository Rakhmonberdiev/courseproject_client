import { Routes } from '@angular/router';
import { authGuard } from '../../common/guards/auth.guard';

export const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login').then((m) => m.Login),
    canActivate: [authGuard],
    data: { guestOnly: true },
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register').then((m) => m.Register),
    canActivate: [authGuard],
    data: { guestOnly: true },
  },
];
