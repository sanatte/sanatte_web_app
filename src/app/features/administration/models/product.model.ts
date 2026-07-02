import { Entitlement } from './entitlement.model';

export type ProductType   = 'physical' | 'digital' | 'subscription';
export type ProductStatus = 'active'   | 'inactive';
export type AccessType    = 'qr_activation' | 'direct_purchase' | 'subscription';
export type ResourceType  = 'audio' | 'video' | 'pdf' | 'article';
export type BillingPeriod = 'monthly' | 'annual';

export interface ProductImage {
  id: string;
  gradient: string;
  altText: string;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  type: ProductType;
  price: number;
  billingPeriod?: BillingPeriod;
  status: ProductStatus;
  accessType: AccessType;
  requiresActivation: boolean;
  images: ProductImage[];
  /**
   * Entitlements — recursos digitales que incluye este producto.
   * `EntitlementService` los resuelve a los Resource correspondientes.
   */
  entitlements: Entitlement[];
  salesCount: number;
  stock?: number;
  tags: string[];
  specs: { label: string; value: string }[];
  createdAt: string;
}

export function getPrimaryImage(product: Product): ProductImage | undefined {
  return product.images.find((img) => img.isPrimary) ?? product.images[0];
}
