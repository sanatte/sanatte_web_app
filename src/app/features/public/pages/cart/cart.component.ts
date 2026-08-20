import { Component, inject, computed } from '@angular/core';
import { MoneyPipe } from '../../../../shared/pipes/money.pipe';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { StoreContextService } from '../../services/store-context.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-cart',
  imports: [MoneyPipe, RouterLink],
  templateUrl: './cart.component.html',
})
export class CartComponent {
  private readonly cart   = inject(CartService);
  private readonly auth   = inject(AuthService);
  private readonly router = inject(Router);
  readonly ctx            = inject(StoreContextService);

  readonly lines    = this.cart.lines;
  readonly subtotal = this.cart.subtotal;
  readonly count    = this.cart.count;

  readonly hasPhysical = computed(() => this.lines().some((l) => l.product.type === 'physical'));
  // Envío aún no se cobra en el backend → 0 (se mostrará "Gratis"). Pendiente: cálculo real.
  readonly shipping    = computed(() => 0);
  // IVA DISCRIMINADO (informativo): el precio ya lo incluye, no se suma al total.
  // Por línea: porción de IVA = precio * tasa / (100 + tasa), con la tasa del producto.
  readonly taxes       = computed(() =>
    +this.lines().reduce((sum, l) => {
      const r = l.product.taxRate ?? 0;
      return sum + (l.lineTotal * r) / (100 + r);
    }, 0).toFixed(2)
  );
  // El IVA ya está dentro del subtotal → total = subtotal + envío (no se suma el IVA).
  readonly total       = computed(() => this.subtotal() + this.shipping());

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
