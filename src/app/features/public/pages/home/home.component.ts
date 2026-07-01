import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <section class="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Bienvenido a Sanatte</h1>
      <p class="text-lg text-gray-500 mb-8 max-w-xl">
        Plataforma de bienestar digital. Explora nuestros productos, recursos y biblioteca.
      </p>
      <div class="flex gap-3">
        <a routerLink="/products"
           class="px-6 py-2.5 rounded-xl gradient-primary text-white font-medium
                  hover:opacity-90 transition-opacity">Ver productos</a>
        <a routerLink="/auth/login"
           class="px-6 py-2.5 rounded-xl border border-primary text-primary font-medium
                  hover:bg-primary/5 transition-colors">Ingresar</a>
      </div>
    </section>
  `,
})
export class HomeComponent {}
