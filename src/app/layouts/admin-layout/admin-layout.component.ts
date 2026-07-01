import { Component, inject, computed, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { MockAuthService } from '../../core/services/mock-auth.service';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent {
  private readonly auth = inject(MockAuthService);
  private readonly router = inject(Router);

  readonly displayName = computed(() => this.auth.currentUser()?.displayName ?? 'Admin');
  readonly userInitial = computed(() => this.displayName().charAt(0).toUpperCase());

  readonly pageTitle    = signal('Admin Dashboard');
  readonly sidebarOpen  = signal(false);

  toggleSidebar(): void { this.sidebarOpen.update((v) => !v); }
  closeSidebar():  void { this.sidebarOpen.set(false); }

  constructor() {
    // Cierra el sidebar al navegar en móvil
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) this.closeSidebar();
    });
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        const url = e.urlAfterRedirects;
        const titles: Record<string, string> = {
          '/admin/dashboard':    'Admin Dashboard',
          '/admin/products':     'Productos',
          '/admin/resources':    'Recursos',
          '/admin/users':        'Usuarios',
          '/admin/orders':       'Pedidos',
          '/admin/licenses':     'Licencias',
          '/admin/activations':  'Activaciones',
          '/admin/reports':      'Reportes',
          '/admin/settings':     'Configuración',
        };
        this.pageTitle.set(titles[url] ?? 'Admin Dashboard');
      }
    });
  }

  readonly mainNav: NavItem[] = [
    { label: 'Insights',    route: '/admin/dashboard',    icon: 'leaderboard' },
    { label: 'Productos',   route: '/admin/products',     icon: 'category' },
    { label: 'Recursos',    route: '/admin/resources',    icon: 'play_circle' },
    { label: 'Usuarios',    route: '/admin/users',        icon: 'group' },
    { label: 'Logística',   route: '/admin/orders',       icon: 'local_shipping' },
    { label: 'Licencias',   route: '/admin/licenses',     icon: 'key' },
    { label: 'Activaciones',route: '/admin/activations',  icon: 'verified' },
    { label: 'Reportes',    route: '/admin/reports',      icon: 'bar_chart' },
  ];

  readonly bottomNav: NavItem[] = [
    { label: 'Configuración', route: '/admin/settings', icon: 'settings' },
    { label: 'Soporte',       route: '/admin/support',  icon: 'help' },
  ];

  logout(): void { this.auth.logout(); }
}
