import { Component, input } from '@angular/core';

/**
 * AuthShell — envoltorio visual común de las pantallas de autenticación
 * (logo Sanatte + tarjeta centrada sobre fondo lavanda). Estilo "Serene Pulse".
 */
@Component({
  selector: 'app-auth-shell',
  template: `
    <div class="min-h-screen bg-surface flex flex-col items-center justify-center
                px-container-padding-mobile py-10 relative overflow-hidden">
      <!-- Halo atmosférico de fondo -->
      <div class="absolute -top-32 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem]
                  bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div class="relative z-10 w-full max-w-md">
        <!-- Logo -->
        <div class="flex flex-col items-center mb-8">
          <div class="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center
                      shadow-[0px_10px_30px_rgba(107,56,212,0.25)] mb-4">
            <span class="material-symbols-outlined text-white text-[34px]">{{ icon() }}</span>
          </div>
          <span class="font-heading text-headline-lg font-bold text-primary">Sanatte</span>
        </div>

        <!-- Tarjeta -->
        <div class="glass-card rounded-lg p-6 md:p-8 transition-all duration-500
                    hover:shadow-[0px_20px_50px_rgba(76,29,149,0.10)]">
          <ng-content />
        </div>

        <!-- Puntitos decorativos -->
        <div class="flex justify-center gap-2 mt-8 opacity-60">
          <div class="w-2 h-2 rounded-full bg-primary/30"></div>
          <div class="w-2 h-2 rounded-full bg-primary/60"></div>
          <div class="w-2 h-2 rounded-full bg-primary/30"></div>
        </div>

        <p class="text-center text-label-sm font-heading text-outline uppercase tracking-widest mt-6">
          © 2026 Sanatte Wellness Ecosystem
        </p>
      </div>
    </div>
  `,
})
export class AuthShellComponent {
  readonly icon = input('spa');
}
