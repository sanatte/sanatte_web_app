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
  readonly shipping    = computed(() => 0);
  readonly taxes       = computed(() =>
    +this.lines().reduce((sum, l) => {
      const r = l.product.taxRate ?? 0;
      return sum + (l.lineTotal * r) / (100 + r);
    }, 0).toFixed(2)
  );

  // Descuento aplicado
  readonly appliedCode  = this.checkout.appliedCode;
  readonly discountInfo = this.checkout.discountInfo;
  readonly discountAmount = computed(() => {
    const pct = this.discountInfo()?.discountPercentage;
    return pct ? Math.round(this.subtotal() * pct) / 100 : 0;
  });
  readonly total = computed(() => this.subtotal() + this.shipping() - this.discountAmount());

  readonly userName  = computed(() => this.auth.currentUser()?.displayName ?? '');
  readonly userEmail = computed(() => this.auth.currentUser()?.email ?? '');

  readonly placed       = signal(false);
  readonly orderNumber  = signal('');
  readonly paying       = signal(false);
  readonly errorMessage = signal('');

  // Campo de código de descuento
  discountCodeInput = '';
  readonly discountError   = signal('');
  readonly validatingCode  = this.checkout.validatingCode;

  // Datos de envío (solo físicos)
  shipName = '';
  shipAddress = '';
  shipCity = '';

  readonly canPay = computed(() => this.total() > 0);

  async applyDiscountCode(): Promise<void> {
    if (!this.discountCodeInput.trim()) return;
    this.discountError.set('');
    const result = await this.checkout.validateDiscountCode(this.discountCodeInput);
    if (!result.isValid) {
      this.discountError.set(result.errorMessage ?? 'Código no válido.');
    }
    this.discountCodeInput = '';
  }

  removeDiscount(): void {
    this.checkout.removeDiscount();
    this.discountError.set('');
  }

  async placeOrder(): Promise<void> {
    if (!this.canPay() || this.paying()) return;
    this.errorMessage.set('');
    this.paying.set(true);
    try {
      await this.checkout.startPayment();
    } catch {
      this.errorMessage.set('No pudimos iniciar el pago. Intenta de nuevo.');
      this.paying.set(false);
    }
  }
}
