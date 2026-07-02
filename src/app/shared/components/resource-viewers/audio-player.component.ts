import { Component, input, signal } from '@angular/core';
import { Resource } from '../../../features/administration/models/resource.model';

/**
 * AudioPlayer — visor de audio inmersivo con waveform animado.
 * Reutiliza el patrón visual del ResourcePreviewModal admin, a pantalla completa.
 */
@Component({
  selector: 'app-audio-player',
  template: `
    <div class="w-full aspect-video player-gradient rounded-xl relative overflow-hidden
                shadow-2xl flex flex-col justify-between p-6 md:p-10">
      <!-- Glow atmosférico -->
      <div class="absolute -bottom-20 -left-20 w-72 h-72 bg-primary/25 rounded-full
                  blur-[90px] pointer-events-none"></div>

      <!-- Top -->
      <div class="relative z-10 flex justify-between items-start">
        <span class="bg-primary/20 backdrop-blur-md text-white px-3 py-1 rounded-full
                     text-label-sm font-heading uppercase tracking-wider">
          {{ collection() }}
        </span>
        <span class="material-symbols-outlined text-white/70">graphic_eq</span>
      </div>

      <!-- Waveform -->
      <div class="relative z-10 flex items-center justify-center gap-1.5 h-24">
        @for (h of bars; track $index) {
          <div class="wave-bar w-1.5 md:w-2 bg-primary-fixed-dim rounded-full flex-shrink-0"
               [style.height.px]="h"
               [style.animation-delay.ms]="$index * 80"
               [class.playing]="playing()"></div>
        }
      </div>

      <!-- Controles -->
      <div class="relative z-10">
        <div class="flex items-center justify-between mb-2 text-white/70 text-label-sm font-heading">
          <span>08:45</span>
          <span>{{ resource().duration ?? '00:00' }}</span>
        </div>
        <div class="h-1.5 w-full bg-white/15 rounded-full mb-6 relative cursor-pointer">
          <div class="absolute top-0 left-0 h-full w-[35%] bg-primary rounded-full"></div>
          <div class="absolute top-1/2 left-[35%] -translate-y-1/2 -translate-x-1/2
                      w-4 h-4 bg-white rounded-full shadow-lg"></div>
        </div>
        <div class="flex items-center justify-center gap-10">
          <button class="text-white/60 hover:text-white transition-colors active:scale-90">
            <span class="material-symbols-outlined text-[30px]">replay_10</span>
          </button>
          <button (click)="playing.set(!playing())"
                  class="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20
                         flex items-center justify-center text-white hover:bg-white hover:text-primary
                         transition-all shadow-xl active:scale-95">
            <span class="material-symbols-outlined text-[40px]" style="font-variation-settings: 'FILL' 1;">
              {{ playing() ? 'pause' : 'play_arrow' }}
            </span>
          </button>
          <button class="text-white/60 hover:text-white transition-colors active:scale-90">
            <span class="material-symbols-outlined text-[30px]">forward_10</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes wave {
      0%, 100% { transform: scaleY(0.4); opacity: 0.5; }
      50%      { transform: scaleY(1);   opacity: 1; }
    }
    .wave-bar.playing { animation: wave 1s ease-in-out infinite; }
  `],
})
export class AudioPlayerComponent {
  readonly resource   = input.required<Resource>();
  readonly collection = input('Sanatte Audio');
  readonly playing    = signal(false);

  readonly bars = [32, 48, 64, 96, 72, 56, 40, 84, 104, 64, 48, 88, 56, 72, 40, 96, 64, 44];
}
