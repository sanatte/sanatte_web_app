import { Component, effect, inject, input, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { WaveAudioPlayerComponent } from './wave-audio-player.component';
import { PdfViewerComponent } from './pdf-viewer.component';
import { VideoPlayerComponent } from './video-player.component';
import { TEXTS } from '../../../core/i18n/texts';

type MediaState = 'loading' | 'ready' | 'not_ready' | 'error';
interface StreamResponse { url: string; contentType: string; expiresAt: string; }

@Component({
  selector: 'app-media-player',
  imports: [WaveAudioPlayerComponent, PdfViewerComponent, VideoPlayerComponent],
  template: `
    @switch (state()) {
      @case ('loading') {
        <div class="w-full aspect-video rounded-xl bg-surface-container-low
                    flex flex-col items-center justify-center gap-3 text-on-surface-variant">
          <span class="material-symbols-outlined animate-spin text-primary text-[32px]">progress_activity</span>
          <span class="text-label-md font-heading">{{ t.loading }}</span>
        </div>
      }
      @case ('ready') {
        @switch (kind()) {
          @case ('video') {
            <app-video-player [url]="url()!" />
          }
          @case ('audio') {
            <app-wave-audio-player [url]="url()!"
                                   [coverUrl]="coverUrl()"
                                   [coverGradient]="coverGradient()" />
          }
          @case ('pdf') {
            <app-pdf-viewer [url]="url()!" />
          }
        }
      }
      @case ('not_ready') {
        <div class="w-full aspect-video rounded-xl bg-surface-container-low border border-outline-variant/30
                    flex flex-col items-center justify-center gap-3 text-on-surface-variant">
          <span class="material-symbols-outlined text-[32px]">hourglass_empty</span>
          <span class="text-label-md font-heading">{{ t.notReady }}</span>
        </div>
      }
      @case ('error') {
        <div class="w-full aspect-video rounded-xl bg-error-container/40 border border-error/30
                    flex flex-col items-center justify-center gap-3 text-error">
          <span class="material-symbols-outlined text-[32px]">error</span>
          <span class="text-label-md font-heading">{{ t.error }}</span>
        </div>
      }
    }
  `,
})
export class MediaPlayerComponent {
  private readonly http = inject(HttpClient);

  protected readonly t = TEXTS.shared.resourceViewers.media;

  readonly kind = input.required<'audio' | 'video' | 'pdf'>();
  readonly slug = input<string>('');
  readonly resourceId = input<string>('');
  readonly admin = input<boolean>(false);
  readonly coverUrl = input<string | null>(null);
  readonly coverGradient = input<string>('from-brand-400 to-brand-800');

  readonly state = signal<MediaState>('loading');
  readonly url   = signal<string | null>(null);

  constructor() {
    effect(() => {
      const key = this.admin() ? this.resourceId() : this.slug();
      if (key) this.load(key);
    });
  }

  private async load(key: string): Promise<void> {
    this.state.set('loading');
    this.url.set(null);
    const endpoint = this.admin()
      ? `${environment.apiUrl}/admin/resources/${key}/stream`
      : `${environment.apiUrl}/me/resources/${key}/stream`;
    try {
      const s = await firstValueFrom(this.http.get<StreamResponse>(endpoint));
      this.url.set(s.url);
      this.state.set('ready');
    } catch (e) {
      const status = e instanceof HttpErrorResponse ? e.status : 0;
      this.state.set(status === 404 ? 'not_ready' : 'error');
    }
  }
}
