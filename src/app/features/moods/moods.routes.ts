import { Routes } from '@angular/router';

export const moodsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/mood-history/mood-history.component').then((m) => m.MoodHistoryComponent),
  },
];
