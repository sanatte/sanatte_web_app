import { Routes } from '@angular/router';

export const emotionsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/emotion-list/emotion-list.component').then(
        (m) => m.EmotionListComponent
      ),
  },
];
