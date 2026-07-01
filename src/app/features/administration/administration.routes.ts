import { Routes } from '@angular/router';

export const administrationRoutes: Routes = [
  {
    path: 'dashboard',
    data: { title: 'Admin Dashboard' },
    loadComponent: () =>
      import('./pages/dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
  },
  {
    path: 'products',
    data: { title: 'Productos' },
    loadComponent: () =>
      import('./pages/products/admin-products.component').then((m) => m.AdminProductsComponent),
  },
  {
    path: 'products/:id',
    data: { title: 'Detalle de Producto' },
    loadComponent: () =>
      import('./pages/products/admin-product-detail.component').then((m) => m.AdminProductDetailComponent),
  },
  {
    path: 'resources',
    data: { title: 'Recursos' },
    loadComponent: () =>
      import('./pages/resources/admin-resources.component').then((m) => m.AdminResourcesComponent),
  },
  {
    path: 'users',
    data: { title: 'Usuarios' },
    loadComponent: () =>
      import('./pages/users/admin-users.component').then((m) => m.AdminUsersComponent),
  },
  {
    path: 'orders',
    data: { title: 'Pedidos' },
    loadComponent: () =>
      import('./pages/orders/admin-orders.component').then((m) => m.AdminOrdersComponent),
  },
  {
    path: 'licenses',
    data: { title: 'Licencias' },
    loadComponent: () =>
      import('./pages/licenses/admin-licenses.component').then((m) => m.AdminLicensesComponent),
  },
  {
    path: 'activations',
    data: { title: 'Activaciones' },
    loadComponent: () =>
      import('./pages/activations/admin-activations.component').then((m) => m.AdminActivationsComponent),
  },
  {
    path: 'reports',
    data: { title: 'Reportes' },
    loadComponent: () =>
      import('./pages/reports/admin-reports.component').then((m) => m.AdminReportsComponent),
  },
  {
    path: 'settings',
    data: { title: 'Configuración' },
    loadComponent: () =>
      import('./pages/settings/admin-settings.component').then((m) => m.AdminSettingsComponent),
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
