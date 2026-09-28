import { Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TEXTS } from '../../../../core/i18n/texts';
import { InventoryRow } from '../../models/location.model';

@Component({
  selector: 'app-location-inventory-table',
  imports: [DecimalPipe],
  template: `
    <div class="bg-white rounded-lg overflow-hidden border border-outline-variant/20 shadow-card">
      <div class="px-6 py-5 border-b border-outline-variant/30 flex items-center gap-3">
        <span class="material-symbols-outlined text-primary">{{ isWarehouse() ? 'warehouse' : 'storefront' }}</span>
        <h4 class="font-heading text-body-lg font-bold text-on-surface">{{ name() }}</h4>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-surface-container-low/50">
            <tr>
              <th class="px-4 md:px-6 py-4 text-label-md font-heading text-on-surface-variant">{{ t.product }}</th>
              <th class="px-4 md:px-6 py-4 text-label-md font-heading text-on-surface-variant text-right">{{ t.available }}</th>
              <th class="px-4 md:px-6 py-4 text-label-md font-heading text-on-surface-variant text-right">{{ t.assigned }}</th>
              <th class="px-4 md:px-6 py-4 text-label-md font-heading text-on-surface-variant text-right">{{ t.sold }}</th>
              <th class="px-4 md:px-6 py-4 text-label-md font-heading text-on-surface-variant text-right">{{ t.active }}</th>
              <th class="px-4 md:px-6 py-4 text-label-md font-heading text-on-surface-variant text-right">{{ t.total }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/20">
            @for (row of rows(); track row.productId) {
              <tr class="hover:bg-surface-container-low/40 transition-colors">
                <td class="px-4 md:px-6 py-4 text-label-md font-heading font-semibold text-on-surface">{{ row.productName }}</td>
                <td class="px-4 md:px-6 py-4 text-label-md font-heading text-on-surface-variant text-right">{{ row.available | number }}</td>
                <td class="px-4 md:px-6 py-4 text-label-md font-heading text-on-surface-variant text-right">{{ row.assigned | number }}</td>
                <td class="px-4 md:px-6 py-4 text-label-md font-heading text-on-surface-variant text-right">{{ row.sold | number }}</td>
                <td class="px-4 md:px-6 py-4 text-label-md font-heading text-on-surface-variant text-right">{{ row.active | number }}</td>
                <td class="px-4 md:px-6 py-4 text-label-md font-heading font-bold text-on-surface text-right">{{ row.total | number }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class LocationInventoryTableComponent {
  protected readonly t = TEXTS.admin.locations.inventory.columns;

  readonly name        = input.required<string>();
  readonly rows        = input.required<InventoryRow[]>();
  readonly isWarehouse = input(false);
}
