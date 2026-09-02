import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CartService } from './cart.service';
import { environment } from '../../../../environments/environment';
import { DiscountCodeValidation } from '../../administration/models/ally.model';

interface CheckoutResult { orderId: string; orderNumber: string; initPoint: string; }

const LAST_ORDER_KEY = 'sanatte_last_order';

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private readonly http = inject(HttpClient);
  private readonly cart = inject(CartService);
  private readonly base = `${environment.apiUrl}/checkout`;
  private readonly alliesBase = `${environment.apiUrl}/allies`;

  readonly appliedCode    = signal<string | null>(null);
  readonly discountInfo   = signal<DiscountCodeValidation | null>(null);
  readonly validatingCode = signal(false);

  /** Valida un código de descuento contra el backend. */
  async validateDiscountCode(code: string): Promise<DiscountCodeValidation> {
    this.validatingCode.set(true);
    try {
      const result = await firstValueFrom(
        this.http.get<DiscountCodeValidation>(
          `${this.alliesBase}/discount-codes/${encodeURIComponent(code.trim().toUpperCase())}`
        )
      );
      if (result.isValid) {
        this.appliedCode.set(code.trim().toUpperCase());
        this.discountInfo.set(result);
      }
      return result;
    } finally {
      this.validatingCode.set(false);
    }
  }

  removeDiscount(): void {
    this.appliedCode.set(null);
    this.discountInfo.set(null);
  }

  /** Crea la preferencia y redirige a Mercado Pago. */
  async startPayment(): Promise<void> {
    const items = this.cart.items().map((i) => ({ productId: i.productId, quantity: i.quantity }));
    if (items.length === 0) return;
    const body: Record<string, unknown> = { items };
    if (this.appliedCode()) body['discountCode'] = this.appliedCode();
    const res = await firstValueFrom(this.http.post<CheckoutResult>(this.base, body));
    localStorage.setItem(LAST_ORDER_KEY, res.orderNumber);
    window.location.href = res.initPoint;
  }

  /** Confirma un pago por su id (lo usa la página de retorno). */
  async confirm(paymentId: string): Promise<boolean> {
    const res = await firstValueFrom(
      this.http.post<{ paid: boolean }>(`${this.base}/confirm?paymentId=${encodeURIComponent(paymentId)}`, {})
    );
    if (res.paid) this.removeDiscount();
    return res.paid;
  }

  lastOrderNumber(): string | null {
    return localStorage.getItem(LAST_ORDER_KEY);
  }
}
