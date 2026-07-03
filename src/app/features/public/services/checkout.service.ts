import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CartService } from './cart.service';
import { environment } from '../../../../environments/environment';

interface CheckoutResult { orderId: string; orderNumber: string; initPoint: string; }

const LAST_ORDER_KEY = 'sanatte_last_order';

/**
 * CheckoutService — inicia el pago con Mercado Pago (Checkout Pro).
 *
 * Envía los items del carrito al backend, que crea un pedido pendiente y la
 * preferencia de pago, y devuelve el init_point. Redirigimos el navegador a MP;
 * el comprador vuelve a /app/checkout/result. El pedido se confirma por webhook
 * (prod) o por la página de retorno (confirm) usando el payment_id.
 */
@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private readonly http = inject(HttpClient);
  private readonly cart = inject(CartService);
  private readonly base = `${environment.apiUrl}/checkout`;

  /** Crea la preferencia y redirige a Mercado Pago. */
  async startPayment(): Promise<void> {
    const items = this.cart.items().map((i) => ({ productId: i.productId, quantity: i.quantity }));
    if (items.length === 0) return;
    const res = await firstValueFrom(this.http.post<CheckoutResult>(this.base, { items }));
    localStorage.setItem(LAST_ORDER_KEY, res.orderNumber);
    window.location.href = res.initPoint; // sale a Mercado Pago
  }

  /** Confirma un pago por su id (lo usa la página de retorno). */
  async confirm(paymentId: string): Promise<boolean> {
    const res = await firstValueFrom(
      this.http.post<{ paid: boolean }>(`${this.base}/confirm?paymentId=${encodeURIComponent(paymentId)}`, {})
    );
    return res.paid;
  }

  lastOrderNumber(): string | null {
    return localStorage.getItem(LAST_ORDER_KEY);
  }
}
