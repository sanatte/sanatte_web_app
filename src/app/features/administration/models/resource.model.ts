/**
 * Resource — módulo de contenido digital de Sanatte (tenant-specific).
 *
 * Intencionalmente NO tiene referencia a productos.
 * El vínculo producto ↔ recurso vive en Product.entitlements[] (ecommerce core)
 * y se resuelve a través de EntitlementService.
 *
 * Otro tenant usaría su propio modelo de contenido (Lección, DownloadLink, etc.)
 * sin modificar el ecommerce core.
 */
export type ResourceType   = 'audio' | 'video' | 'pdf' | 'article';
export type ResourceStatus = 'published' | 'draft';

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  status: ResourceStatus;
  tags: string[];
  duration?: string;
  fileSize?: string;
  readTime?: string;
  thumbnailGradient: string;
  createdAt: string;
}
