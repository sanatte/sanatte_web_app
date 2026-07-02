import { Injectable, inject, signal, computed } from '@angular/core';
import { ProductService } from '../../administration/services/product.service';
import { EntitlementService } from '../../administration/services/entitlement.service';
import { Product } from '../../administration/models/product.model';

export type SubscriptionStatus = 'active' | 'cancels_at_period_end' | 'none';

export interface ActiveSubscription {
  productSku: string;
  status: SubscriptionStatus;
  startedAt: string;       // fecha legible
  nextBillingDate: string; // fecha legible
}

export interface PaymentMethod {
  brand: string;
  last4: string;
  expiry: string;
}

export interface Invoice {
  id: string;
  date: string;
  planName: string;
  amount: number;
}

/**
 * UserSubscriptionService — gestión de la suscripción del usuario (vista cliente).
 *
 * Fase Mock: el usuario está suscrito a un producto tipo 'subscription'.
 * Migración: reemplazar por el estado real (Mercado Pago / backend). La API
 * pública (signals + acciones) no cambia.
 */
@Injectable({ providedIn: 'root' })
export class UserSubscriptionService {
  private readonly products     = inject(ProductService);
  private readonly entitlements = inject(EntitlementService);

  private readonly _subscription = signal<ActiveSubscription>({
    productSku: 'DIG-082',           // Guided Flow Pro (SKU estable)
    status: 'active',
    startedAt: '15 de enero, 2026',
    nextBillingDate: '15 de agosto, 2026',
  });
  readonly subscription = this._subscription.asReadonly();

  readonly paymentMethod = signal<PaymentMethod>({ brand: 'Visa', last4: '4242', expiry: '08/27' });

  readonly invoices = signal<Invoice[]>([
    { id: 'inv-3', date: '15 de julio, 2026',   planName: 'Guided Flow Pro', amount: 39900 },
    { id: 'inv-2', date: '15 de junio, 2026',   planName: 'Guided Flow Pro', amount: 39900 },
    { id: 'inv-1', date: '15 de mayo, 2026',    planName: 'Guided Flow Pro', amount: 39900 },
  ]);

  /** Producto del plan actual. */
  readonly currentPlan = computed<Product | null>(() => {
    const sku = this._subscription().productSku;
    return sku ? this.products.getBySku(sku) ?? null : null;
  });

  readonly hasActive = computed(() => this._subscription().status !== 'none');

  /** Nº de recursos incluidos en el plan actual. */
  readonly currentPlanResourceCount = computed(() => {
    const p = this.currentPlan();
    return p ? this.entitlements.getContentCount(p) : 0;
  });

  /** Planes de suscripción disponibles (activos). */
  readonly availablePlans = computed<Product[]>(() =>
    this.products.products().filter((p) => p.type === 'subscription' && p.status === 'active')
  );

  isCurrentPlan(sku: string): boolean {
    return this._subscription().productSku === sku;
  }

  cancel(): void {
    this._subscription.update((s) => ({ ...s, status: 'cancels_at_period_end' }));
  }

  reactivate(): void {
    this._subscription.update((s) => ({ ...s, status: 'active' }));
  }

  changePlan(sku: string): void {
    this._subscription.update((s) => ({ ...s, productSku: sku, status: 'active' }));
  }
}
