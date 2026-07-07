import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  SalesLocation, LocationType, SalesModel, InventoryRow, AllocationResult,
} from '../models/location.model';
import { environment } from '../../../../environments/environment';

const LOCATION_TYPE_MAP: Record<number, LocationType> = { 0: 'ecommerce', 1: 'physical_point' };
const SALES_MODEL_MAP: Record<number, SalesModel> = { 0: 'consignment', 1: 'wholesale' };
const LOCATION_TYPE_INT: Record<LocationType, number> = { ecommerce: 0, physical_point: 1 };
const SALES_MODEL_INT: Record<SalesModel, number> = { consignment: 0, wholesale: 1 };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapLocation(raw: any): SalesLocation {
  return {
    id: raw.id,
    name: raw.name,
    type: LOCATION_TYPE_MAP[raw.type] ?? 'physical_point',
    salesModel: SALES_MODEL_MAP[raw.salesModel] ?? 'consignment',
    commissionPercent: raw.commissionPercent ?? 0,
    contactName: raw.contactName ?? undefined,
    contactPhone: raw.contactPhone ?? undefined,
    isActive: raw.isActive ?? true,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapInventory(raw: any): InventoryRow {
  return {
    locationId: raw.locationId ?? null,
    locationName: raw.locationName,
    productId: raw.productId,
    productName: raw.productName,
    available: raw.available ?? 0,
    assigned: raw.assigned ?? 0,
    sold: raw.sold ?? 0,
    active: raw.active ?? 0,
    revoked: raw.revoked ?? 0,
    total: raw.total ?? 0,
  };
}

export interface CreateLocationInput {
  name: string;
  type: LocationType;
  salesModel: SalesModel;
  commissionPercent: number;
  contactName?: string;
  contactPhone?: string;
}

@Injectable({ providedIn: 'root' })
export class LocationService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/admin/locations`;

  private readonly _locations = signal<SalesLocation[]>([]);
  private readonly _inventory = signal<InventoryRow[]>([]);

  readonly locations = this._locations.asReadonly();
  readonly inventory = this._inventory.asReadonly();

  constructor() { this.loadAll(); }

  async loadAll(): Promise<void> {
    const [locations, inventory] = await Promise.all([
      firstValueFrom(this.http.get<unknown[]>(this.base)),
      firstValueFrom(this.http.get<unknown[]>(`${this.base}/inventory`)),
    ]);
    this._locations.set(locations.map(mapLocation));
    this._inventory.set(inventory.map(mapInventory));
  }

  async create(input: CreateLocationInput): Promise<void> {
    const body = {
      name: input.name,
      type: LOCATION_TYPE_INT[input.type],
      salesModel: SALES_MODEL_INT[input.salesModel],
      commissionPercent: input.commissionPercent,
      contactName: input.contactName || null,
      contactPhone: input.contactPhone || null,
    };
    const raw = await firstValueFrom(this.http.post<unknown>(this.base, body));
    this._locations.update((list) => [...list, mapLocation(raw)]);
  }

  /** Asigna unidades disponibles de un producto a una ubicación (bodega → punto). */
  async allocate(locationId: string, productId: string, quantity: number): Promise<AllocationResult> {
    const result = await firstValueFrom(
      this.http.post<AllocationResult>(`${this.base}/${locationId}/allocate`, { productId, quantity })
    );
    await this.refreshInventory();
    return result;
  }

  private async refreshInventory(): Promise<void> {
    const inventory = await firstValueFrom(this.http.get<unknown[]>(`${this.base}/inventory`));
    this._inventory.set(inventory.map(mapInventory));
  }
}
