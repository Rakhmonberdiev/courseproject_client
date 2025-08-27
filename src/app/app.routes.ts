import { Routes } from '@angular/router';
import { authRoutes } from './pages/auth/auth.routes';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'inventories/:id',
    loadComponent: () =>
      import('./pages/inv-details/inv-details').then((m) => m.InvDetails),
  },
  ...authRoutes,
  { path: '**', redirectTo: '' },
];
