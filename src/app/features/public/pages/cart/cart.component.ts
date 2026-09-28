import { Component, inject, computed } from '@angular/core';
import { MoneyPipe } from '../../../../shared/pipes/money.pipe';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { StoreContextService } from '../../services/store-context.service';
import { AuthService } from '../../../../core/services/auth.service';
import { TEXTS } from '../../../../core/i18n/texts';
import type { ProductType } from '../../../administration/models/product.model';

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

  protected readonly t = TEXTS.public.cart;

  readonly lines    = this.cart.lines;
  readonly subtotal = this.cart.subtotal;
  readonly count    = this.cart.count;

  readonly hasPhysical = computed(() => this.lines().some((l) => l.product.type === 'physical'));
  readonly shipping    = computed(() => 0);
  readonly taxes       = computed(() =>
    +this.lines().reduce((sum, l) => {
      const r = l.product.taxRate ?? 0;
      return sum + (l.lineTotal * r) / (100 + r);
    }, 0).toFixed(2)
  );
  readonly total       = computed(() => this.subtotal() + this.shipping());

  typeLabel(type: ProductType): string {
    return this.t.types[type];
  }

  inc(productId: string, qty: number): void { this.cart.setQuantity(productId, qty + 1); }
  dec(productId: string, qty: number): void { this.cart.setQuantity(productId, qty - 1); }
  remove(productId: string): void { this.cart.remove(productId); }

  proceedToCheckout(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigateByUrl(this.ctx.checkoutLink());
    } else {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: '/checkout' } });
    }
  }
}
