import { Component, inject, computed, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../features/public/services/cart.service';
import { TEXTS } from '../../core/i18n/texts';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app-layout.component.html',
})
export class AppLayoutComponent {
  private readonly auth   = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cart   = inject(CartService);

  protected readonly t = TEXTS.app.layout;

  readonly displayName = computed(() => this.auth.currentUser()?.displayName ?? this.t.account.defaultName);
  readonly userEmail   = computed(() => this.auth.currentUser()?.email ?? '');
  readonly userInitial = computed(() => this.displayName().charAt(0).toUpperCase());
  readonly isAdmin     = computed(() => this.auth.isAdmin());
  readonly roleLabel   = computed(() => (this.isAdmin() ? this.t.account.roles.admin : this.t.account.roles.client));
  readonly cartCount   = this.cart.count;

  readonly pageTitle   = signal<string>(this.t.defaultTitle);
  readonly sidebarOpen = signal(false);
  readonly menuOpen       = signal(false);
  readonly footerMenuOpen = signal(false);

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
        const titles = this.t.routeTitles;
        const match = Object.keys(titles).find((k) => e.urlAfterRedirects.startsWith(k));
        this.pageTitle.set(match ? titles[match] : this.t.defaultTitle);
      }
    });
  }

  readonly mainNav: NavItem[] = [
    { label: this.t.nav.library,       route: '/app/library',       icon: 'subscriptions' },
    { label: this.t.nav.activate,      route: '/app/activate',      icon: 'qr_code_scanner' },
    { label: this.t.nav.products,      route: '/app/products',      icon: 'storefront' },
    { label: this.t.nav.allies,        route: '/app/allies',        icon: 'handshake' },
    { label: this.t.nav.orders,        route: '/app/orders',        icon: 'receipt_long' },
    { label: this.t.nav.moods,         route: '/app/moods',         icon: 'mood' },
    { label: this.t.nav.subscriptions, route: '/app/subscriptions', icon: 'workspace_premium' },
    { label: this.t.nav.profile,       route: '/app/profile',       icon: 'person' },
  ];

  logout(): void { this.closeMenus(); this.auth.logout(); }
}
