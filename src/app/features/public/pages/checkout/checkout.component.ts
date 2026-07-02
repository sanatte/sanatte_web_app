import { Component, inject, signal, computed } from '@angular/core';
import { MoneyPipe } from '../../../../shared/pipes/money.pipe';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { StoreContextService } from '../../services/store-context.service';
import { MockAuthService } from '../../../../core/services/mock-auth.service';

@Component({
  selector: 'app-checkout',
  imports: [MoneyPipe, FormsModule, RouterLink],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent {
  private readonly cart = inject(CartService);
  private readonly auth = inject(MockAuthService);
  readonly ctx          = inject(StoreContextService);

  readonly lines    = this.cart.lines;
  readonly subtotal = this.cart.subtotal;

  readonly hasPhysical = computed(() => this.lines().some((l) => l.product.type === 'physical'));
  readonly shipping    = computed(() => (this.hasPhysical() && this.subtotal() > 0 ? 12.5 : 0));
  readonly taxes       = computed(() => +(this.subtotal() * 0.08).toFixed(2));
  readonly total       = computed(() => this.subtotal() + this.shipping() + this.taxes());

  readonly userName  = computed(() => this.auth.currentUser()?.displayName ?? '');
  readonly userEmail = computed(() => this.auth.currentUser()?.email ?? '');

  // Estado del pedido realizado
  readonly placed      = signal(false);
  readonly orderNumber = signal('');

  // Datos de envío (solo físicos) — mock
  shipName = '';
  shipAddress = '';
  shipCity = '';
  // Pago — mock
  cardNumber = '';
  cardExpiry = '';
  cardCvc = '';

  readonly canPay = computed(() => this.total() > 0);

  placeOrder(): void {
    if (!this.canPay()) return;
    const n = 1000 + Math.floor(Math.random() * 9000);
    this.orderNumber.set(`#SAN-${n}`);
    this.placed.set(true);
    this.cart.clear();
  }
}
