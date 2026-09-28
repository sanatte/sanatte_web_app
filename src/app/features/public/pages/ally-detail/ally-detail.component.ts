import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { TEXTS } from '../../../../core/i18n/texts';

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

@Component({
  selector: 'app-ally-detail',
  imports: [RouterLink],
  template: `
    <div class="max-w-3xl mx-auto px-4 py-8">
      <a routerLink="/" fragment="aliados"
         class="inline-flex items-center gap-1.5 text-label-md font-heading text-on-surface-variant
                hover:text-primary transition-colors mb-5">
        <span class="material-symbols-outlined text-[20px]">arrow_back</span> {{ t.back }}
      </a>

      @switch (state()) {
        @case ('loading') {
          <div class="flex justify-center py-24">
            <span class="material-symbols-outlined animate-spin text-primary text-[32px]">progress_activity</span>
          </div>
        }
        @case ('ok') {
          <article class="bg-white rounded-2xl border border-outline-variant/20 overflow-hidden">
            <div class="h-40 relative flex items-center justify-center" [style.background-color]="ally()!.brandColor">
              @if (ally()!.logoUrl) {
                <img [src]="ally()!.logoUrl" [alt]="ally()!.name" class="h-24 w-24 rounded-2xl object-cover bg-white/20"/>
              } @else {
                <span class="material-symbols-outlined text-white/90 text-[64px]">storefront</span>
              }
            </div>

            <div class="p-6 md:p-8">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed
                           text-on-primary-fixed-variant text-label-sm font-heading font-semibold mb-3">
                {{ ally()!.pillar }}
              </span>
              <h1 class="font-heading text-headline-lg text-on-surface mb-2">{{ ally()!.name }}</h1>

              @if (ally()!.description) {
                <p class="text-body-md text-on-surface-variant leading-relaxed mb-6">{{ ally()!.description }}</p>
              }

              <div class="rounded-xl border border-primary/20 bg-primary/5 p-5 mb-6">
                <p class="text-label-sm font-heading text-primary uppercase tracking-widest mb-1">{{ t.benefit }}</p>
                <p class="font-heading text-headline-md text-on-surface">🎁 {{ ally()!.benefitTitle }}</p>
                @if (ally()!.benefitDescription) {
                  <p class="text-body-md text-on-surface-variant mt-2">{{ ally()!.benefitDescription }}</p>
                }
              </div>

              <div class="rounded-xl gradient-primary text-white p-6 text-center">
                <p class="font-heading text-body-lg mb-1">{{ t.cta.title }}</p>
                <p class="text-label-md text-white/85 mb-4">
                  {{ t.cta.description }}
                </p>
                <a routerLink="/products"
                   class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-primary
                          font-heading font-bold hover:shadow-[0px_0px_20px_rgba(255,255,255,0.4)] transition-all">
                  {{ t.cta.viewProducts }} <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
                </a>
              </div>
            </div>
          </article>
        }
        @default {
          <div class="glass-card rounded-lg p-10 text-center">
            <span class="material-symbols-outlined text-on-surface-variant text-[48px] mb-3">search_off</span>
            <h1 class="font-heading text-headline-md text-on-surface mb-2">{{ t.notFound.title }}</h1>
            <a routerLink="/" fragment="aliados" class="text-primary font-heading font-bold hover:underline">{{ t.notFound.viewAllies }}</a>
          </div>
        }
      }
    </div>
  `,
})
export class AllyDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly http  = inject(HttpClient);

  protected readonly t = TEXTS.public.allyDetail;

  readonly state = signal<'loading' | 'ok' | 'notfound'>('loading');
  readonly ally  = signal<PublicAlly | null>(null);

  constructor() {
    this.load(this.route.snapshot.paramMap.get('id') ?? '');
  }

  private async load(id: string): Promise<void> {
    if (!id) { this.state.set('notfound'); return; }
    try {
      const a = await firstValueFrom(
        this.http.get<PublicAlly>(`${environment.apiUrl}/allies/${id}`)
      );
      this.ally.set(a);
      this.state.set('ok');
    } catch {
      this.state.set('notfound');
    }
  }
}
