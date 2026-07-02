import { Component, input, output } from '@angular/core';
import { MoneyPipe } from '../../../../shared/pipes/money.pipe';
import { DecimalPipe } from '@angular/common';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { Order, DeliveryStatus, DeliveryTone, DELIVERY_STATUS_META } from '../../models/order.model';
import { ProductType } from '../../models/product.model';

// Tono semántico → clases de chip (estilo admin). El label/icon vienen de la fuente única.
const TONE_CHIP: Record<DeliveryTone, string> = {
  success: 'bg-green-100 text-green-700',
  info:    'bg-primary/10 text-primary',
  accent:  'bg-secondary/10 text-secondary',
  warning: 'bg-amber-100 text-amber-700',
  neutral: 'bg-surface-variant text-on-surface-variant',
  error:   'bg-error-container text-error',
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
  imports: [MoneyPipe, DecimalPipe, StatusBadgeComponent, PaginationComponent],
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

  deliveryConfig = (s: DeliveryStatus) => {
    const m = DELIVERY_STATUS_META[s];
    return { label: m.label, icon: m.icon, classes: TONE_CHIP[m.tone] };
  };
  productIcon    = (t: ProductType)    => PRODUCT_ICON[t];
  productClasses = (t: ProductType)    => PRODUCT_CLASSES[t];

  canChangeDelivery(order: Order): boolean {
    return ['preparing', 'shipped', 'pending_activation'].includes(order.deliveryStatus);
  }
}
