import { Component, inject, computed } from '@angular/core';
import { MoneyPipe } from '../../../../shared/pipes/money.pipe';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { UserOrdersService } from '../../services/user-orders.service';
import { ProductService } from '../../../administration/services/product.service';
import { EntitlementService } from '../../../administration/services/entitlement.service';
import { getPrimaryImage } from '../../../administration/models/product.model';
import { RESOURCE_TYPE_META } from '../../../administration/models/resource.model';
import {
  Order, DeliveryTone, DELIVERY_STATUS_META, PaymentStatus,
} from '../../../administration/models/order.model';
import { TEXTS } from '../../../../core/i18n/texts';

const T = TEXTS.app.orders.detail;
const STEP = T.tracker.steps;
const PAYMENT_LABEL = TEXTS.common.statusBadge;

const TONE_TEXT: Record<DeliveryTone, string> = {
  success: 'text-green-600', info: 'text-primary', accent: 'text-secondary',
  warning: 'text-amber-600', neutral: 'text-on-surface-variant', error: 'text-error',
};

const PAYMENT_META: Record<PaymentStatus, { label: string; classes: string }> = {
  paid:      { label: PAYMENT_LABEL.paid,      classes: 'bg-green-100 text-green-700' },
  pending:   { label: PAYMENT_LABEL.pending,   classes: 'bg-amber-100 text-amber-700' },
  cancelled: { label: PAYMENT_LABEL.cancelled, classes: 'bg-error-container text-error' },
};

interface TrackerStep {
  label: string;
  icon: string;
  done: boolean;
  active: boolean;
}

interface IncludedResource {
  id: string;
  productId: string;
  title: string;
  type: string;
  icon: string;
  includedIn: string;
}

@Component({
  selector: 'app-order-detail',
  imports: [RouterLink, MoneyPipe],
  templateUrl: './order-detail.component.html',
})
export class OrderDetailComponent {
  private readonly route        = inject(ActivatedRoute);
  private readonly router       = inject(Router);
  private readonly userOrders   = inject(UserOrdersService);
  private readonly products     = inject(ProductService);
  private readonly entitlements = inject(EntitlementService);

  protected readonly orderNumberLabel = TEXTS.app.orders.orderNumber;
  protected readonly t = T;

  private readonly id = toSignal(this.route.paramMap.pipe(map((p) => p.get('id'))), { initialValue: null });

  readonly loading = computed(() => !this.userOrders.loaded());

  readonly order = computed<Order | null>(() => {
    const id = this.id();
    return id ? this.userOrders.getById(id) ?? null : null;
  });

  readonly delivery = computed(() => {
    const o = this.order();
    if (!o) return null;
    const m = DELIVERY_STATUS_META[o.deliveryStatus];
    return { ...m, textClass: TONE_TEXT[m.tone] };
  });

  readonly payment = computed(() => {
    const o = this.order();
    return o ? PAYMENT_META[o.paymentStatus] : null;
  });

  readonly isPhysical = computed(() => this.order()?.products.some((p) => p.type === 'physical') ?? false);

  readonly isPendingActivation = computed(() => this.order()?.deliveryStatus === 'pending_activation');

  readonly includedResources = computed<IncludedResource[]>(() => {
    const o = this.order();
    if (!o) return [];
    const items: IncludedResource[] = [];
    for (const op of o.products) {
      const product = this.products.getById(op.id);
      if (!product) continue;
      for (const res of this.entitlements.getResourcesForProduct(product)) {
        items.push({
          id: res.id,
          productId: product.id,
          title: res.title,
          type: RESOURCE_TYPE_META[res.type].label,
          icon: RESOURCE_TYPE_META[res.type].icon,
          includedIn: product.name,
        });
      }
    }
    return items;
  });

  readonly tracker = computed<TrackerStep[]>(() => {
    const o = this.order();
    if (!o) return [];
    const s = o.deliveryStatus;
    if (s === 'cancelled') return [];

    if (this.isPhysical()) {
      const reached =
        s === 'delivered' ? 3 :
        s === 'shipped' ? 2 :
        s === 'pending_activation' ? 3 : 1;
      const steps = [
        { label: STEP.confirmed,  icon: 'check_circle' },
        { label: STEP.processing, icon: 'inventory_2' },
        { label: STEP.onTheWay,   icon: 'local_shipping' },
        { label: STEP.delivered,  icon: 'package_2' },
      ];
      return steps.map((st, i) => ({ ...st, done: i < reached, active: i === reached && reached < 3 || (i === 3 && reached === 3) }));
    }

    const finalLabel = s === 'subscription_active' ? STEP.subscriptionActive : STEP.accessActive;
    const finalIcon  = s === 'subscription_active' ? 'autorenew' : 'bolt';
    const active = s === 'digital_active' || s === 'subscription_active';
    return [
      { label: STEP.confirmed,        icon: 'check_circle', done: true, active: false },
      { label: STEP.paymentConfirmed, icon: 'payments',     done: true, active: false },
      { label: finalLabel,        icon: finalIcon,      done: active, active: active },
    ];
  });

  readonly isCancelled = computed(() => this.order()?.deliveryStatus === 'cancelled');

  imageUrlFor(productId: string): string | null {
    const p = this.products.getById(productId);
    return p ? getPrimaryImage(p)?.url ?? null : null;
  }

  gradientFor(productId: string): string {
    const p = this.products.getById(productId);
    return (p && getPrimaryImage(p)?.gradient) || 'from-brand-400 to-brand-800';
  }

  back(): void { this.router.navigate(['/app/orders']); }
}
