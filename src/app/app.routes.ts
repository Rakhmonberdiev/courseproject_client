import { Routes } from '@angular/router';
import { authRoutes } from './pages/auth/auth.routes';
import { invResolver } from './common/resolvers/inv.resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'inventories/:id',
    loadComponent: () =>
      import('./pages/inv-details/inv-details').then((m) => m.InvDetails),
    resolve: {
      inv: invResolver,
    },
    runGuardsAndResolvers: 'always',
  },
  ...authRoutes,
  {
    path: '**',
    loadComponent: () =>
      import('./pages/errors/not-found/not-found').then((m) => m.NotFound),
  },
];
