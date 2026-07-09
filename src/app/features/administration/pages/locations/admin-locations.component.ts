import { Component, inject, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { LocationService } from '../../services/location.service';
import { ProductService } from '../../services/product.service';
import { ThousandsSeparatorDirective } from '../../../../shared/directives/thousands-separator.directive';
import {
  SalesLocation, LocationType, SalesModel, InventoryRow,
  LOCATION_TYPE_LABEL, SALES_MODEL_LABEL,
} from '../../models/location.model';

interface InventoryGroup { name: string; rows: InventoryRow[] }

@Component({
  selector: 'app-admin-locations',
  imports: [ReactiveFormsModule, ThousandsSeparatorDirective],
  templateUrl: './admin-locations.component.html',
})
export class AdminLocationsComponent {
  private readonly fb = inject(FormBuilder);
  private readonly locationsService = inject(LocationService);
  private readonly productService = inject(ProductService);

  readonly locations = this.locationsService.locations;
  readonly inventory = this.locationsService.inventory;
  readonly products = this.productService.products;

  readonly typeLabel = (t: LocationType) => LOCATION_TYPE_LABEL[t];
  readonly modelLabel = (m: SalesModel) => SALES_MODEL_LABEL[m];

  // ── Crear ubicación ──────────────────────────────────────────────
  readonly showCreate = signal(false);
  readonly createForm = this.fb.nonNullable.group({
    name:              ['', Validators.required],
    type:              ['physical_point' as LocationType],
    salesModel:        ['consignment' as SalesModel],
    commissionPercent: [0],
    contactName:       [''],
    contactPhone:      [''],
  });

  openCreate(): void {
    this.createForm.reset({
      name: '', type: 'physical_point', salesModel: 'consignment',
      commissionPercent: 0, contactName: '', contactPhone: '',
    });
    this.showCreate.set(true);
  }

  closeCreate(): void { this.showCreate.set(false); }

  async submitCreate(): Promise<void> {
    if (this.createForm.invalid) { this.createForm.markAllAsTouched(); return; }
    const v = this.createForm.getRawValue();
    await this.locationsService.create({
      name: v.name.trim(),
      type: v.type,
      salesModel: v.salesModel,
      commissionPercent: (v.type === 'physical_point' && v.salesModel === 'consignment')
        ? Number(v.commissionPercent) || 0
        : 0,
      contactName: v.contactName?.trim() || undefined,
      contactPhone: v.contactPhone?.trim() || undefined,
    });
    this.showCreate.set(false);
  }

  // ── Asignar / devolver unidades ──────────────────────────────────
  readonly allocateTarget    = signal<SalesLocation | null>(null);
  readonly allocateMode      = signal<'assign' | 'return'>('assign');
  readonly allocateMessage   = signal<string | null>(null);
  readonly allocating        = signal(false);
  readonly selectedProductId = signal('');

  readonly allocateForm = this.fb.nonNullable.group({
    productId: ['', Validators.required],
    quantity:  [1 as number, [Validators.required, Validators.min(1)]],
  });

  /** Unidades Assigned en este punto para el producto seleccionado (modo devolver). */
  readonly maxReturnable = computed(() => {
    const target = this.allocateTarget();
    const pid = this.selectedProductId();
    if (!target || !pid) return 0;
    return this.inventory()
      .find(r => r.locationId === target.id && r.productId === pid)
      ?.assigned ?? 0;
  });

  /** Unidades Available en bodega (sin ubicación) para el producto seleccionado (modo asignar). */
  readonly maxAssignable = computed(() => {
    const pid = this.selectedProductId();
    if (!pid) return 0;
    return this.inventory()
      .find(r => r.locationId === null && r.productId === pid)
      ?.available ?? 0;
  });

  /** Error de cantidad en modo devolver: excede asignadas en el punto. */
  readonly quantityExceedsStock = computed(() => {
    const qty = Number(this.allocateForm.get('quantity')?.value ?? 0);
    if (this.allocateMode() === 'return') return qty > 0 && qty > this.maxReturnable();
    if (this.allocateMode() === 'assign') return qty > 0 && qty > this.maxAssignable();
    return false;
  });

  onProductChange(productId: string): void {
    this.selectedProductId.set(productId);
    this.allocateMessage.set(null);
    // resetea cantidad al cambiar producto para evitar residuos
    this.allocateForm.patchValue({ quantity: 1 });
  }

  openAllocate(location: SalesLocation): void {
    this.allocateMessage.set(null);
    this.selectedProductId.set('');
    this.allocateForm.reset({ productId: '', quantity: 1 });
    this.allocateMode.set('assign');
    this.allocateTarget.set(location);
  }

  openReturn(location: SalesLocation): void {
    this.allocateMessage.set(null);
    this.selectedProductId.set('');
    this.allocateForm.reset({ productId: '', quantity: 1 });
    this.allocateMode.set('return');
    this.allocateTarget.set(location);
  }

  closeAllocate(): void { this.allocateTarget.set(null); }

  async submitAllocate(): Promise<void> {
    const target = this.allocateTarget();
    if (!target || this.allocateForm.invalid) { this.allocateForm.markAllAsTouched(); return; }
    if (this.quantityExceedsStock()) return;
    const { productId, quantity } = this.allocateForm.getRawValue();
    this.allocating.set(true);
    try {
      if (this.allocateMode() === 'return') {
        const res = await this.locationsService.returnToWarehouse(target.id, productId, Number(quantity));
        this.allocateMessage.set(
          res.returned > 0
            ? `Se devolvieron ${res.returned} unidad(es) a la bodega. Disponibles: ${res.availableInWarehouse}.`
            : 'No había unidades asignadas a este punto para devolver.'
        );
      } else {
        const res = await this.locationsService.allocate(target.id, productId, Number(quantity));
        this.allocateMessage.set(
          res.allocated === res.requested
            ? `Se asignaron ${res.allocated} unidad(es). Disponibles en bodega: ${res.availableRemaining}.`
            : `Solo había ${res.allocated} de ${res.requested} disponibles. Disponibles: ${res.availableRemaining}.`
        );
      }
    } catch (err) {
      this.allocateMessage.set(err instanceof Error ? err.message : 'No se pudo completar la operación.');
    } finally {
      this.allocating.set(false);
    }
  }

  // ── Inventario agrupado por ubicación ────────────────────────────
  readonly inventoryByLocation = computed<InventoryGroup[]>(() => {
    const map = new Map<string, InventoryGroup>();
    for (const row of this.inventory()) {
      const key = row.locationId ?? '__unassigned__';
      const group = map.get(key) ?? { name: row.locationName, rows: [] };
      group.rows.push(row);
      map.set(key, group);
    }
    return Array.from(map.values());
  });
}
