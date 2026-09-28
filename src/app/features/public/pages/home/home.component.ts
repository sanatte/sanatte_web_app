import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../administration/services/product.service';
import { EntitlementService } from '../../../administration/services/entitlement.service';
import { CartService } from '../../services/cart.service';
import { StoreContextService } from '../../services/store-context.service';
import { StoreProductCardComponent } from '../../components/store-product-card/store-product-card.component';
import { AlliesSectionComponent } from '../../components/allies-section/allies-section.component';
import { MoneyPipe } from '../../../../shared/pipes/money.pipe';
import { Product, getPrimaryImage } from '../../../administration/models/product.model';
import { Resource, RESOURCE_TYPE_META } from '../../../administration/models/resource.model';
import { TEXTS } from '../../../../core/i18n/texts';

const PLENA_SKU = 'WLN-001';

@Component({
  selector: 'app-home',
  imports: [RouterLink, StoreProductCardComponent, AlliesSectionComponent, MoneyPipe],
  template: `
    @if (plena(); as p) {
      <section class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center py-6 lg:py-14">
        <div class="order-2 lg:order-1">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed
                       text-on-primary-fixed-variant text-[11px] sm:text-label-sm font-heading font-bold
                       uppercase tracking-wider mb-3 sm:mb-5">
            <span class="material-symbols-outlined text-[14px]">star</span>
            {{ t.hero.badge }}
          </span>
          <h1 class="font-heading text-5xl sm:text-display-lg text-on-surface leading-tight mb-3 sm:mb-4">
            {{ p.name }}<span class="text-primary">.</span>
          </h1>
          <p class="font-sans text-body-md sm:text-body-lg text-on-surface-variant mb-5 sm:mb-6 max-w-md">
            {{ t.hero.tagline }}
          </p>

          <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-5 sm:mb-6">
            <span class="font-heading text-headline-lg text-primary whitespace-nowrap">{{ p.price | money }}</span>
            @if (p.accessType === 'qr_activation') {
              <span class="inline-flex items-center gap-1 text-label-md font-heading text-on-surface-variant">
                <span class="material-symbols-outlined text-[16px] text-primary">qr_code_scanner</span>
                {{ t.hero.scanAndAccess }}
              </span>
            }
          </div>

          <div class="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            <a [routerLink]="ctx.productLink(p.id)"
               class="px-6 sm:px-8 py-3 sm:py-3.5 rounded-full gradient-primary text-white font-heading font-bold text-center
                      shadow-primary-lg hover:opacity-95 active:scale-[0.98] transition-all
                      flex items-center justify-center gap-2">
              {{ t.hero.learnMore }}
              <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
            </a>
            <button (click)="addToCart(p)"
                    class="px-6 sm:px-8 py-3 sm:py-3.5 rounded-full border border-primary text-primary font-heading font-bold
                           hover:bg-primary/5 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              <span class="material-symbols-outlined text-[20px]">add_shopping_cart</span>
              {{ t.hero.addToCart }}
            </button>
          </div>
        </div>

        <div class="order-1 lg:order-2 relative aspect-[4/3] rounded-lg overflow-hidden shadow-2xl">
          @if (plenaImageUrl(); as url) {
            <img [src]="url" [alt]="p.name" class="absolute inset-0 w-full h-full object-cover" />
          } @else {
            <div class="absolute inset-0 bg-gradient-to-br {{ plenaGradient() }}">
              <div class="absolute top-[-15%] right-[-10%] w-64 h-64 bg-white/15 rounded-full blur-3xl"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="material-symbols-outlined text-white/90 text-[120px]" style="font-variation-settings: 'FILL' 1;">
                  auto_stories
                </span>
              </div>
            </div>
          }
          @if (p.accessType === 'qr_activation') {
            <div class="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-2 rounded-full
                        bg-white/90 backdrop-blur text-primary text-label-sm font-heading font-bold">
              <span class="material-symbols-outlined text-[16px]">qr_code_2</span>
              {{ t.hero.unlockChip }}
            </div>
          }
        </div>
      </section>

      @if (plenaResources().length) {
        <section class="max-w-6xl mx-auto py-12">
          <div class="text-center max-w-xl mx-auto mb-10">
            <h2 class="font-heading text-headline-lg text-on-surface mb-3">{{ t.resources.title }}</h2>
            <p class="font-sans text-body-md text-on-surface-variant">
              {{ t.resources.description }}
            </p>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            @for (r of plenaResources(); track r.id) {
              <div class="glass-card rounded-lg p-5 text-center hover:shadow-card-hover transition-all">
                <div class="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center mx-auto mb-3">
                  <span class="material-symbols-outlined text-primary text-[24px]">{{ icon(r) }}</span>
                </div>
                <p class="font-heading font-semibold text-on-surface text-label-md line-clamp-2">{{ r.title }}</p>
                <p class="text-label-sm font-heading text-on-surface-variant mt-1 capitalize">{{ typeLabel(r) }}</p>
              </div>
            }
          </div>
        </section>
      }
    }

    <section class="max-w-6xl mx-auto py-12">
      <h2 class="font-heading text-headline-lg text-on-surface text-center mb-3">{{ t.howItWorks.title }}</h2>
      <p class="font-sans text-body-md text-on-surface-variant text-center max-w-xl mx-auto mb-10">
        {{ t.howItWorks.description }}
      </p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        @for (s of steps; track s.n) {
          <div class="relative p-6">
            <div class="w-12 h-12 rounded-full gradient-primary text-white font-heading font-bold text-lg
                        flex items-center justify-center mb-4">{{ s.n }}</div>
            <div class="flex items-center gap-2 mb-1">
              <span class="material-symbols-outlined text-primary text-[22px]">{{ s.icon }}</span>
              <h3 class="font-heading text-headline-md text-on-surface">{{ s.title }}</h3>
            </div>
            <p class="font-sans text-label-md text-on-surface-variant">{{ s.desc }}</p>
          </div>
        }
      </div>
    </section>

    @if (more().length) {
      <section class="max-w-6xl mx-auto py-12">
        <div class="flex items-center justify-between mb-8">
          <h2 class="font-heading text-headline-lg text-on-surface">{{ t.more.title }}</h2>
          <a [routerLink]="ctx.productsLink()" class="text-primary font-heading font-bold hover:underline flex items-center gap-1">
            {{ t.more.viewCatalog }} <span class="material-symbols-outlined text-[18px]">chevron_right</span>
          </a>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (p of more(); track p.id) {
            <app-store-product-card [product]="p" (add)="addToCart($event)" />
          }
        </div>
      </section>
    }

    <app-public-allies-section />

    <section class="max-w-6xl mx-auto py-12">
      <div class="rounded-lg gradient-primary text-white p-8 md:p-12 relative overflow-hidden text-center">
        <div class="absolute top-[-20%] right-[-5%] w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div class="relative z-10 max-w-xl mx-auto">
          <h2 class="font-heading text-headline-lg mb-3">{{ t.cta.title }}</h2>
          <p class="font-sans text-body-md text-white/85 mb-6">
            {{ t.cta.description }}
          </p>
          <a routerLink="/auth/register"
             class="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-primary
                    font-heading font-bold hover:shadow-[0px_0px_20px_rgba(255,255,255,0.4)] transition-all">
            {{ t.cta.createAccount }}
            <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
          </a>
        </div>
      </div>
    </section>

    @if (addedName()) {
      <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-on-surface text-white px-5 py-3
                  rounded-full shadow-xl flex items-center gap-2 text-label-md font-heading">
        <span class="material-symbols-outlined text-green-400 text-[18px]">check_circle</span>
        {{ t.addedToCart(addedName()!) }}
      </div>
    }
  `,
})
export class HomeComponent {
  private readonly products     = inject(ProductService);
  private readonly entitlements = inject(EntitlementService);
  private readonly cart         = inject(CartService);
  readonly ctx                  = inject(StoreContextService);

