import { Injectable, inject, computed } from '@angular/core';
import { OrderService } from '../../administration/services/order.service';
import { Order } from '../../administration/models/order.model';

/**
 * UserOrdersService — pedidos del usuario autenticado (vista cliente).
 *
 * Fase actual: filtra los pedidos por número de pedido (clave estable) como
 * subconjunto del usuario. Migración final: endpoint `/api/me/orders` que
 * devuelve los pedidos del usuario autenticado (por FirebaseUid). La API
 * pública (signals) no cambia.
 */
const MY_ORDER_NUMBERS = ['#SAN-9021', '#SAN-9020', '#SAN-9019'];

@Injectable({ providedIn: 'root' })
export class UserOrdersService {
  private readonly orderService = inject(OrderService);

  readonly orders = computed<Order[]>(() =>
    this.orderService
      .orders()
      .filter((o) => MY_ORDER_NUMBERS.includes(o.orderNumber))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  );

  getById(id: string): Order | undefined {
    return this.orders().find((o) => o.id === id);
  }
}
