import { Component, effect, inject, input, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { WaveAudioPlayerComponent } from './wave-audio-player.component';
import { PdfViewerComponent } from './pdf-viewer.component';
import { VideoPlayerComponent } from './video-player.component';

type MediaState = 'loading' | 'ready' | 'not_ready' | 'error';
interface StreamResponse { url: string; contentType: string; expiresAt: string; }

/**
 * MediaPlayer — reproductor funcional de un recurso del usuario.
 *
 * Pide una URL firmada temporal a `GET /api/me/resources/{slug}/stream` (que
 * valida el acceso) y reproduce con elementos nativos: <video>/<audio> (soportan
 * Range/206 → arranque directo y seek) o incrusta el PDF. Reacciona al cambio de
 * `slug` para recargar cuando el usuario elige otro recurso de la playlist.
 */
@Component({
  selector: 'app-media-player',
  imports: [WaveAudioPlayerComponent, PdfViewerComponent, VideoPlayerComponent],
  template: `
    @switch (state()) {
      @case ('loading') {
        <div class="w-full aspect-video rounded-xl bg-surface-container-low
                    flex flex-col items-center justify-center gap-3 text-on-surface-variant">
          <span class="material-symbols-outlined animate-spin text-primary text-[32px]">progress_activity</span>
          <span class="text-label-md font-heading">Preparando el reproductor…</span>
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
          <span class="text-label-md font-heading">Este contenido se está preparando. Vuelve pronto.</span>
        </div>
      }
      @case ('error') {
        <div class="w-full aspect-video rounded-xl bg-error-container/40 border border-error/30
                    flex flex-col items-center justify-center gap-3 text-error">
          <span class="material-symbols-outlined text-[32px]">error</span>
          <span class="text-label-md font-heading">No se pudo cargar el contenido. Intenta de nuevo.</span>
        </div>
      }
    }
  `,
})
export class MediaPlayerComponent {
  private readonly http = inject(HttpClient);

  readonly kind = input.required<'audio' | 'video' | 'pdf'>();
  /** Modo usuario: reproduce por slug vía /me/resources/{slug}/stream (valida acceso). */
  readonly slug = input<string>('');
  /** Modo admin (preview): reproduce por id vía /admin/resources/{id}/stream (sin entitlement). */
  readonly resourceId = input<string>('');
  readonly admin = input<boolean>(false);
  /** Portada del audio (imagen real o gradiente de fallback). */
  readonly coverUrl = input<string | null>(null);
  readonly coverGradient = input<string>('from-violet-400 to-purple-600');

  readonly state = signal<MediaState>('loading');
  readonly url   = signal<string | null>(null);

  constructor() {
    effect(() => {
      // Recarga al cambiar el recurso (slug en modo usuario, id en modo admin).
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
      // 404 → el recurso existe pero aún no tiene archivo subido.
      const status = e instanceof HttpErrorResponse ? e.status : 0;
      this.state.set(status === 404 ? 'not_ready' : 'error');
    }
  }
}
