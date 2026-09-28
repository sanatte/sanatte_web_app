import { Component, computed, input, output } from '@angular/core';
import { TEXTS } from '../../../../core/i18n/texts';
import { SalesLocation } from '../../models/location.model';

@Component({
  selector: 'app-location-card',
  template: `
    <article class="glass-card p-6 rounded-lg flex flex-col gap-4 h-full">
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-4 min-w-0">
          <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
            <span class="material-symbols-outlined">{{ location().type === 'ecommerce' ? 'shopping_cart' : 'storefront' }}</span>
          </div>
          <div class="min-w-0">
            <h3 class="font-heading text-body-lg font-bold text-on-surface truncate">{{ location().name }}</h3>
            <p class="text-label-sm font-heading text-on-surface-variant">
              {{ t.types[location().type] }} · {{ t.salesModels[location().salesModel] }}
            </p>
          </div>
        </div>
        @if (showsCommission()) {
          <span class="bg-primary/10 text-primary text-label-sm px-3 py-1 rounded-full font-heading whitespace-nowrap">
            {{ t.channels.commission(location().commissionPercent) }}
          </span>
        }
      </div>

      @if (location().contactName || location().contactPhone) {
        <div class="flex items-center gap-2 text-label-md font-heading text-on-surface-variant">
          <span class="material-symbols-outlined text-[18px] text-outline">person</span>
          <span class="truncate">
            {{ location().contactName }}@if (location().contactName && location().contactPhone) {<span> · </span>}{{ location().contactPhone }}
          </span>
        </div>
      }

      <div class="flex gap-3 mt-auto pt-2">
        <button type="button" (click)="assign.emit()"
                class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full gradient-primary text-white
                       text-label-md font-heading font-bold hover:opacity-90 active:scale-95 transition-all">
          <span class="material-symbols-outlined text-[18px]">move_to_inbox</span>
          {{ c.actions.assign }}
        </button>
        <button type="button" (click)="returnStock.emit()"
                class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full border border-outline-variant
                       text-on-surface-variant text-label-md font-heading font-bold
                       hover:border-primary hover:text-primary transition-colors">
          <span class="material-symbols-outlined text-[18px]">undo</span>
          {{ c.actions.return }}
        </button>
      </div>
    </article>
  `,
})
export class LocationCardComponent {
  protected readonly t = TEXTS.admin.locations;
  protected readonly c = TEXTS.common;

  readonly location    = input.required<SalesLocation>();
  readonly assign      = output<void>();
  readonly returnStock = output<void>();

  protected readonly showsCommission = computed(() =>
    this.location().type === 'physical_point' && this.location().salesModel === 'consignment'
  );
}
