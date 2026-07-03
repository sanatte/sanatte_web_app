import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CheckoutService } from '../../services/checkout.service';
import { CartService } from '../../services/cart.service';
import { UserOrdersService } from '../../../orders/services/user-orders.service';
import { UserLibraryService } from '../../../library/services/user-library.service';

type ResultState = 'checking' | 'success' | 'pending' | 'failure';

/**
 * CheckoutResult — destino de retorno de Mercado Pago (`/app/checkout/result`).
 *
 * MP agrega `payment_id` y su `status` a la URL; nosotros agregamos `outcome`.
 * Confirmamos el pago contra el backend (por si el webhook aún no llegó — típico
 * en dev sin URL pública), vaciamos el carrito y refrescamos pedidos/biblioteca.
 */
@Component({
  selector: 'app-checkout-result',
  imports: [RouterLink],
  template: `
    <div class="max-w-lg mx-auto py-16 px-4 text-center">
      @switch (state()) {
        @case ('checking') {
          <span class="material-symbols-outlined animate-spin text-primary text-[36px] mb-3">progress_activity</span>
          <p class="font-heading text-on-surface-variant">Confirmando tu pago…</p>
        }
        @case ('success') {
          <div class="glass-card rounded-lg p-8">
            <span class="material-symbols-outlined text-emerald-500 text-[56px] mb-2">check_circle</span>
            <h1 class="font-heading text-headline-md text-on-surface mb-1">¡Pago confirmado!</h1>
            <p class="text-body-md text-on-surface-variant mb-1">Gracias por tu compra.</p>
            @if (orderNumber()) {
              <p class="text-label-md font-heading text-on-surface-variant mb-6">Pedido {{ orderNumber() }}</p>
            }
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <a routerLink="/app/orders" class="px-6 py-3 gradient-primary text-white rounded-full text-label-md font-heading font-bold">Ver mis pedidos</a>
              <a routerLink="/app/library" class="px-6 py-3 rounded-full border border-outline-variant text-label-md font-heading font-semibold text-on-surface hover:bg-surface-container-low">Ir a mi biblioteca</a>
            </div>
          </div>
        }
        @case ('pending') {
          <div class="glass-card rounded-lg p-8">
            <span class="material-symbols-outlined text-amber-500 text-[56px] mb-2">schedule</span>
            <h1 class="font-heading text-headline-md text-on-surface mb-1">Pago en proceso</h1>
            <p class="text-body-md text-on-surface-variant mb-6">
              Tu pago está siendo procesado (ej. Efecty/PSE). Te avisaremos cuando se acredite; lo verás en "Mis pedidos".
            </p>
            <a routerLink="/app/orders" class="px-6 py-3 gradient-primary text-white rounded-full text-label-md font-heading font-bold">Ver mis pedidos</a>
          </div>
        }
        @default {
          <div class="glass-card rounded-lg p-8">
            <span class="material-symbols-outlined text-error text-[56px] mb-2">cancel</span>
            <h1 class="font-heading text-headline-md text-on-surface mb-1">El pago no se completó</h1>
            <p class="text-body-md text-on-surface-variant mb-6">No se realizó ningún cargo. Puedes intentarlo de nuevo.</p>
            <a routerLink="/app/checkout" class="px-6 py-3 gradient-primary text-white rounded-full text-label-md font-heading font-bold">Volver al checkout</a>
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

  readonly state       = signal<ResultState>('checking');
  readonly orderNumber = signal<string | null>(this.checkout.lastOrderNumber());

  constructor() {
    const q = this.route.snapshot.queryParamMap;
    const outcome = q.get('outcome');
    const paymentId = q.get('payment_id') ?? q.get('collection_id');
    this.resolve(outcome, paymentId);
  }

  private async resolve(outcome: string | null, paymentId: string | null): Promise<void> {
    if (outcome === 'failure') { this.state.set('failure'); return; }

    // Éxito/pendiente: confirmamos contra el backend con el payment_id de MP.
    if (paymentId) {
      try {
        const paid = await this.checkout.confirm(paymentId);
        if (paid) {
          this.cart.clear();
          this.orders.load();
          this.library.load();
          this.state.set('success');
          return;
        }
      } catch { /* cae al estado por outcome */ }
    }

    if (outcome === 'success') { this.cart.clear(); this.orders.load(); this.library.load(); this.state.set('success'); }
    else { this.state.set('pending'); }
  }
}
