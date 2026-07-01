import { Injectable, signal, computed } from '@angular/core';
import { Order, DeliveryStatus, PaymentStatus } from '../models/order.model';
import { MOCK_ORDERS } from '../mocks/orders.mock';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly _orders = signal<Order[]>(MOCK_ORDERS);

  readonly orders = this._orders.asReadonly();

  readonly stats = computed(() => {
    const orders = this._orders();
    return {
      total:          orders.length,
      pendingShipment: orders.filter((o) => o.deliveryStatus === 'preparing' || o.deliveryStatus === 'pending_activation').length,
      totalRevenue:   orders.filter((o) => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.total, 0),
    };
  });

  updateDeliveryStatus(
    id: string,
    status: DeliveryStatus,
    shipping?: { shippingCarrier?: string; trackingNumber?: string; trackingUrl?: string },
  ): void {
    this._orders.update((list) =>
      list.map((o) =>
        o.id === id
          ? { ...o, deliveryStatus: status, ...shipping }
          : o
      )
    );
  }
}
