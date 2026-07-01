import { Component, inject, input, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MockAuthService } from '../../../core/services/mock-auth.service';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="fixed left-0 top-0 h-screen w-60 bg-sidebar-bg border-r border-gray-100
                  flex flex-col z-40">
      <!-- Logo -->
      <div class="flex items-center gap-2.5 px-6 pt-6 pb-4">
        <div class="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5
                     1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <span class="text-xl font-bold text-primary">Sanatte</span>
      </div>

      <!-- Main Navigation -->
      <nav class="flex-1 px-3 mt-2 space-y-1">
        @for (item of mainNav; track item.route) {
          <a
            [routerLink]="item.route"
            routerLinkActive="bg-sidebar-active text-primary font-semibold"
            [routerLinkActiveOptions]="{ exact: false }"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500
                   hover:bg-gray-100 hover:text-gray-700 transition-colors group">
            <span class="text-lg" [innerHTML]="item.icon"></span>
            <span>{{ item.label }}</span>
          </a>
        }

        <!-- Settings Section -->
        <div class="pt-6">
          <p class="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Settings
          </p>
          @for (item of settingsNav; track item.route) {
            <a
              [routerLink]="item.route"
              routerLinkActive="bg-sidebar-active text-primary font-semibold"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500
                     hover:bg-gray-100 hover:text-gray-700 transition-colors">
              <span class="text-lg" [innerHTML]="item.icon"></span>
              <span>{{ item.label }}</span>
            </a>
          }
        </div>
      </nav>

      <!-- User Section -->
      <div class="px-3 pb-4">
        <div class="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-100 transition-colors">
          <div class="w-9 h-9 rounded-full gradient-primary flex items-center justify-center
                      text-white text-sm font-semibold">
            {{ userInitial() }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-800 truncate">{{ displayName() }}</p>
            <p class="text-xs text-gray-400 capitalize">{{ userRole() }}</p>
          </div>
          <button
            (click)="onLogout()"
            class="p-1.5 rounded-lg text-gray-400 hover:text-danger hover:bg-red-50 transition-colors"
            title="Sign out">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  `,
})
export class SidebarComponent {
  private readonly authService = inject(MockAuthService);

  readonly displayName = computed(() => this.authService.currentUser()?.displayName ?? 'User');
  readonly userRole = computed(() => this.authService.currentUser()?.role ?? 'user');
  readonly userInitial = computed(() => this.displayName().charAt(0).toUpperCase());

  readonly mainNav: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: '&#x1F4CA;' },
    { label: 'Emotions',  route: '/dashboard/emotions', icon: '&#x1F60A;' },
    { label: 'Users',     route: '/dashboard/users', icon: '&#x1F465;' },
    { label: 'Journal',   route: '/dashboard/journal', icon: '&#x1F4D3;' },
    { label: 'Analytics', route: '/dashboard/analytics', icon: '&#x1F4C8;' },
  ];

  readonly settingsNav: NavItem[] = [
    { label: 'App Settings', route: '/dashboard/settings', icon: '&#x2699;' },
    { label: 'Help Center',  route: '/dashboard/help', icon: '&#x2753;' },
  ];

  onLogout(): void {
    this.authService.logout();
  }
}
