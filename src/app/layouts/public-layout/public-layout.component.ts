import { Component, inject, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../features/public/services/cart.service';
import { MockAuthService } from '../../core/services/mock-auth.service';

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen flex flex-col bg-surface">
      <!-- Navbar -->
      <header class="sticky top-0 z-30 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20
                     px-container-padding-mobile md:px-container-padding-desktop h-16 flex items-center justify-between">
        <a routerLink="/" class="flex items-center gap-2">
          <span class="font-heading text-headline-md font-bold text-primary">Sanatte</span>
        </a>

        <nav class="hidden md:flex items-center gap-6">
          <a routerLink="/products" routerLinkActive="!text-primary"
             class="text-label-md font-heading text-on-surface-variant hover:text-primary transition-colors">
            Productos
          </a>
          <a routerLink="/blog" routerLinkActive="!text-primary"
             class="text-label-md font-heading text-on-surface-variant hover:text-primary transition-colors">Blog</a>
          <a routerLink="/faq" routerLinkActive="!text-primary"
             class="text-label-md font-heading text-on-surface-variant hover:text-primary transition-colors">FAQ</a>
        </nav>

        <div class="flex items-center gap-3">
          <!-- Carrito -->
          <a routerLink="/cart" class="relative p-2 rounded-full hover:bg-surface-container transition-colors">
            <span class="material-symbols-outlined text-on-surface-variant">shopping_bag</span>
            @if (cartCount() > 0) {
              <span class="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary text-white
                           text-[10px] font-heading font-bold flex items-center justify-center">
                {{ cartCount() }}
              </span>
            }
          </a>

          @if (isAuthenticated()) {
            <a routerLink="/app/library"
               class="px-5 py-2 rounded-full text-label-md font-heading font-semibold text-white
                      gradient-primary hover:opacity-90 transition-opacity">
              Mi cuenta
            </a>
          } @else {
            <a routerLink="/auth/login"
               class="hidden sm:inline-block px-4 py-2 rounded-full text-label-md font-heading text-primary
                      border border-primary hover:bg-primary/5 transition-colors">Ingresar</a>
            <a routerLink="/auth/register"
               class="px-5 py-2 rounded-full text-label-md font-heading font-semibold text-white
                      gradient-primary hover:opacity-90 transition-opacity">Registrarse</a>
          }
        </div>
      </header>

      <main class="flex-1">
        <router-outlet />
      </main>

      <!-- Footer -->
      <footer class="bg-surface-container-lowest border-t border-outline-variant/20 mt-16
                     px-container-padding-mobile md:px-container-padding-desktop py-12">
        <div class="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div class="col-span-2 md:col-span-1">
            <span class="font-heading text-headline-md font-bold text-primary">Sanatte</span>
            <p class="text-label-md font-heading text-on-surface-variant mt-2">Wellness Ecosystem</p>
          </div>
          <div>
            <h4 class="font-heading font-bold text-on-surface text-label-md uppercase tracking-wider mb-3">Tienda</h4>
            <ul class="space-y-2 text-label-md font-heading text-on-surface-variant">
              <li><a routerLink="/products" class="hover:text-primary transition-colors">Productos</a></li>
              <li><a routerLink="/products" class="hover:text-primary transition-colors">Suscripciones</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-heading font-bold text-on-surface text-label-md uppercase tracking-wider mb-3">Compañía</h4>
            <ul class="space-y-2 text-label-md font-heading text-on-surface-variant">
              <li><a href="#" class="hover:text-primary transition-colors">Nosotros</a></li>
              <li><a routerLink="/faq" class="hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-heading font-bold text-on-surface text-label-md uppercase tracking-wider mb-3">Legal</h4>
            <ul class="space-y-2 text-label-md font-heading text-on-surface-variant">
              <li><a href="#" class="hover:text-primary transition-colors">Privacidad</a></li>
              <li><a href="#" class="hover:text-primary transition-colors">Términos</a></li>
            </ul>
          </div>
        </div>
        <p class="max-w-6xl mx-auto mt-10 pt-6 border-t border-outline-variant/20 text-label-sm
                  font-heading text-outline">© 2026 Sanatte. Todos los derechos reservados.</p>
      </footer>
    </div>
  `,
})
export class PublicLayoutComponent {
  private readonly cart = inject(CartService);
  private readonly auth = inject(MockAuthService);

  readonly cartCount       = this.cart.count;
  readonly isAuthenticated = computed(() => this.auth.isAuthenticated());
}
