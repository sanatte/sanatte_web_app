import { Component, input, output } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { Order, DeliveryStatus } from '../../models/order.model';
import { ProductType } from '../../models/product.model';

interface DeliveryConfig { label: string; icon: string; classes: string; }

const DELIVERY_CONFIG: Record<DeliveryStatus, DeliveryConfig> = {
  preparing:           { label: 'Preparando',           icon: 'pending',          classes: 'bg-surface-variant text-on-surface-variant' },
  shipped:             { label: 'Enviado',               icon: 'local_shipping',   classes: 'bg-primary/10 text-primary' },
  delivered:           { label: 'Entregado',             icon: 'check_circle',     classes: 'bg-green-100 text-green-700' },
  pending_activation:  { label: 'Pend. activación',     icon: 'qr_code_scanner',  classes: 'bg-amber-100 text-amber-700' },
  digital_active:      { label: 'Digital activo',        icon: 'bolt',             classes: 'bg-secondary/10 text-secondary' },
  subscription_active: { label: 'Suscripción activa',   icon: 'autorenew',        classes: 'bg-primary/10 text-primary' },
  cancelled:           { label: 'Cancelado',             icon: 'cancel',           classes: 'bg-error-container text-error' },
};

const PRODUCT_ICON: Record<ProductType, string> = {
  physical:     'inventory_2',
  digital:      'article',
  subscription: 'autorenew',
};

const PRODUCT_CLASSES: Record<ProductType, string> = {
  physical:     'bg-primary-container/20 text-primary',
  digital:      'bg-surface-container-high text-on-surface-variant',
  subscription: 'bg-secondary-container/20 text-secondary',
};

@Component({
  selector: 'app-order-table',
  imports: [CurrencyPipe, DecimalPipe, StatusBadgeComponent, PaginationComponent],
  templateUrl: './order-table.component.html',
})
export class OrderTableComponent {
  readonly orders      = input.required<Order[]>();
  readonly totalItems  = input.required<number>();
  readonly currentPage = input.required<number>();
  readonly pageSize    = input(10);

  readonly viewOrder           = output<Order>();
  readonly changeDelivery      = output<Order>();
  readonly pageChange          = output<number>();

  deliveryConfig = (s: DeliveryStatus) => DELIVERY_CONFIG[s];
  productIcon    = (t: ProductType)    => PRODUCT_ICON[t];
  productClasses = (t: ProductType)    => PRODUCT_CLASSES[t];

  canChangeDelivery(order: Order): boolean {
    return ['preparing', 'shipped', 'pending_activation'].includes(order.deliveryStatus);
  }
}
