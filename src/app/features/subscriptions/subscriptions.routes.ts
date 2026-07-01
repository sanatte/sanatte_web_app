import { Routes } from '@angular/router';

export const subscriptionsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/subscription-list/subscription-list.component').then((m) => m.SubscriptionListComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/subscription-detail/subscription-detail.component').then((m) => m.SubscriptionDetailComponent),
  },
];
