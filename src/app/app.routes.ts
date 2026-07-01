import { Routes } from '@angular/router';
import { mockAuthGuard } from './core/guards/mock-auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  // ── Auth (login, registro, recuperar) ──────────────────────────────────
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/authentication/authentication.routes').then((m) => m.authenticationRoutes),
  },

  // ── Admin ───────────────────────────────────────────────────────────────
  {
    path: 'admin',
    canActivate: [mockAuthGuard, adminGuard],
    loadComponent: () =>
      import('./layouts/admin-layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    loadChildren: () =>
      import('./features/administration/administration.routes').then((m) => m.administrationRoutes),
  },

  // ── App usuario autenticado ─────────────────────────────────────────────
  {
    path: 'app',
    canActivate: [mockAuthGuard],
    loadComponent: () =>
      import('./layouts/app-layout/app-layout.component').then((m) => m.AppLayoutComponent),
    children: [
      {
        path: 'library',
        loadChildren: () =>
          import('./features/library/library.routes').then((m) => m.libraryRoutes),
      },
      {
        path: 'orders',
        loadChildren: () =>
          import('./features/orders/orders.routes').then((m) => m.ordersRoutes),
      },
      {
        path: 'subscriptions',
        loadChildren: () =>
          import('./features/subscriptions/subscriptions.routes').then((m) => m.subscriptionsRoutes),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./features/profile/profile.routes').then((m) => m.profileRoutes),
      },
      { path: '', redirectTo: 'library', pathMatch: 'full' },
    ],
  },

  // ── Sitio público ───────────────────────────────────────────────────────
  {
    path: '',
    loadComponent: () =>
      import('./layouts/public-layout/public-layout.component').then((m) => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/public/pages/home/home.component').then((m) => m.HomeComponent),
      },
    ],
  },

  // ── Fallback ─────────────────────────────────────────────────────────────
  { path: '**', redirectTo: 'auth/login' },
];