  protected readonly t = TEXTS.public.home;

  readonly plena = computed<Product | null>(() => {
    const all = this.products.products();
    return all.find((p) => p.sku === PLENA_SKU)
        ?? all.find((p) => p.type === 'physical' && p.status === 'active')
        ?? all.find((p) => p.status === 'active')
        ?? null;
  });

  readonly plenaImageUrl = computed(() =>
    this.plena() ? getPrimaryImage(this.plena()!)?.url ?? null : null
  );

  readonly plenaGradient = computed(() =>
    (this.plena() && getPrimaryImage(this.plena()!)?.gradient) || 'from-brand-400 via-brand-600 to-brand-900'
  );

  readonly plenaResources = computed<Resource[]>(() => {
    const p = this.plena();
    return p ? this.entitlements.getResourcesForProduct(p) : [];
  });

  readonly more = computed<Product[]>(() => {
    const heroId = this.plena()?.id;
    return this.products.products().filter((p) => p.status === 'active' && p.id !== heroId).slice(0, 4);
  });

  readonly addedName = signal<string | null>(null);

  readonly steps = [
    { n: 1, icon: 'shopping_bag',    ...this.t.howItWorks.steps.buy },
    { n: 2, icon: 'qr_code_scanner', ...this.t.howItWorks.steps.activate },
    { n: 3, icon: 'auto_stories',    ...this.t.howItWorks.steps.access },
  ];

  icon(r: Resource): string { return RESOURCE_TYPE_META[r.type].icon; }
  typeLabel(r: Resource): string { return RESOURCE_TYPE_META[r.type].label; }

  addToCart(product: Product): void {
    this.cart.add(product.id);
    this.addedName.set(product.name);
    setTimeout(() => this.addedName.set(null), 2200);
  }
}
