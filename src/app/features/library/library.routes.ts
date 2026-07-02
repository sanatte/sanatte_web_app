import { Routes } from '@angular/router';

export const libraryRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/library-home/library-home.component').then((m) => m.LibraryHomeComponent),
  },
  {
    // Visor de recurso. resourceId opcional → abre el primero del producto.
    path: ':productId',
    loadComponent: () =>
      import('./pages/resource-viewer/resource-viewer.component').then((m) => m.ResourceViewerComponent),
  },
  {
    path: ':productId/:resourceId',
    loadComponent: () =>
      import('./pages/resource-viewer/resource-viewer.component').then((m) => m.ResourceViewerComponent),
  },
];
