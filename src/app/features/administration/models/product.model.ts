export type ProductType     = 'physical' | 'digital' | 'subscription';
export type ProductStatus   = 'active'   | 'inactive';
export type AccessType      = 'qr_activation' | 'direct_purchase' | 'subscription';
export type ResourceType    = 'audio' | 'video' | 'pdf' | 'article';
export type BillingPeriod   = 'monthly' | 'annual';

export interface ProductImage {
  id: string;
  gradient: string;   // placeholder en fase mock; será una URL en producción
  altText: string;
  isPrimary: boolean;
}

export interface ProductResource {
  id: string;
  name: string;
  type: ResourceType;
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
  resources: ProductResource[];
  salesCount: number;
  stock?: number;
  tags: string[];
  specs: { label: string; value: string }[];
  createdAt: string;
}

/** Devuelve la imagen marcada como principal, o la primera si ninguna lo está. */
export function getPrimaryImage(product: Product): ProductImage | undefined {
  return product.images.find((img) => img.isPrimary) ?? product.images[0];
}
