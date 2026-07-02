import { Component, input } from '@angular/core';
import { WeeklyProgress } from '../../models/user-library.model';

/**
 * WeeklyProgressCard — widget de progreso semanal (gamificación).
 * Fondo primary-container con glow, barra de progreso y frase motivacional.
 */
@Component({
  selector: 'app-weekly-progress-card',
  host: { class: 'block' },
  template: `
    <div class="bg-primary-container rounded-lg p-6 md:p-8 text-white flex flex-col justify-between
                shadow-[0px_10px_30px_rgba(107,56,212,0.15)] relative overflow-hidden h-full min-h-[220px]">
      <div class="absolute top-[-20%] right-[-20%] w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>

      <div class="relative z-10">
        <p class="text-label-sm uppercase tracking-widest opacity-80">Tu Progreso Semanal</p>
        <p class="font-heading text-headline-lg mt-2 leading-none">{{ progress().percentage }}%</p>
      </div>

      <div class="relative z-10 space-y-4">
        <div class="flex justify-between items-center text-label-md">
          <span>{{ progress().daysCompleted }} de {{ progress().daysTotal }} días completados</span>
          <span class="material-symbols-outlined">trending_up</span>
        </div>
        <div class="h-2 w-full bg-white/20 rounded-full overflow-hidden">
          <div class="h-full bg-white rounded-full transition-all duration-700"
               [style.width.%]="progress().percentage"></div>
        </div>
        <p class="font-sans text-sm opacity-80 italic">"{{ progress().quote }}"</p>
      </div>
    </div>
  `,
})
export class WeeklyProgressCardComponent {
  readonly progress = input.required<WeeklyProgress>();
}
