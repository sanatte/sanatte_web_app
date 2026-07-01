import { Routes } from '@angular/router';

export const libraryRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/library-home/library-home.component').then((m) => m.LibraryHomeComponent),
  },
];
