import { Routes } from '@angular/router';
import { guestGuard } from '../../core/guards/guest.guard';

export const authenticationRoutes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
