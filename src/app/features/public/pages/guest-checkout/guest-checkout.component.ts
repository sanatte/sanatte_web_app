import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MoneyPipe } from '../../../../shared/pipes/money.pipe';
import { CheckoutService } from '../../services/checkout.service';
import { ProductService } from '../../../administration/services/product.service';
import { Product } from '../../../administration/models/product.model';
import { TEXTS } from '../../../../core/i18n/texts';

/**
 * Checkout de invitado para la app móvil: llega por deep link con `userId`
 * (FirebaseUid) y `productId`. Crea el pago sin sesión en el navegador y
 * redirige a Mercado Pago.
 */
@Component({
  selector: 'app-guest-checkout',
  imports: [MoneyPipe],
  template: `
    <div class="max-w-lg mx-auto py-16 px-4">
      <div class="glass-card rounded-lg p-8">
        <h1 class="font-heading text-headline-lg text-on-surface mb-6">{{ t.guest.title }}</h1>

        @if (loading()) {
          <div class="flex items-center justify-center py-10">
            <span class="material-symbols-outlined animate-spin text-primary text-[32px]">progress_activity</span>
          </div>
        } @else if (!product()) {
          <p class="text-body-md text-on-surface-variant text-center py-6">{{ t.guest.productNotFound }}</p>
        } @else {
          <div class="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low mb-6">
            <div class="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
              @if (primaryImageUrl(); as img) {
                <img [src]="img" [alt]="product()!.name" class="w-full h-full object-cover" />
              } @else {
                <div class="w-full h-full bg-gradient-to-br {{ gradient() }}"></div>
              }
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-heading font-semibold text-on-surface text-label-md truncate">{{ product()!.name }}</p>
              <p class="text-label-sm font-heading text-on-surface-variant">x1</p>
            </div>
            <span class="font-heading font-bold text-on-surface text-label-md">{{ product()!.price | money }}</span>
          </div>

          <div class="flex items-center gap-2 mb-4 text-label-md text-on-surface-variant">
            <span class="material-symbols-outlined text-primary">lock</span>
            <span>{{ t.guest.secure }}</span>
          </div>

          @if (errorMessage()) {
            <p class="mb-3 text-label-md font-heading text-error flex items-center gap-1">
              <span class="material-symbols-outlined text-[16px]">error</span>{{ errorMessage() }}
            </p>
          }

          <button (click)="pay()" [disabled]="paying()"
                  class="w-full py-3.5 rounded-full gradient-primary text-white font-heading font-bold
                         shadow-primary hover:opacity-90 active:scale-95 transition-all
                         flex items-center justify-center gap-2 disabled:opacity-50">
            <span class="material-symbols-outlined text-[20px]">{{ paying() ? 'progress_activity' : 'lock' }}</span>
            {{ paying() ? t.guest.redirecting : t.guest.pay(product()!.price | money) }}
          </button>
        }
      </div>
    </div>
  `,
})
export class GuestCheckoutComponent {
  private readonly route    = inject(ActivatedRoute);
  private readonly checkout = inject(CheckoutService);
  private readonly products = inject(ProductService);

  protected readonly t = TEXTS.public.checkout;

  readonly userId    = signal(this.route.snapshot.queryParamMap.get('userId') ?? '');
  readonly productId = signal(this.route.snapshot.queryParamMap.get('productId') ?? '');
  readonly discountCode = signal(this.route.snapshot.queryParamMap.get('discountCode') ?? '');

  readonly loading = signal(true);
  readonly paying  = signal(false);
  readonly errorMessage = signal('');

  readonly product = signal<Product | null>(null);

  readonly primaryImageUrl = computed(() => {
    const imgs = this.product()?.images ?? [];
    return (imgs.find((i) => i.isPrimary) ?? imgs[0])?.url ?? null;
  });
  readonly gradient = computed(() => {
    const imgs = this.product()?.images ?? [];
    return (imgs.find((i) => i.isPrimary) ?? imgs[0])?.gradient ?? 'from-brand-400 to-foil-500';
  });

  constructor() {
    this.load();
  }

  private async load(): Promise<void> {
    const id = this.productId();
    if (!id || !this.userId()) { this.loading.set(false); return; }
    try {
      const product = await this.products.fetchById(id);
      this.product.set(product ?? null);
    } finally {
      this.loading.set(false);
    }
  }

  async pay(): Promise<void> {
    const product = this.product();
    const uid = this.userId();
    if (!product || !uid || this.paying()) return;
    this.errorMessage.set('');
    this.paying.set(true);
    try {
      await this.checkout.startGuestPayment(product.id, uid, this.discountCode() || undefined);
    } catch {
      this.errorMessage.set(this.t.guest.startError);
      this.paying.set(false);
    }
  }
}
