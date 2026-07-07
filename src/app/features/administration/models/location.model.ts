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

export const LOCATION_TYPE_LABEL: Record<LocationType, string> = {
  ecommerce: 'Ecommerce',
  physical_point: 'Punto físico',
};

export const SALES_MODEL_LABEL: Record<SalesModel, string> = {
  consignment: 'Consignación',
  wholesale: 'Venta en firme',
};
