import { Component, input, output, computed } from '@angular/core';
import { DashboardOrder, OrderStatus } from '../../models/dashboard-order.model';

interface StatusConfig {
  label: string;
  classes: string;
}

const STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  paid:      { label: 'Pagado',    classes: 'bg-green-100 text-green-700' },
  pending:   { label: 'Pendiente', classes: 'bg-amber-100 text-amber-700' },
  shipped:   { label: 'Enviado',   classes: 'bg-blue-100 text-blue-700' },
  cancelled: { label: 'Cancelado', classes: 'bg-red-100 text-red-700' },
};

@Component({
  selector: 'app-recent-orders-table',
  template: `
    <div class="glass-card rounded-lg overflow-hidden">
      <!-- Header -->
      <div class="px-8 py-6 border-b border-outline-variant/30 flex justify-between items-center">
        <div>
          <h4 class="font-heading text-headline-md text-on-surface">Pedidos Recientes</h4>
          <p class="text-on-surface-variant text-label-sm mt-0.5">
            Últimas {{ orders().length }} transacciones.
          </p>
        </div>
        <div class="flex gap-2">
          <button (click)="filterClick.emit()"
                  class="px-4 py-2 bg-surface-container text-on-surface-variant rounded-lg
                         text-label-md font-heading hover:bg-surface-variant transition-colors
                         flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px]">filter_list</span>
            Filtrar
          </button>
          <button (click)="exportClick.emit()"
                  class="px-4 py-2 gradient-primary text-white rounded-lg text-label-md
                         font-heading hover:shadow-primary transition-all flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px]">download</span>
            Exportar
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant/30">
              <th class="px-8 py-4 text-label-md font-heading text-on-surface-variant">Order ID</th>
              <th class="px-8 py-4 text-label-md font-heading text-on-surface-variant">Cliente</th>
              <th class="px-8 py-4 text-label-md font-heading text-on-surface-variant">Monto</th>
              <th class="px-8 py-4 text-label-md font-heading text-on-surface-variant">Estado</th>
              <th class="px-8 py-4 text-label-md font-heading text-on-surface-variant text-right">Acción</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/20">
            @for (order of orders(); track order.id) {
              <tr class="hover:bg-surface-variant/10 transition-colors">
                <td class="px-8 py-4 text-label-md font-heading text-on-surface">
                  {{ order.orderId }}
                </td>
                <td class="px-8 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center
                                text-[10px] font-bold text-on-secondary-fixed"
                         [class]="order.customerBgClass">
                      {{ order.customerInitials }}
                    </div>
                    <span class="text-label-md font-heading text-on-surface">
                      {{ order.customerName }}
                    </span>
                  </div>
                </td>
                <td class="px-8 py-4 text-label-md font-heading text-on-surface">
                  {{ order.amount }}
                </td>
                <td class="px-8 py-4">
                  <span class="px-3 py-1 rounded-full text-label-sm font-heading"
                        [class]="statusConfig(order.status).classes">
                    {{ statusConfig(order.status).label }}
                  </span>
                </td>
                <td class="px-8 py-4 text-right">
                  <button class="p-2 hover:bg-surface-container rounded-full transition-colors">
                    <span class="material-symbols-outlined text-outline">more_vert</span>
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Footer -->
      <div class="px-8 py-4 border-t border-outline-variant/30 flex justify-center">
        <button class="text-primary text-label-md font-heading hover:underline py-2">
          Cargar más transacciones
        </button>
      </div>
    </div>
  `,
})
export class RecentOrdersTableComponent {
  readonly orders = input.required<DashboardOrder[]>();
  readonly filterClick = output<void>();
  readonly exportClick = output<void>();

  statusConfig(status: OrderStatus): StatusConfig {
    return STATUS_CONFIG[status];
  }
}
