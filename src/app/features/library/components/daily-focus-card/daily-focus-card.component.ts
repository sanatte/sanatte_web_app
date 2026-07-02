import { Component, input, output } from '@angular/core';
import { DailyFocus } from '../../models/user-library.model';

/**
 * DailyFocusCard — hero "Enfoque del día" con fondo inmersivo (gradiente),
 * badge, título, descripción y CTA. Ocupa 2 columnas del bento en desktop.
 */
@Component({
  selector: 'app-daily-focus-card',
  host: { class: 'block lg:col-span-2' },
  template: `
    <div
      class="relative overflow-hidden rounded-lg h-full min-h-[220px] flex flex-col
             justify-end p-6 md:p-8 text-white group cursor-pointer bg-gradient-to-br {{ focus().gradient }}"
      (click)="start.emit()">
      <!-- Overlay + textura -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
      <div class="absolute top-[-15%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

      <div class="relative z-10 space-y-4">
        <span class="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white
                     text-label-sm font-bold uppercase tracking-widest">
          {{ focus().badge }}
        </span>
        <h4 class="font-heading text-headline-md md:text-headline-lg text-white">{{ focus().title }}</h4>
        <p class="font-sans text-body-md text-white/85 max-w-md">{{ focus().description }}</p>
        <button
          class="px-6 py-2.5 rounded-full bg-white text-primary font-heading font-bold
                 hover:shadow-[0px_0px_20px_rgba(255,255,255,0.4)] transition-all
                 flex items-center gap-2 w-fit active:scale-95">
          <span class="material-symbols-outlined">play_arrow</span>
          Comenzar ahora
        </button>
      </div>
    </div>
  `,
})
export class DailyFocusCardComponent {
  readonly focus = input.required<DailyFocus>();
  readonly start = output<void>();
}
