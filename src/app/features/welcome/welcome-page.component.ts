import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MediaPlayerComponent } from '../../shared/components/resource-viewers/media-player.component';
import { environment } from '../../../environments/environment';

interface MyResource {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: 'audio' | 'video' | 'pdf' | 'article';
  thumbnailUrl?: string | null;
  thumbnailGradient: string;
  duration?: string | null;
}

type PageState = 'loading' | 'ok' | 'error';

@Component({
  selector: 'app-welcome-page',
  imports: [MediaPlayerComponent, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5
                flex flex-col items-center justify-start px-4 py-12">

      @switch (state()) {
        @case ('loading') {
          <div class="flex flex-col items-center gap-4 mt-32 text-on-surface-variant">
            <span class="material-symbols-outlined animate-spin text-primary text-[40px]">
              progress_activity
            </span>
            <p class="font-heading text-label-md">Preparando tu bienvenida…</p>
          </div>
        }

        @case ('ok') {
          <div class="w-full max-w-2xl flex flex-col items-center gap-8">

            <!-- Header -->
            <div class="text-center space-y-3">
              <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                          bg-primary/10 text-primary text-label-sm font-heading font-bold">
                <span class="material-symbols-outlined text-[16px]">auto_awesome</span>
                ¡Producto activado!
              </div>
              <h1 class="font-heading text-display-sm font-bold text-on-surface">
                {{ resource()!.title }}
              </h1>
              @if (resource()!.description) {
                <p class="text-body-lg text-on-surface-variant max-w-lg mx-auto leading-relaxed">
                  {{ resource()!.description }}
                </p>
              }
            </div>

            <!-- Reproductor -->
            <div class="w-full">
              <app-media-player
                [slug]="slug()"
                [kind]="mediaKind()"
                [coverUrl]="resource()!.thumbnailUrl ?? null"
                [coverGradient]="resource()!.thumbnailGradient" />
            </div>

            <!-- CTA -->
            <div class="flex flex-col sm:flex-row items-center gap-3 w-full">
              <a routerLink="/app/library"
                 class="flex-1 gradient-primary text-white py-4 rounded-full font-heading
                        font-bold text-label-md text-center hover:opacity-90 active:scale-95
                        transition-all flex items-center justify-center gap-2"
                 style="box-shadow: 0 4px 14px rgba(107,56,212,0.3)">
                <span class="material-symbols-outlined text-[20px]">auto_stories</span>
                Explorar mi biblioteca
              </a>
              <a routerLink="/app/allies"
                 class="flex-1 border border-outline-variant rounded-full py-4 font-heading
                        font-bold text-label-md text-center text-on-surface-variant
                        hover:bg-surface-container transition-colors flex items-center
                        justify-center gap-2">
                <span class="material-symbols-outlined text-[20px]">handshake</span>
                Ver mis aliados
              </a>
            </div>
          </div>
        }

        @case ('error') {
          <div class="flex flex-col items-center gap-4 mt-32 text-on-surface-variant">
            <span class="material-symbols-outlined text-[40px]">error</span>
            <p class="font-heading text-label-md">No pudimos cargar el contenido.</p>
            <a routerLink="/app/library"
               class="gradient-primary text-white px-6 py-3 rounded-full font-heading font-bold">
              Ir a mi biblioteca
            </a>
          </div>
        }
      }
    </div>
  `,
})
export class WelcomePageComponent {
  private readonly http   = inject(HttpClient);
  private readonly route  = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly state    = signal<PageState>('loading');
  readonly resource = signal<MyResource | null>(null);

  readonly slug = computed(() => this.route.snapshot.paramMap.get('slug') ?? '');
  readonly mediaKind = computed((): 'audio' | 'video' | 'pdf' => {
    const t = this.resource()?.type;
    return t === 'video' ? 'video' : t === 'pdf' ? 'pdf' : 'audio';
  });

  constructor() {
    this.load();
  }

  private async load(): Promise<void> {
    const slug = this.slug();
    if (!slug) { this.router.navigate(['/app/library']); return; }
    try {
      const r = await firstValueFrom(
        this.http.get<MyResource>(`${environment.apiUrl}/me/resources/${slug}`)
      );
      this.resource.set(r);
      this.state.set('ok');
    } catch (e) {
      const status = e instanceof HttpErrorResponse ? e.status : 0;
      // 403 = no tiene acceso todavía, 404 = no existe — manda a biblioteca.
      if (status === 403 || status === 404) this.router.navigate(['/app/library']);
      else this.state.set('error');
    }
  }
}
