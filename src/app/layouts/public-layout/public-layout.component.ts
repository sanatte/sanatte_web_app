import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="min-h-screen flex flex-col">
      <!-- Navbar público -->
      <header class="sticky top-0 z-30 bg-white border-b border-gray-100 px-6 h-16
                     flex items-center justify-between">
        <a routerLink="/" class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52
                       2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <span class="text-lg font-bold text-primary">Sanatte</span>
        </a>

        <nav class="flex items-center gap-1">
          <a routerLink="/products"
             class="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:text-primary
                    hover:bg-gray-100 transition-colors">Productos</a>
          <a routerLink="/blog"
             class="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:text-primary
                    hover:bg-gray-100 transition-colors">Blog</a>
          <a routerLink="/faq"
             class="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:text-primary
                    hover:bg-gray-100 transition-colors">FAQ</a>
          <a routerLink="/contact"
             class="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:text-primary
                    hover:bg-gray-100 transition-colors">Contacto</a>
        </nav>

        <div class="flex items-center gap-2">
          <a routerLink="/auth/login"
             class="px-4 py-1.5 rounded-lg text-sm text-primary border border-primary
                    hover:bg-primary/5 transition-colors font-medium">Ingresar</a>
          <a routerLink="/auth/register"
             class="px-4 py-1.5 rounded-lg text-sm text-white gradient-primary
                    hover:opacity-90 transition-opacity font-medium">Registrarse</a>
        </div>
      </header>

      <main class="flex-1">
        <router-outlet />
      </main>

      <footer class="bg-white border-t border-gray-100 px-6 py-8 text-center text-sm text-gray-400">
        © 2025 Sanatte. Todos los derechos reservados.
      </footer>
    </div>
  `,
})
export class PublicLayoutComponent {}
