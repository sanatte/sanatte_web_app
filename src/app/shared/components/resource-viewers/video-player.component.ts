import { Component, input, signal } from '@angular/core';
import { Resource } from '../../../features/administration/models/resource.model';

/**
 * VideoPlayer — visor de video a pantalla completa (fondo inmersivo).
 * Basado en el mockup "detalle del recurso": badge de colección, controles
 * superiores, play central frosted-glass, barra de progreso y controles.
 */
@Component({
  selector: 'app-video-player',
  template: `
    <div class="w-full aspect-video player-gradient rounded-xl relative overflow-hidden
                shadow-2xl group">
      <!-- Textura de fondo (gradiente del recurso) -->
      <div class="absolute inset-0 opacity-40 mix-blend-overlay scale-105
                  group-hover:scale-100 transition-transform duration-1000 bg-gradient-to-br"
           [class]="resource().thumbnailGradient"></div>

      <div class="absolute inset-0 flex flex-col justify-between p-6 md:p-10 z-10">
        <!-- Top -->
        <div class="flex justify-between items-start">
          <span class="bg-primary/20 backdrop-blur-md text-white px-3 py-1 rounded-full
                       text-label-sm font-heading uppercase tracking-wider">
            {{ collection() }}
          </span>
          <div class="flex gap-2">
            <button class="w-10 h-10 glass-card !bg-white/80 rounded-full flex items-center
                           justify-center text-on-surface hover:!bg-white transition-all">
              <span class="material-symbols-outlined">cast</span>
            </button>
            <button class="w-10 h-10 glass-card !bg-white/80 rounded-full flex items-center
                           justify-center text-on-surface hover:!bg-white transition-all">
              <span class="material-symbols-outlined">settings</span>
            </button>
          </div>
        </div>

        <!-- Play central -->
        <div class="flex items-center justify-center">
          <button (click)="playing.set(!playing())"
                  class="w-20 h-20 md:w-24 md:h-24 glass-card !bg-white/85 rounded-full flex
                         items-center justify-center text-primary shadow-xl hover:scale-105
                         active:scale-95 transition-all">
            <span class="material-symbols-outlined !text-5xl"
                  style="font-variation-settings: 'FILL' 1;">
              {{ playing() ? 'pause' : 'play_arrow' }}
            </span>
          </button>
        </div>

        <!-- Progreso + controles -->
        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <span class="text-white text-label-sm font-medium">12:45</span>
            <div class="flex-1 h-1.5 bg-white/20 rounded-full relative overflow-hidden">
              <div class="absolute top-0 left-0 h-full w-1/3 bg-primary-container rounded-full"></div>
            </div>
            <span class="text-white text-label-sm font-medium">{{ resource().duration ?? '00:00' }}</span>
          </div>
          <div class="flex justify-between items-center text-white">
            <div class="flex gap-6">
              <span class="material-symbols-outlined cursor-pointer hover:text-primary-fixed-dim">replay_10</span>
              <span class="material-symbols-outlined cursor-pointer hover:text-primary-fixed-dim">forward_10</span>
              <span class="material-symbols-outlined cursor-pointer hover:text-primary-fixed-dim">volume_up</span>
            </div>
            <span class="material-symbols-outlined cursor-pointer hover:text-primary-fixed-dim">fullscreen</span>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class VideoPlayerComponent {
  readonly resource   = input.required<Resource>();
  readonly collection = input('Sanatte Series');
  readonly playing    = signal(false);
}
