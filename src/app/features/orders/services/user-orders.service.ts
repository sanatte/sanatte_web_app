import { Injectable, inject, computed } from '@angular/core';
import { OrderService } from '../../administration/services/order.service';
import { Order } from '../../administration/models/order.model';

/**
 * UserOrdersService — pedidos del usuario autenticado (vista cliente).
 *
 * Fase Mock: devuelve un subconjunto curado de los pedidos que representa el
 * historial del usuario (cubre físico/digital/suscripción y varios estados).
 * Migración: filtrar `OrderService.orders()` por `buyerEmail`/uid del usuario
 * autenticado. La API pública (signals) no cambia.
 */
const MY_ORDER_IDS = ['o1', 'o7', 'o6', 'o2', 'o5', 'o3'];

@Injectable({ providedIn: 'root' })
export class UserOrdersService {
  private readonly orderService = inject(OrderService);

  readonly orders = computed<Order[]>(() =>
    this.orderService
      .orders()
      .filter((o) => MY_ORDER_IDS.includes(o.id))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  );

  getById(id: string): Order | undefined {
    return this.orders().find((o) => o.id === id);
  }
}
