import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../../environments/environment';

type ViewState = 'loading' | 'ok' | 'no_access' | 'not_found' | 'error';

interface MyResource {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: number; // 0 audio · 1 video · 2 pdf · 3 article
  duration?: string;
  thumbnailGradient: string;
}

const TYPE_META: Record<number, { icon: string; label: string }> = {
  0: { icon: 'headphones',     label: 'Audio'    },
  1: { icon: 'videocam',       label: 'Video'    },
  2: { icon: 'picture_as_pdf', label: 'PDF'      },
  3: { icon: 'description',    label: 'Artículo' },
};

/**
 * ResourceView — destino del QR de un recurso (`/app/r/:slug`).
 *
 * Valida contra `GET /api/me/resources/{slug}`: 200 → muestra el recurso
 * (reproductor próximamente), 403 → pide activar Plena, 404 → no encontrado.
 * La sesión ya la garantiza el guard del shell privado.
 */
@Component({
  selector: 'app-resource-view',
  imports: [RouterLink],
  template: `
    <div class="max-w-2xl mx-auto py-10 px-4">
      @switch (state()) {
        @case ('loading') {
          <div class="flex flex-col items-center justify-center py-24 text-center">
            <span class="material-symbols-outlined animate-spin text-primary text-[32px] mb-3">progress_activity</span>
            <p class="font-heading text-on-surface-variant">Abriendo tu recurso…</p>
          </div>
        }
        @case ('ok') {
          <div class="glass-card rounded-lg overflow-hidden">
            <div class="h-40 bg-gradient-to-br {{ resource()!.thumbnailGradient }} flex items-center justify-center">
              <span class="material-symbols-outlined text-white text-[56px]">{{ meta().icon }}</span>
            </div>
            <div class="p-6 md:p-8">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed
                           text-on-primary-fixed-variant text-label-sm font-heading font-semibold mb-3">
                {{ meta().label }}@if (resource()!.duration) { · {{ resource()!.duration }} }
              </span>
              <h1 class="font-heading text-headline-md text-on-surface mb-2">{{ resource()!.title }}</h1>
              <p class="text-body-md text-on-surface-variant">{{ resource()!.description }}</p>

              <!-- Reproductor: llega en el siguiente paso (streaming) -->
              <div class="mt-6 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30
                          flex items-center gap-3 text-on-surface-variant">
                <span class="material-symbols-outlined">play_circle</span>
                <span class="text-label-md font-heading">El reproductor estará disponible muy pronto.</span>
              </div>
            </div>
          </div>
        }
        @case ('no_access') {
          <div class="glass-card rounded-lg p-8 text-center">
            <span class="material-symbols-outlined text-primary text-[48px] mb-3">lock</span>
            <h1 class="font-heading text-headline-md text-on-surface mb-2">Activa tu Plena para acceder</h1>
            <p class="text-body-md text-on-surface-variant mb-6">
              Este recurso es parte de Plena. Activa tu producto con el código que viene bajo el QR de tu planeador.
            </p>
            <a routerLink="/app/activate"
               class="inline-flex items-center gap-2 gradient-primary text-white px-6 py-3 rounded-full
                      text-label-md font-heading font-bold hover:opacity-90 active:scale-95 transition-all"
               style="box-shadow: 0 4px 14px 0 rgba(107,56,212,0.39)">
              <span class="material-symbols-outlined text-[18px]">bolt</span>
              Activar producto
            </a>
          </div>
        }
        @case ('not_found') {
          <div class="glass-card rounded-lg p-8 text-center">
            <span class="material-symbols-outlined text-on-surface-variant text-[48px] mb-3">search_off</span>
            <h1 class="font-heading text-headline-md text-on-surface mb-2">Recurso no encontrado</h1>
            <p class="text-body-md text-on-surface-variant">Verifica el código bajo el QR o contacta a soporte.</p>
          </div>
        }
        @default {
          <div class="glass-card rounded-lg p-8 text-center">
            <span class="material-symbols-outlined text-error text-[48px] mb-3">error</span>
            <h1 class="font-heading text-headline-md text-on-surface mb-2">Algo salió mal</h1>
            <p class="text-body-md text-on-surface-variant">Intenta de nuevo en unos momentos.</p>
          </div>
        }
      }
    </div>
  `,
})
export class ResourceViewComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly http  = inject(HttpClient);

  readonly state    = signal<ViewState>('loading');
  readonly resource = signal<MyResource | null>(null);
  readonly meta     = signal({ icon: 'headphones', label: 'Audio' });

  constructor() {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.load(slug);
  }

  private async load(slug: string): Promise<void> {
    if (!slug) { this.state.set('not_found'); return; }
    try {
      const r = await firstValueFrom(
        this.http.get<MyResource>(`${environment.apiUrl}/me/resources/${slug}`)
      );
      this.resource.set(r);
      this.meta.set(TYPE_META[r.type] ?? TYPE_META[0]);
      this.state.set('ok');
    } catch (e) {
      const status = e instanceof HttpErrorResponse ? e.status : 0;
      this.state.set(status === 403 ? 'no_access' : status === 404 ? 'not_found' : 'error');
    }
  }
}
