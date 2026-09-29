import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CheckoutService } from '../../services/checkout.service';
import { CartService } from '../../services/cart.service';
import { UserOrdersService } from '../../../orders/services/user-orders.service';
import { UserLibraryService } from '../../../library/services/user-library.service';
import { TEXTS } from '../../../../core/i18n/texts';

type ResultState = 'checking' | 'success' | 'pending' | 'failure';

@Component({
  selector: 'app-checkout-result',
  imports: [RouterLink],
  template: `
    <div class="max-w-lg mx-auto py-16 px-4 text-center">
      @switch (state()) {
        @case ('checking') {
          <span class="material-symbols-outlined animate-spin text-primary text-[36px] mb-3">progress_activity</span>
          <p class="font-heading text-on-surface-variant">{{ t.checking }}</p>
        }
        @case ('success') {
          <div class="glass-card rounded-lg p-8">
            <span class="material-symbols-outlined text-emerald-500 text-[56px] mb-2">check_circle</span>
            <h1 class="font-heading text-headline-md text-on-surface mb-1">{{ t.success.title }}</h1>
            <p class="text-body-md text-on-surface-variant mb-1">{{ t.success.thanks }}</p>
            @if (orderNumber()) {
              <p class="text-label-md font-heading text-on-surface-variant mb-6">{{ t.success.order(orderNumber()!) }}</p>
            }
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <a routerLink="/app/orders" class="px-6 py-3 gradient-primary text-white rounded-full text-label-md font-heading font-bold">{{ t.success.viewOrders }}</a>
              <a routerLink="/app/library" class="px-6 py-3 rounded-full border border-outline-variant text-label-md font-heading font-semibold text-on-surface hover:bg-surface-container-low">{{ t.success.goToLibrary }}</a>
            </div>
          </div>
        }
        @case ('pending') {
          <div class="glass-card rounded-lg p-8">
            <span class="material-symbols-outlined text-amber-500 text-[56px] mb-2">schedule</span>
            <h1 class="font-heading text-headline-md text-on-surface mb-1">{{ t.pending.title }}</h1>
            <p class="text-body-md text-on-surface-variant mb-6">
              {{ t.pending.description }}
            </p>
            <a routerLink="/app/orders" class="px-6 py-3 gradient-primary text-white rounded-full text-label-md font-heading font-bold">{{ t.pending.viewOrders }}</a>
          </div>
        }
        @default {
          <div class="glass-card rounded-lg p-8">
            <span class="material-symbols-outlined text-error text-[56px] mb-2">cancel</span>
            <h1 class="font-heading text-headline-md text-on-surface mb-1">{{ t.failure.title }}</h1>
            <p class="text-body-md text-on-surface-variant mb-6">{{ t.failure.description }}</p>
            <a routerLink="/app/checkout" class="px-6 py-3 gradient-primary text-white rounded-full text-label-md font-heading font-bold">{{ t.failure.backToCheckout }}</a>
          </div>
        }
      }
    </div>
  `,
})
export class CheckoutResultComponent {
  private readonly route    = inject(ActivatedRoute);
  private readonly checkout = inject(CheckoutService);
  private readonly cart     = inject(CartService);
  private readonly orders   = inject(UserOrdersService);
  private readonly library  = inject(UserLibraryService);

  protected readonly t = TEXTS.public.checkoutResult;

  readonly state       = signal<ResultState>('checking');
  readonly orderNumber = signal<string | null>(this.checkout.lastOrderNumber());

  constructor() {
    const q = this.route.snapshot.queryParamMap;
    const outcome = q.get('outcome');
    const paymentId = q.get('payment_id') ?? q.get('collection_id');
    this.resolve(outcome, paymentId);
  }

  private async resolve(outcome: string | null, paymentId: string | null): Promise<void> {
    const mobile = this.route.snapshot.queryParamMap.has('mobile');

    if (outcome === 'failure') { this.finish('failure', mobile); return; }

    if (paymentId) {
      const paid = await this.checkout.confirm(paymentId).catch(() => false);
      if (paid) {
        this.cart.clear();
        this.orders.load();
        this.library.load();
        this.finish('success', mobile);
        return;
      }
    }

    if (outcome === 'success') { this.cart.clear(); this.orders.load(); this.library.load(); this.finish('success', mobile); }
    else { this.finish('pending', mobile); }
  }

  /** Fija el estado y, en flujo móvil, devuelve a la app por deep link. */
  private finish(state: ResultState, mobile: boolean): void {
    this.state.set(state);
    if (!mobile) return;
    const scheme = state === 'success' ? 'payment-success' : state === 'pending' ? 'payment-pending' : 'payment-failure';
    window.location.href = `sanatte://${scheme}?order=${this.orderNumber() ?? ''}`;
  }
}
