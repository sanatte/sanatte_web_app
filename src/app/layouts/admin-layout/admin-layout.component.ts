import { Component, inject, computed, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TEXTS } from '../../core/i18n/texts';

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
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly t = TEXTS.admin.layout;

  readonly displayName = computed(() => this.auth.currentUser()?.displayName ?? this.t.account.defaultName);
  readonly userInitial = computed(() => this.displayName().charAt(0).toUpperCase());

  readonly pageTitle    = signal<string>(this.t.defaultTitle);
  readonly sidebarOpen  = signal(false);
  readonly menuOpen     = signal(false);

  toggleSidebar(): void { this.sidebarOpen.update((v) => !v); }
  closeSidebar():  void { this.sidebarOpen.set(false); }
  toggleMenu():    void { this.menuOpen.update((v) => !v); }

  constructor() {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) { this.closeSidebar(); this.menuOpen.set(false); }
    });
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        const url = e.urlAfterRedirects;
        this.pageTitle.set(this.t.routeTitles[url] ?? this.t.defaultTitle);
      }
    });
  }

  readonly mainNav: NavItem[] = [
    { label: this.t.nav.dashboard,    route: '/admin/dashboard',     icon: 'leaderboard' },
    { label: this.t.nav.products,     route: '/admin/products',      icon: 'category' },
    { label: this.t.nav.resources,    route: '/admin/resources',     icon: 'play_circle' },
    { label: this.t.nav.allies,       route: '/admin/allies',        icon: 'handshake' },
    { label: this.t.nav.users,        route: '/admin/users',         icon: 'group' },
    { label: this.t.nav.orders,       route: '/admin/orders',        icon: 'local_shipping' },
    { label: this.t.nav.licenses,     route: '/admin/licenses',      icon: 'key' },
    { label: this.t.nav.locations,    route: '/admin/locations',     icon: 'store' },
    { label: this.t.nav.activations,  route: '/admin/activations',   icon: 'verified' },
    { label: this.t.nav.moodCatalog,  route: '/admin/mood-catalog',  icon: 'sentiment_satisfied' },
    { label: this.t.nav.moodTracking, route: '/admin/mood-tracking', icon: 'monitoring' },
    { label: this.t.nav.reports,      route: '/admin/reports',       icon: 'bar_chart' },
  ];

  readonly bottomNav: NavItem[] = [
    { label: this.t.nav.settings, route: '/admin/settings', icon: 'settings' },
    { label: this.t.nav.support,  route: '/admin/support',  icon: 'help' },
  ];

  logout(): void { this.menuOpen.set(false); this.auth.logout(); }
}
