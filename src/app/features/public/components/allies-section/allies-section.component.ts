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
               class="bg-white rounded-2xl border border-outline-variant/20 overflow-hidden flex flex-col
                      hover:shadow-[0px_20px_40px_rgba(76,29,149,0.1)] transition-all">
              <div class="h-24 relative flex items-center justify-center" [style.background-color]="a.brandColor">
                @if (a.logoUrl) {
                  <img [src]="a.logoUrl" [alt]="a.name" class="h-16 w-16 rounded-xl object-cover bg-white/20"/>
                } @else {
                  <span class="material-symbols-outlined text-white/90 text-[40px]">storefront</span>
                }
                <span class="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/85 text-[10px]
                             font-heading font-bold uppercase tracking-wider text-on-surface">{{ a.pillar }}</span>
              </div>
              <div class="p-5 flex-1 flex flex-col">
                <h3 class="font-heading text-headline-sm font-bold text-on-surface">{{ a.name }}</h3>
                <p class="font-heading text-label-md text-primary mt-1">🎁 {{ a.benefitTitle }}</p>
                @if (a.description) {
                  <p class="text-label-sm text-on-surface-variant mt-2 line-clamp-2 flex-1">{{ a.description }}</p>
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
