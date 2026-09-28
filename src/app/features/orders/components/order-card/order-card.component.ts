import { Component, input, output, inject, computed } from '@angular/core';
import { MoneyPipe } from '../../../../shared/pipes/money.pipe';
import { Order, DeliveryTone, DELIVERY_STATUS_META } from '../../../administration/models/order.model';
import { ProductService } from '../../../administration/services/product.service';
import { getPrimaryImage } from '../../../administration/models/product.model';
import { TEXTS } from '../../../../core/i18n/texts';

const TONE_TEXT: Record<DeliveryTone, string> = {
  success: 'text-green-600',
  info:    'text-primary',
  accent:  'text-secondary',
  warning: 'text-amber-600',
  neutral: 'text-on-surface-variant',
  error:   'text-error',
};

@Component({
  selector: 'app-order-card',
  imports: [MoneyPipe],
  template: `
    <div class="bg-surface-container-lowest rounded-lg p-5 md:p-6 shadow-card border border-transparent
                hover:border-primary/20 transition-all">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-4 min-w-0">
          <div class="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0">
            @if (thumbnailUrl(); as url) {
              <img [src]="url" alt="" class="w-full h-full object-cover">
            } @else {
              <div class="w-full h-full bg-gradient-to-br {{ thumbnail() }}"></div>
            }
          </div>
          <div class="min-w-0">
            <h3 class="font-heading font-bold text-on-surface text-lg truncate">
              {{ orderNumberLabel(order().orderNumber) }}
            </h3>
            <p class="text-on-surface-variant font-sans text-label-md">
              {{ order().date }} · {{ productSummary() }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-2 md:flex md:items-center gap-6 md:gap-8">
          <div class="flex flex-col">
            <span class="text-[11px] font-heading text-outline-variant uppercase tracking-wider">{{ t.status }}</span>
            <div class="flex items-center gap-1.5 font-heading font-semibold {{ toneClass() }}">
              <span class="material-symbols-outlined text-[16px]"
                    style="font-variation-settings: 'FILL' 1;">{{ meta().icon }}</span>
              <span class="text-sm">{{ meta().label }}</span>
            </div>
          </div>
          <div class="flex flex-col">
            <span class="text-[11px] font-heading text-outline-variant uppercase tracking-wider">{{ t.total }}</span>
            <span class="font-heading font-bold text-on-surface text-lg">{{ order().total | money }}</span>
          </div>
          <div class="col-span-2 md:col-span-1">
            <button (click)="view.emit(order())"
                    class="w-full md:w-auto px-6 py-2.5 rounded-full border border-primary text-primary
                           hover:bg-primary hover:text-white transition-all font-heading font-semibold
                           text-label-md flex items-center justify-center gap-1 active:scale-95">
              {{ t.viewDetail }}
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

  protected readonly orderNumberLabel = TEXTS.app.orders.orderNumber;
  protected readonly t = TEXTS.app.orders.card;

  readonly order = input.required<Order>();
  readonly view  = output<Order>();

  readonly meta      = computed(() => DELIVERY_STATUS_META[this.order().deliveryStatus]);
  readonly toneClass = computed(() => TONE_TEXT[this.meta().tone]);

  private readonly firstProduct = computed(() => {
    const first = this.order().products[0];
    return first ? this.products.getById(first.id) : undefined;
  });

  readonly thumbnailUrl = computed(() => {
    const p = this.firstProduct();
    return p ? getPrimaryImage(p)?.url ?? null : null;
  });
  readonly thumbnail = computed(() => {
    const p = this.firstProduct();
    return (p && getPrimaryImage(p)?.gradient) || 'from-brand-400 to-brand-800';
  });

  readonly productSummary = computed(() => {
    const ps = this.order().products;
    if (!ps.length) return '—';
    return ps.length === 1 ? ps[0].name : `${ps[0].name} +${ps.length - 1}`;
  });
}
