import { Component, inject, computed, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { MockAuthService } from '../../core/services/mock-auth.service';
import { CartService } from '../../features/public/services/cart.service';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

/**
 * AppLayout — shell del cliente autenticado.
 * Alineado con AdminLayout: sidebar (rounded-lg + indicador border-r),
 * hamburguesa + backdrop en móvil, topbar con título de página y offset lg:ml-64.
 */
@Component({
  selector: 'app-app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app-layout.component.html',
})
export class AppLayoutComponent {
  private readonly auth   = inject(MockAuthService);
  private readonly router = inject(Router);
  private readonly cart   = inject(CartService);

  readonly displayName = computed(() => this.auth.currentUser()?.displayName ?? 'Usuario');
  readonly userInitial = computed(() => this.displayName().charAt(0).toUpperCase());
  readonly cartCount   = this.cart.count;

  readonly pageTitle   = signal('Mi Biblioteca');
  readonly sidebarOpen = signal(false);
  readonly menuOpen       = signal(false); // dropdown de cuenta (topbar)
  readonly footerMenuOpen = signal(false); // dropdown de cuenta (sidebar)

  toggleSidebar(): void { this.sidebarOpen.update((v) => !v); }
  closeSidebar():  void { this.sidebarOpen.set(false); }
  toggleMenu():       void { this.menuOpen.update((v) => !v); }
  toggleFooterMenu(): void { this.footerMenuOpen.update((v) => !v); }
  closeMenus(): void { this.menuOpen.set(false); this.footerMenuOpen.set(false); }

  constructor() {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.closeSidebar();
        this.closeMenus();
        const titles: Record<string, string> = {
          '/app/library':       'Mi Biblioteca',
          '/app/products':      'Tienda',
          '/app/cart':          'Carrito',
          '/app/checkout':      'Finalizar compra',
          '/app/activate':      'Activar producto',
          '/app/orders':        'Mis Pedidos',
          '/app/subscriptions': 'Suscripciones',
          '/app/profile':       'Perfil',
        };
        const match = Object.keys(titles).find((k) => e.urlAfterRedirects.startsWith(k));
        this.pageTitle.set(match ? titles[match] : 'Mi Biblioteca');
      }
    });
  }

  readonly mainNav: NavItem[] = [
    { label: 'Biblioteca',      route: '/app/library',       icon: 'subscriptions' },
    { label: 'Activar producto', route: '/app/activate',      icon: 'qr_code_scanner' },
    { label: 'Tienda',          route: '/app/products',      icon: 'storefront' },
    { label: 'Mis pedidos',     route: '/app/orders',        icon: 'receipt_long' },
    { label: 'Suscripciones',   route: '/app/subscriptions', icon: 'workspace_premium' },
    { label: 'Perfil',          route: '/app/profile',       icon: 'person' },
  ];

  logout(): void { this.closeMenus(); this.auth.logout(); }
}
