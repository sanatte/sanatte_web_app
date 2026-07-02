import { Component, inject, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { StoreContextService } from '../../services/store-context.service';
import { MockAuthService } from '../../../../core/services/mock-auth.service';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart.component.html',
})
export class CartComponent {
  private readonly cart   = inject(CartService);
  private readonly auth   = inject(MockAuthService);
  private readonly router = inject(Router);
  readonly ctx            = inject(StoreContextService);

  readonly lines    = this.cart.lines;
  readonly subtotal = this.cart.subtotal;
  readonly count    = this.cart.count;

  readonly hasPhysical = computed(() => this.lines().some((l) => l.product.type === 'physical'));
  readonly shipping    = computed(() => (this.hasPhysical() && this.subtotal() > 0 ? 12.5 : 0));
  readonly taxes       = computed(() => +(this.subtotal() * 0.08).toFixed(2));
  readonly total       = computed(() => this.subtotal() + this.shipping() + this.taxes());

  typeLabel(type: string): string {
    return type === 'physical' ? 'Producto físico' : type === 'subscription' ? 'Suscripción' : 'Producto digital';
  }

  inc(productId: string, qty: number): void { this.cart.setQuantity(productId, qty + 1); }
  dec(productId: string, qty: number): void { this.cart.setQuantity(productId, qty - 1); }
  remove(productId: string): void { this.cart.remove(productId); }

  proceedToCheckout(): void {
    // Regla de negocio: comprar requiere cuenta.
    if (this.auth.isAuthenticated()) {
      this.router.navigateByUrl(this.ctx.checkoutLink()); // /app/checkout
    } else {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: '/checkout' } });
    }
  }
}
