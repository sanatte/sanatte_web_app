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

/**
 * Metadata de presentación por tipo de recurso (icono + etiqueta).
 * Fuente ÚNICA usada por cards, tablas, formularios y visores.
 */
export const RESOURCE_TYPE_META: Record<ResourceType, { icon: string; label: string }> = {
  audio:   { icon: 'headphones',     label: 'Audio'    },
  video:   { icon: 'videocam',       label: 'Video'    },
  pdf:     { icon: 'picture_as_pdf', label: 'PDF'      },
  article: { icon: 'description',    label: 'Artículo' },
};

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
