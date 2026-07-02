import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { UserOrdersService } from '../../services/user-orders.service';
import { OrderCardComponent } from '../../components/order-card/order-card.component';
import { Order, DeliveryStatus } from '../../../administration/models/order.model';

type FilterKey = 'all' | 'in_progress' | 'shipped' | 'delivered' | 'active';

interface FilterTab {
  key: FilterKey;
  label: string;
  match: (s: DeliveryStatus) => boolean;
}

const FILTERS: FilterTab[] = [
  { key: 'all',         label: 'Todos',     match: () => true },
  { key: 'in_progress', label: 'En proceso', match: (s) => s === 'preparing' || s === 'pending_activation' },
  { key: 'shipped',     label: 'Enviado',   match: (s) => s === 'shipped' },
  { key: 'delivered',   label: 'Entregado', match: (s) => s === 'delivered' },
  { key: 'active',      label: 'Activo',    match: (s) => s === 'digital_active' || s === 'subscription_active' },
];

@Component({
  selector: 'app-order-list',
  imports: [OrderCardComponent],
  template: `
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <header class="mb-8">
        <h1 class="font-heading text-headline-lg text-on-surface mb-2">Historial de Pedidos</h1>
        <p class="font-sans text-body-lg text-on-surface-variant">
          Revisa el estado de tus compras y accede a tus productos de bienestar.
        </p>
      </header>

      <!-- Búsqueda + filtros -->
      <div class="flex flex-col md:flex-row gap-gutter md:items-center justify-between mb-8">
        <div class="relative w-full md:w-96 group">
          <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline
                       group-focus-within:text-primary transition-colors">search</span>
          <input type="text" [value]="query()" (input)="query.set($any($event.target).value)"
                 placeholder="Buscar por ID o producto..."
                 class="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-transparent
                        focus:border-primary focus:ring-0 rounded-xl transition-all text-body-md
                        placeholder:text-outline-variant outline-none" />
        </div>
        <div class="flex items-center gap-2 overflow-x-auto scrollbar-hide w-full md:w-auto pb-1 md:pb-0">
          @for (f of filters; track f.key) {
            <button (click)="activeFilter.set(f.key)"
                    class="px-4 py-2 rounded-full font-heading font-semibold text-label-md whitespace-nowrap transition-all"
                    [class]="activeFilter() === f.key
                      ? 'bg-secondary-container text-on-secondary-container'
                      : 'border border-outline-variant text-on-surface-variant hover:bg-surface-container'">
              {{ f.label }}
            </button>
          }
        </div>
      </div>

      <!-- Lista -->
      @if (filtered().length > 0) {
        <div class="space-y-4">
          @for (order of filtered(); track order.id) {
            <app-order-card [order]="order" (view)="openDetail($event)" />
          }
        </div>
        <p class="text-label-md font-heading text-on-surface-variant mt-6">
          Mostrando {{ filtered().length }} de {{ total() }} pedido{{ total() !== 1 ? 's' : '' }}
        </p>
      } @else {
        <!-- Estado vacío -->
        <div class="glass-card rounded-lg p-12 text-center mt-4">
          <div class="w-20 h-20 rounded-full bg-primary-fixed flex items-center justify-center mx-auto mb-6">
            <span class="material-symbols-outlined text-primary text-[40px]">shopping_bag</span>
          </div>
          <h3 class="font-heading text-headline-md text-on-surface mb-2">
            {{ total() === 0 ? 'Aún no tienes pedidos' : 'Sin resultados' }}
          </h3>
          <p class="font-sans text-body-md text-on-surface-variant max-w-md mx-auto">
            {{ total() === 0
              ? 'Cuando realices una compra aparecerá aquí tu historial.'
              : 'Prueba con otro término o filtro de búsqueda.' }}
          </p>
        </div>
      }
    </div>
  `,
})
export class OrderListComponent {
  private readonly userOrders = inject(UserOrdersService);
  private readonly router     = inject(Router);

  readonly filters = FILTERS;
  readonly query        = signal('');
  readonly activeFilter = signal<FilterKey>('all');

  readonly total = computed(() => this.userOrders.orders().length);

  readonly filtered = computed<Order[]>(() => {
    const q = this.query().trim().toLowerCase();
    const filter = FILTERS.find((f) => f.key === this.activeFilter())!;
    return this.userOrders.orders().filter((o) => {
      if (!filter.match(o.deliveryStatus)) return false;
      if (!q) return true;
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.products.some((p) => p.name.toLowerCase().includes(q))
      );
    });
  });

  openDetail(order: Order): void {
    this.router.navigate(['/app/orders', order.id]);
  }
}
