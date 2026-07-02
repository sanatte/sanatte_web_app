import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Order, DeliveryStatus, PaymentStatus } from '../models/order.model';
import { ProductType } from '../models/product.model';
import { environment } from '../../../../environments/environment';

interface PagedResult<T> { items: T[]; page: number; pageSize: number; totalItems: number; }
interface ApiStats { total: number; pendingShipment: number; totalRevenue: number; }

// ─── Normalización de enums C# (int) → strings del front ────────────────────
const PAYMENT_MAP: Record<number, PaymentStatus> = { 0: 'pending', 1: 'paid', 2: 'cancelled' };
const DELIVERY_MAP: Record<number, DeliveryStatus> = {
  0: 'preparing', 1: 'shipped', 2: 'delivered', 3: 'pending_activation',
  4: 'digital_active', 5: 'subscription_active', 6: 'cancelled',
};
const TYPE_MAP: Record<number, ProductType> = { 0: 'physical', 1: 'digital', 2: 'subscription' };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapApiOrder(raw: any): Order {
  return {
    id:                  raw.id,
    orderNumber:         raw.orderNumber,
    buyerName:           raw.buyerName,
    buyerEmail:          raw.buyerEmail,
    buyerInitials:       raw.buyerInitials,
    buyerAvatarGradient: 'from-violet-400 to-purple-600',
    products:            (raw.products ?? []).map((p: { id: string; name: string; type: number }) => ({
                           id: p.id, name: p.name, type: TYPE_MAP[p.type] ?? 'digital',
                         })),
    date:                raw.date,
    time:                raw.time,
    total:               raw.total,
    paymentStatus:       PAYMENT_MAP[raw.paymentStatus] ?? 'pending',
    deliveryStatus:      DELIVERY_MAP[raw.deliveryStatus] ?? 'preparing',
    shippingCarrier:     raw.shippingCarrier ?? undefined,
    trackingNumber:      raw.trackingNumber ?? undefined,
    trackingUrl:         raw.trackingUrl ?? undefined,
    createdAt:           raw.date,
  };
}

// front string → C# int (para el PATCH)
const DELIVERY_TO_INT: Record<DeliveryStatus, number> = {
  preparing: 0, shipped: 1, delivered: 2, pending_activation: 3,
  digital_active: 4, subscription_active: 5, cancelled: 6,
};

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/admin/orders`;

  private readonly _orders  = signal<Order[]>([]);
  private readonly _loading = signal(false);
  private readonly _stats   = signal<ApiStats>({ total: 0, pendingShipment: 0, totalRevenue: 0 });

  readonly orders  = this._orders.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly stats   = computed(() => this._stats());

  constructor() { this.loadAll(); }

  async loadAll(): Promise<void> {
    this._loading.set(true);
    try {
      const params = new HttpParams().set('pageSize', '100');
      const [page, stats] = await Promise.all([
        firstValueFrom(this.http.get<PagedResult<unknown>>(this.base, { params })),
        firstValueFrom(this.http.get<ApiStats>(`${this.base}/stats`)),
      ]);
      this._orders.set(page.items.map(mapApiOrder));
      this._stats.set(stats);
    } finally {
      this._loading.set(false);
    }
  }

  async updateDeliveryStatus(
    id: string,
    status: DeliveryStatus,
    shipping?: { shippingCarrier?: string; trackingNumber?: string; trackingUrl?: string },
  ): Promise<void> {
    const body = {
      deliveryStatus: DELIVERY_TO_INT[status],
      shippingCarrier: shipping?.shippingCarrier ?? null,
      trackingNumber: shipping?.trackingNumber ?? null,
      trackingUrl: shipping?.trackingUrl ?? null,
    };
    const raw = await firstValueFrom(this.http.patch<unknown>(`${this.base}/${id}/delivery`, body));
    const updated = mapApiOrder(raw);
    this._orders.update((list) => list.map((o) => o.id === id ? updated : o));
    // refresca KPIs
    const stats = await firstValueFrom(this.http.get<ApiStats>(`${this.base}/stats`));
    this._stats.set(stats);
  }
}
