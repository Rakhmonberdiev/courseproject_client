import { Routes } from '@angular/router';
import { authGuard } from './common/guards/auth.guard';
import { authRoutes } from './pages/auth/auth.routes';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    canActivate: [authGuard],
    data: { requiresAuth: true },
  },
  ...authRoutes,
  { path: '**', redirectTo: '' },
];
