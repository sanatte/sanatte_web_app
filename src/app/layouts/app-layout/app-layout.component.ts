import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MockAuthService } from '../../core/services/mock-auth.service';

@Component({
  selector: 'app-app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col">
      <!-- Topbar -->
      <header class="sticky top-0 z-30 bg-white border-b border-gray-100 px-6 h-16
                     flex items-center justify-between">
        <a routerLink="/app/library" class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52
                       2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <span class="text-lg font-bold text-primary">Sanatte</span>
        </a>

        <nav class="flex items-center gap-1">
          <a routerLink="/app/library"
             routerLinkActive="text-primary font-semibold"
             class="px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:text-gray-700
                    hover:bg-gray-100 transition-colors">Biblioteca</a>
          <a routerLink="/app/orders"
             routerLinkActive="text-primary font-semibold"
             class="px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:text-gray-700
                    hover:bg-gray-100 transition-colors">Mis pedidos</a>
          <a routerLink="/app/subscriptions"
             routerLinkActive="text-primary font-semibold"
             class="px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:text-gray-700
                    hover:bg-gray-100 transition-colors">Suscripciones</a>
        </nav>

        <div class="flex items-center gap-2">
          <a routerLink="/app/profile"
             class="w-8 h-8 rounded-full gradient-primary flex items-center justify-center
                    text-white text-sm font-semibold">
            {{ userInitial() }}
          </a>
          <button (click)="logout()"
                  class="p-2 rounded-lg text-gray-400 hover:text-danger hover:bg-red-50 transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3v1"/>
            </svg>
          </button>
        </div>
      </header>

      <main class="flex-1">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AppLayoutComponent {
  private readonly auth = inject(MockAuthService);
  readonly userInitial = () => (this.auth.currentUser()?.displayName ?? 'U').charAt(0).toUpperCase();
  logout(): void { this.auth.logout(); }
}
