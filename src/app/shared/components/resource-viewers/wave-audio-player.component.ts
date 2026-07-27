import {
  Component, ElementRef, AfterViewInit, OnDestroy, input, signal, viewChild,
} from '@angular/core';
import WaveSurfer from 'wavesurfer.js';

/**
 * Reproductor de audio estilo Spotify/Calm: portada (imagen o gradiente) como
 * héroe + onda interactiva (wavesurfer.js) debajo con controles. La onda es
 * clicable para saltar. Reproduce la URL firmada de R2. Se recrea al cambiar de
 * recurso (lo maneja el @switch de MediaPlayerComponent) → inicializa en AfterViewInit.
 */
@Component({
  selector: 'app-wave-audio-player',
  template: `
    <div class="w-full rounded-2xl overflow-hidden shadow-lg bg-white border border-outline-variant/20">
      <!-- Portada -->
      <div class="w-full aspect-video relative bg-gradient-to-br {{ coverGradient() }}">
        @if (coverUrl(); as cover) {
          <img [src]="cover" alt="" class="absolute inset-0 w-full h-full object-cover"/>
        } @else {
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="material-symbols-outlined text-white/85 text-[64px]">headphones</span>
          </div>
        }
        <!-- Degradado inferior para fundir con la onda -->
        <div class="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent"></div>
      </div>

      <!-- Onda + controles -->
      <div class="p-5 md:p-6">
        <div class="relative min-h-[64px] flex items-center">
          <div #waveform class="w-full cursor-pointer"></div>
          @if (!ready() && !failed()) {
            <div class="absolute inset-0 flex items-center justify-center gap-2 text-on-surface-variant">
              <span class="material-symbols-outlined animate-spin text-[20px] text-primary">progress_activity</span>
              <span class="text-label-sm font-heading">Generando onda…</span>
            </div>
          }
          @if (failed()) {
            <div class="absolute inset-0 flex items-center justify-center text-error">
              <span class="text-label-sm font-heading">No se pudo cargar el audio.</span>
            </div>
          }
        </div>

        <div class="mt-4 flex items-center justify-between gap-4">
          <span class="text-on-surface-variant text-label-sm font-heading tabular-nums w-12">{{ fmt(current()) }}</span>
          <div class="flex items-center gap-6">
            <button (click)="seekBy(-10)" [disabled]="!ready()"
                    class="text-on-surface-variant hover:text-primary transition-colors active:scale-90 disabled:opacity-40">
              <span class="material-symbols-outlined text-[28px]">replay_10</span>
            </button>
            <button (click)="togglePlay()" [disabled]="!ready()"
                    class="w-14 h-14 rounded-full gradient-primary flex items-center justify-center
                           text-white shadow-lg hover:scale-105 active:scale-95 transition-transform
                           disabled:opacity-60"
                    style="box-shadow: 0 4px 14px rgba(107,56,212,0.39)">
              <span class="material-symbols-outlined text-[32px]" style="font-variation-settings:'FILL' 1;">
                {{ playing() ? 'pause' : 'play_arrow' }}
              </span>
            </button>
            <button (click)="seekBy(10)" [disabled]="!ready()"
                    class="text-on-surface-variant hover:text-primary transition-colors active:scale-90 disabled:opacity-40">
              <span class="material-symbols-outlined text-[28px]">forward_10</span>
            </button>
          </div>
          <span class="text-on-surface-variant text-label-sm font-heading tabular-nums w-12 text-right">{{ fmt(total()) }}</span>
        </div>
      </div>
    </div>
  `,
})
export class WaveAudioPlayerComponent implements AfterViewInit, OnDestroy {
  readonly url = input.required<string>();
  readonly coverUrl = input<string | null>(null);
  readonly coverGradient = input<string>('from-violet-400 to-purple-600');

  private readonly container = viewChild.required<ElementRef<HTMLDivElement>>('waveform');
  private ws?: WaveSurfer;

  readonly ready   = signal(false);
  readonly playing = signal(false);
  readonly current = signal(0);
  readonly total   = signal(0);
  readonly failed  = signal(false);

  ngAfterViewInit(): void {
    this.ws = WaveSurfer.create({
      container: this.container().nativeElement,
      url: this.url(),
      height: 64,
      waveColor: 'rgba(124,77,255,0.25)',
      progressColor: '#7C4DFF',
      cursorColor: '#7C4DFF',
      barWidth: 3,
      barGap: 2,
      barRadius: 3,
    });

    this.ws.on('ready', () => {
      this.ready.set(true);
      this.total.set(this.ws!.getDuration());
    });
    this.ws.on('timeupdate', (t) => this.current.set(t));
    this.ws.on('play', () => this.playing.set(true));
    this.ws.on('pause', () => this.playing.set(false));
    this.ws.on('finish', () => this.playing.set(false));
    this.ws.on('error', () => this.failed.set(true));
  }

  togglePlay(): void { this.ws?.playPause(); }

  seekBy(seconds: number): void {
    if (!this.ws) return;
    const t = Math.min(Math.max(this.ws.getCurrentTime() + seconds, 0), this.ws.getDuration());
    this.ws.setTime(t);
  }

  ngOnDestroy(): void { this.ws?.destroy(); }

  fmt(s: number): string {
    if (!isFinite(s)) return '00:00';
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }
}
