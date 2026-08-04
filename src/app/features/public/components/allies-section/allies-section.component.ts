import { Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../../environments/environment';

interface PublicAlly {
  id: string;
  name: string;
  description?: string | null;
  pillar: string;
  logoUrl?: string | null;
  brandColor: string;
  benefitTitle: string;
  benefitDescription?: string | null;
}

/**
 * Sección "Aliados" de la landing (pública). Muestra los aliados activos como
 * gancho: al activar un producto Sanatte se desbloquean sus convenios.
 */
@Component({
  selector: 'app-public-allies-section',
  imports: [RouterLink],
  template: `
    @if (allies().length) {
      <section id="aliados" class="max-w-6xl mx-auto py-12 scroll-mt-24">
        <div class="text-center max-w-2xl mx-auto mb-10">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed
                       text-on-primary-fixed-variant text-label-sm font-heading font-semibold mb-3">
            <span class="material-symbols-outlined text-[14px]">handshake</span>
            Aliados de bienestar
          </span>
          <h2 class="font-heading text-headline-lg text-on-surface mb-3">
            {{ variant() === 'app' ? 'Tus aliados' : 'Beneficios con nuestros aliados' }}
          </h2>
          <p class="font-sans text-body-md text-on-surface-variant">
            @if (variant() === 'app') {
              Especialistas en cada pilar de tu bienestar. Contáctalos para usar tu convenio.
            } @else {
              Especialistas en cada pilar de tu bienestar. Al activar un producto Sanatte
              desbloqueas sus convenios exclusivos.
            }
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (a of allies(); track a.id) {
            <a [routerLink]="variant() === 'landing' ? ['/aliados', a.id] : null"
               [class.cursor-pointer]="variant() === 'landing'"
               class="group bg-white rounded-2xl border border-transparent hover:border-primary/20
                      overflow-hidden flex flex-col transition-all"
               style="box-shadow: 0px 10px 30px rgba(76,29,149,0.05)">
              <!-- Cover -->
              <div class="relative aspect-video overflow-hidden" [style.background-color]="a.brandColor">
                @if (a.logoUrl) {
                  <img [src]="a.logoUrl" [alt]="a.name"
                       class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                  <div class="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                } @else {
                  <div class="w-full h-full flex items-center justify-center
                              group-hover:scale-105 transition-transform duration-500">
                    <span class="material-symbols-outlined text-white/70 text-[52px]">storefront</span>
                  </div>
                }
                <span class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded
                             text-[10px] font-heading font-bold uppercase tracking-widest text-on-surface">
                  {{ a.pillar }}
                </span>
              </div>

              <div class="p-5 flex-1 flex flex-col">
                <h3 class="font-heading text-headline-sm font-bold text-on-surface truncate">{{ a.name }}</h3>
                <p class="font-heading text-label-md text-primary mt-0.5 truncate">🎁 {{ a.benefitTitle }}</p>
                @if (a.description) {
                  <p class="text-label-sm text-on-surface-variant mt-2 line-clamp-2 flex-1">{{ a.description }}</p>
                }
                @if (variant() === 'landing') {
                  <span class="mt-4 pt-3 border-t border-outline-variant/20 inline-flex items-center gap-1
                               text-label-md font-heading font-bold text-primary group-hover:gap-2 transition-all">
                    Ver convenio
                    <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </span>
                }
              </div>
            </a>
          }
        </div>

        @if (variant() !== 'app') {
          <p class="text-center text-label-md font-heading text-on-surface-variant mt-8">
            <span class="material-symbols-outlined text-[18px] text-primary align-middle">lock_open</span>
            Los convenios se activan con tu producto Sanatte.
          </p>
        }
      </section>
    } @else if (variant() === 'app' && loaded()) {
      <div class="max-w-6xl mx-auto py-16 text-center">
        <span class="material-symbols-outlined text-primary-light text-[48px] mb-3">handshake</span>
        <h3 class="font-heading text-headline-md text-on-surface mb-1">Aún no hay aliados disponibles</h3>
        <p class="text-body-md text-on-surface-variant">Pronto sumaremos especialistas con convenios para ti.</p>
      </div>
    }
  `,
})
export class AlliesSectionComponent {
  private readonly http = inject(HttpClient);
  /** 'landing' (pública, con gancho) | 'app' (usuario autenticado). */
  readonly variant = input<'landing' | 'app'>('landing');
  readonly allies = signal<PublicAlly[]>([]);
  readonly loaded = signal(false);

  constructor() { this.load(); }

  private async load(): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.get<PublicAlly[]>(`${environment.apiUrl}/allies`)
      );
      this.allies.set(res ?? []);
    } catch {
      this.allies.set([]);
    } finally {
      this.loaded.set(true);
    }
  }
}
