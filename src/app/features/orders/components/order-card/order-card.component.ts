import { Component, input, output, inject, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Order, DeliveryTone, DELIVERY_STATUS_META } from '../../../administration/models/order.model';
import { ProductService } from '../../../administration/services/product.service';
import { getPrimaryImage } from '../../../administration/models/product.model';

// Tono semántico → color de texto inline (estilo cliente, sin chip).
const TONE_TEXT: Record<DeliveryTone, string> = {
  success: 'text-green-600',
  info:    'text-primary',
  accent:  'text-secondary',
  warning: 'text-amber-600',
  neutral: 'text-on-surface-variant',
  error:   'text-error',
};

/**
 * OrderCard — tarjeta de pedido (vista cliente). Basada en el mockup "mis pedidos":
 * thumbnail del producto, nº de orden + fecha, estado (icono+color) y total.
 */
@Component({
  selector: 'app-order-card',
  imports: [CurrencyPipe],
  template: `
    <div class="bg-surface-container-lowest rounded-lg p-5 md:p-6 shadow-card border border-transparent
                hover:border-primary/20 transition-all">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <!-- Producto + nº orden -->
        <div class="flex items-center gap-4 min-w-0">
          <div class="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-gradient-to-br {{ thumbnail() }}"></div>
          <div class="min-w-0">
            <h3 class="font-heading font-bold text-on-surface text-lg truncate">
              Pedido {{ order().orderNumber }}
            </h3>
            <p class="text-on-surface-variant font-sans text-label-md">
              {{ order().date }} · {{ productSummary() }}
            </p>
          </div>
        </div>

        <!-- Estado + total + acción -->
        <div class="grid grid-cols-2 md:flex md:items-center gap-6 md:gap-8">
          <div class="flex flex-col">
            <span class="text-[11px] font-heading text-outline-variant uppercase tracking-wider">Estado</span>
            <div class="flex items-center gap-1.5 font-heading font-semibold {{ toneClass() }}">
              <span class="material-symbols-outlined text-[16px]"
                    style="font-variation-settings: 'FILL' 1;">{{ meta().icon }}</span>
              <span class="text-sm">{{ meta().label }}</span>
            </div>
          </div>
          <div class="flex flex-col">
            <span class="text-[11px] font-heading text-outline-variant uppercase tracking-wider">Total</span>
            <span class="font-heading font-bold text-on-surface text-lg">{{ order().total | currency:'USD':'symbol':'1.2-2' }}</span>
          </div>
          <div class="col-span-2 md:col-span-1">
            <button (click)="view.emit(order())"
                    class="w-full md:w-auto px-6 py-2.5 rounded-full border border-primary text-primary
                           hover:bg-primary hover:text-white transition-all font-heading font-semibold
                           text-label-md flex items-center justify-center gap-1 active:scale-95">
              Ver Detalle
              <span class="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class OrderCardComponent {
  private readonly products = inject(ProductService);

  readonly order = input.required<Order>();
  readonly view  = output<Order>();

  readonly meta      = computed(() => DELIVERY_STATUS_META[this.order().deliveryStatus]);
  readonly toneClass = computed(() => TONE_TEXT[this.meta().tone]);

  readonly thumbnail = computed(() => {
    const first = this.order().products[0];
    const product = first ? this.products.getById(first.id) : undefined;
    return (product && getPrimaryImage(product)?.gradient) || 'from-violet-400 to-purple-600';
  });

  readonly productSummary = computed(() => {
    const ps = this.order().products;
    if (!ps.length) return '—';
    return ps.length === 1 ? ps[0].name : `${ps[0].name} +${ps.length - 1}`;
  });
}
