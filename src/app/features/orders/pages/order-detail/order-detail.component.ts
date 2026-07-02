import { Component, inject, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { UserOrdersService } from '../../services/user-orders.service';
import { ProductService } from '../../../administration/services/product.service';
import { EntitlementService } from '../../../administration/services/entitlement.service';
import { getPrimaryImage } from '../../../administration/models/product.model';
import { RESOURCE_TYPE_META } from '../../../administration/models/resource.model';
import {
  Order, DeliveryTone, DELIVERY_STATUS_META,
} from '../../../administration/models/order.model';

const TONE_TEXT: Record<DeliveryTone, string> = {
  success: 'text-green-600', info: 'text-primary', accent: 'text-secondary',
  warning: 'text-amber-600', neutral: 'text-on-surface-variant', error: 'text-error',
};

const PAYMENT_META: Record<string, { label: string; classes: string }> = {
  paid:      { label: 'Pagado',    classes: 'bg-green-100 text-green-700' },
  pending:   { label: 'Pendiente', classes: 'bg-amber-100 text-amber-700' },
  cancelled: { label: 'Cancelado', classes: 'bg-error-container text-error' },
};

/** Paso del tracker de progreso del pedido. */
interface TrackerStep {
  label: string;
  icon: string;
  done: boolean;
  active: boolean;
}

/** Recurso digital incluido en el pedido (vía entitlements de un producto). */
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
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './order-detail.component.html',
})
export class OrderDetailComponent {
  private readonly route        = inject(ActivatedRoute);
  private readonly router       = inject(Router);
  private readonly userOrders   = inject(UserOrdersService);
  private readonly products     = inject(ProductService);
  private readonly entitlements = inject(EntitlementService);

  private readonly id = toSignal(this.route.paramMap.pipe(map((p) => p.get('id'))), { initialValue: null });

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

  /** ¿El pedido está pendiente de activación por QR? */
  readonly isPendingActivation = computed(() => this.order()?.deliveryStatus === 'pending_activation');

  /** Recursos digitales incluidos (entitlements de los productos comprados). */
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

  /**
   * Tracker de progreso adaptado al tipo de pedido:
   *  - Físico: Confirmado → Procesando → En Camino → Entregado
   *  - Digital: Confirmado → Pago confirmado → Acceso activo
   *  - Suscripción: Confirmado → Pago confirmado → Suscripción activa
   */
  readonly tracker = computed<TrackerStep[]>(() => {
    const o = this.order();
    if (!o) return [];
    const s = o.deliveryStatus;
    if (s === 'cancelled') return [];

    if (this.isPhysical()) {
      const reached =
        s === 'delivered' ? 3 :
        s === 'shipped' ? 2 :
        s === 'pending_activation' ? 3 : 1; // preparing → 1
      const steps = [
        { label: 'Confirmado', icon: 'check_circle' },
        { label: 'Procesando', icon: 'inventory_2' },
        { label: 'En camino',  icon: 'local_shipping' },
        { label: 'Entregado',  icon: 'package_2' },
      ];
      return steps.map((st, i) => ({ ...st, done: i < reached, active: i === reached && reached < 3 || (i === 3 && reached === 3) }));
    }

    // Digital / Suscripción
    const finalLabel = s === 'subscription_active' ? 'Suscripción activa' : 'Acceso activo';
    const finalIcon  = s === 'subscription_active' ? 'autorenew' : 'bolt';
    const active = s === 'digital_active' || s === 'subscription_active';
    return [
      { label: 'Confirmado',      icon: 'check_circle', done: true, active: false },
      { label: 'Pago confirmado', icon: 'payments',     done: true, active: false },
      { label: finalLabel,        icon: finalIcon,      done: active, active: active },
    ];
  });

  readonly isCancelled = computed(() => this.order()?.deliveryStatus === 'cancelled');

  gradientFor(productId: string): string {
    const p = this.products.getById(productId);
    return (p && getPrimaryImage(p)?.gradient) || 'from-violet-400 to-purple-600';
  }

  back(): void { this.router.navigate(['/app/orders']); }
}
