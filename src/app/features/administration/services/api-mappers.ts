import { Product, ProductType, ProductStatus, AccessType } from '../models/product.model';
import { Entitlement, EntitlementType } from '../models/entitlement.model';

/**
 * La API .NET devuelve enums como números (siguiendo la convención de C#).
 * El frontend usa strings ('physical', 'active', etc.).
 * Estos mappers convierten la respuesta de la API al modelo interno del front.
 */

const TYPE_MAP: Record<number, ProductType>   = { 0: 'physical', 1: 'digital', 2: 'subscription' };
const STATUS_MAP: Record<number, ProductStatus> = { 0: 'active', 1: 'inactive' };
const ACCESS_MAP: Record<number, AccessType>   = { 0: 'qr_activation', 1: 'direct_purchase', 2: 'subscription' };
const ENTITLEMENT_TYPE_MAP: Record<number, EntitlementType> = {
  0: 'content_item', 1: 'download', 2: 'license_key', 3: 'qr_access', 4: 'subscription_tier',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapApiEntitlement(raw: any): Entitlement {
  return {
    id:          raw.id,
    type:        ENTITLEMENT_TYPE_MAP[raw.type] ?? 'content_item',
    referenceId: raw.referenceId,
    label:       raw.label,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapApiProduct(raw: any): Product {
  return {
    id:                  raw.id,
    sku:                 raw.sku,
    name:                raw.name,
    description:         raw.description,
    type:                TYPE_MAP[raw.type]   ?? 'digital',
    price:               raw.price,
    billingPeriod:       raw.billingPeriod,
    status:              STATUS_MAP[raw.status] ?? 'inactive',
    accessType:          ACCESS_MAP[raw.accessType] ?? 'direct_purchase',
    requiresActivation:  raw.requiresActivation,
    images:              raw.images ?? [],
    entitlements:        (raw.entitlements ?? []).map(mapApiEntitlement),
    salesCount:          raw.salesCount ?? 0,
    stock:               raw.stock,
    tags:                raw.tags ?? [],
    specs:               (raw.specs ?? []).map((s: { label: string; value: string }) => ({ label: s.label, value: s.value })),
    createdAt:           raw.createdAt ?? new Date().toISOString().split('T')[0],
  };
}
