import {
  Component, ElementRef, AfterViewInit, OnDestroy, input, viewChild,
} from '@angular/core';
import Plyr from 'plyr';

/**
 * Reproductor de video con Plyr (controles profesionales: play, seek, volumen,
 * velocidad, PiP, fullscreen), temizado con el color de marca. Reproduce la URL
 * firmada de R2 con streaming progresivo (Range/206).
 */
@Component({
  selector: 'app-video-player',
  template: `
    <div class="w-full rounded-2xl overflow-hidden shadow-lg bg-black">
      <video #video playsinline controls class="w-full" [src]="url()"></video>
    </div>
  `,
})
export class VideoPlayerComponent implements AfterViewInit, OnDestroy {
  readonly url = input.required<string>();
  private readonly videoEl = viewChild.required<ElementRef<HTMLVideoElement>>('video');
  private player?: Plyr;

  ngAfterViewInit(): void {
    this.player = new Plyr(this.videoEl().nativeElement, {
      controls: [
        'play-large', 'play', 'progress', 'current-time', 'duration',
        'mute', 'volume', 'settings', 'pip', 'fullscreen',
      ],
      settings: ['speed'],
      speed: { selected: 1, options: [0.75, 1, 1.25, 1.5, 2] },
    });
  }

  ngOnDestroy(): void {
    this.player?.destroy();
  }
}
