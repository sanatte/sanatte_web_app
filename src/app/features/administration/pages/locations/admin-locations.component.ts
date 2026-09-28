import { Component, computed, inject, signal } from '@angular/core';
import { TEXTS } from '../../../../core/i18n/texts';
import { AdminPageHeaderComponent } from '../../../../shared/components/admin-page-header/admin-page-header.component';
import { CurrencyService } from '../../../../shared/services/currency.service';
import { AllocateMode, AllocateRequest, AllocateStockDialogComponent } from '../../components/allocate-stock-dialog/allocate-stock-dialog.component';
import { KpiCardComponent } from '../../components/kpi-card/kpi-card.component';
import { LocationCardComponent } from '../../components/location-card/location-card.component';
import { LocationFormDialogComponent } from '../../components/location-form-dialog/location-form-dialog.component';
import { LocationInventoryTableComponent } from '../../components/location-inventory-table/location-inventory-table.component';
import { KpiMetric } from '../../models/kpi-metric.model';
import { InventoryRow, SalesLocation } from '../../models/location.model';
import { CreateLocationInput, LocationService } from '../../services/location.service';
import { ProductService } from '../../services/product.service';

interface InventoryGroup {
  key: string;
  name: string;
  isWarehouse: boolean;
  rows: InventoryRow[];
}

@Component({
  selector: 'app-admin-locations',
  imports: [
    AdminPageHeaderComponent, KpiCardComponent, LocationCardComponent,
    LocationInventoryTableComponent, LocationFormDialogComponent, AllocateStockDialogComponent,
  ],
  templateUrl: './admin-locations.component.html',
})
export class AdminLocationsComponent {
  private readonly locationsService = inject(LocationService);
  private readonly productService   = inject(ProductService);
  private readonly numberFormat     = new Intl.NumberFormat(inject(CurrencyService).locale);

  protected readonly t = TEXTS.admin.locations;
  protected readonly c = TEXTS.common;

  readonly locations = this.locationsService.locations;
  readonly inventory = this.locationsService.inventory;
  readonly products  = this.productService.products;

  readonly isCreateOpen    = signal(false);
  readonly allocateTarget  = signal<SalesLocation | null>(null);
  readonly allocateMode    = signal<AllocateMode>('assign');
  readonly allocateMessage = signal<string | null>(null);
  readonly allocating      = signal(false);

  readonly inventoryByLocation = computed<InventoryGroup[]>(() => {
    const map = new Map<string, InventoryGroup>();
    for (const row of this.inventory()) {
      const key = row.locationId ?? '';
      const group = map.get(key) ?? { key, name: row.locationName, isWarehouse: row.locationId === null, rows: [] };
      group.rows.push(row);
      map.set(key, group);
    }
    return Array.from(map.values());
  });

  readonly kpis = computed<KpiMetric[]>(() => {
    const rows = this.inventory();
    const sum = (pick: (r: InventoryRow) => number) => rows.reduce((acc, r) => acc + pick(r), 0);
    const primary   = { iconBgClass: 'bg-primary/10', iconColorClass: 'text-primary' };
    const secondary = { iconBgClass: 'bg-secondary/10', iconColorClass: 'text-secondary' };
    const metric = (id: string, label: string, value: number, icon: string, tone: typeof primary): KpiMetric => ({
      id, label, icon, ...tone,
      value: this.numberFormat.format(value),
      trend: 0,
      trendPositive: true,
    });
    return [
      metric('total', this.t.kpis.total, sum(r => r.total), 'inventory_2', primary),
      metric('warehouse', this.t.kpis.warehouse, sum(r => (r.locationId === null ? r.available : 0)), 'warehouse', secondary),
      metric('assigned', this.t.kpis.assigned, sum(r => r.assigned), 'storefront', primary),
      metric('activated', this.t.kpis.activated, sum(r => r.active), 'task_alt', secondary),
    ];
  });

  openCreate(): void { this.isCreateOpen.set(true); }
  closeCreate(): void { this.isCreateOpen.set(false); }

  async onCreate(input: CreateLocationInput): Promise<void> {
    await this.locationsService.create(input);
    this.isCreateOpen.set(false);
  }

  openAllocate(location: SalesLocation, mode: AllocateMode): void {
    this.allocateMessage.set(null);
    this.allocateMode.set(mode);
    this.allocateTarget.set(location);
  }

  closeAllocate(): void { this.allocateTarget.set(null); }

  clearAllocateMessage(): void { this.allocateMessage.set(null); }

  async onAllocate({ productId, quantity }: AllocateRequest): Promise<void> {
    const target = this.allocateTarget();
    if (!target) return;
    const texts = this.t.allocate;
    this.allocating.set(true);
    try {
      if (this.allocateMode() === 'return') {
        const res = await this.locationsService.returnToWarehouse(target.id, productId, quantity);
        this.allocateMessage.set(
          res.returned > 0 ? texts.returned(res.returned, res.availableInWarehouse) : texts.nothingToReturn
        );
      } else {
        const res = await this.locationsService.allocate(target.id, productId, quantity);
        this.allocateMessage.set(
          res.allocated === res.requested
            ? texts.allocated(res.allocated, res.availableRemaining)
            : texts.partiallyAllocated(res.allocated, res.requested, res.availableRemaining)
        );
      }
    } catch (err) {
      this.allocateMessage.set(err instanceof Error ? err.message : this.c.errors.generic);
    } finally {
      this.allocating.set(false);
    }
  }
}
