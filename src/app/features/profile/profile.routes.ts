import { Routes } from '@angular/router';

export const profileRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/profile-home/profile-home.component').then((m) => m.ProfileHomeComponent),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./pages/profile-settings/profile-settings.component').then((m) => m.ProfileSettingsComponent),
  },
];
