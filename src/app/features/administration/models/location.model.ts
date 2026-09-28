export type LocationType = 'ecommerce' | 'physical_point';
export type SalesModel = 'consignment' | 'wholesale';

export interface SalesLocation {
  id: string;
  name: string;
  type: LocationType;
  salesModel: SalesModel;
  commissionPercent: number;
  contactName?: string;
  contactPhone?: string;
  isActive: boolean;
}

/** Desglose de inventario por ubicación/producto (unidades por estado). */
export interface InventoryRow {
  locationId: string | null;
  locationName: string;
  productId: string;
  productName: string;
  available: number;
  assigned: number;
  sold: number;
  active: number;
  revoked: number;
  total: number;
}

export interface AllocationResult {
  requested: number;
  allocated: number;
  availableRemaining: number;
}
