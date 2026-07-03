import { Component, inject, signal, computed } from '@angular/core';
import { MoneyPipe } from '../../../../shared/pipes/money.pipe';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { StoreContextService } from '../../services/store-context.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-checkout',
  imports: [MoneyPipe, FormsModule, RouterLink],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent {
  private readonly cart     = inject(CartService);
  private readonly checkout = inject(CheckoutService);
  private readonly auth     = inject(AuthService);
  readonly ctx              = inject(StoreContextService);

  readonly lines    = this.cart.lines;
  readonly subtotal = this.cart.subtotal;

  readonly hasPhysical = computed(() => this.lines().some((l) => l.product.type === 'physical'));
  readonly shipping    = computed(() => (this.hasPhysical() && this.subtotal() > 0 ? 12.5 : 0));
  readonly taxes       = computed(() => +(this.subtotal() * 0.08).toFixed(2));
  readonly total       = computed(() => this.subtotal() + this.shipping() + this.taxes());

  readonly userName  = computed(() => this.auth.currentUser()?.displayName ?? '');
  readonly userEmail = computed(() => this.auth.currentUser()?.email ?? '');

  // Estado del pedido realizado (el éxito real se muestra en /checkout/result)
  readonly placed      = signal(false);
  readonly orderNumber = signal('');
  readonly paying      = signal(false);
  readonly errorMessage = signal('');

  // Datos de envío (solo físicos)
  shipName = '';
  shipAddress = '';
  shipCity = '';

  readonly canPay = computed(() => this.total() > 0);

  /** Inicia el pago: crea la preferencia y redirige a Mercado Pago. */
  async placeOrder(): Promise<void> {
    if (!this.canPay() || this.paying()) return;
    this.errorMessage.set('');
    this.paying.set(true);
    try {
      await this.checkout.startPayment(); // redirige a MP (no vuelve aquí)
    } catch {
      this.errorMessage.set('No pudimos iniciar el pago. Intenta de nuevo.');
      this.paying.set(false);
    }
  }
}
