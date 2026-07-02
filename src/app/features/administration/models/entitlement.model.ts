/**
 * Entitlement — qué recursos digitales incluye un producto.
 *
 * Vincula un producto con los items de contenido que entrega. En Sanatte el
 * caso principal es `content_item` → un Resource (audio/video/pdf/artículo).
 */
export type EntitlementType =
  | 'content_item'       // ítem de contenido digital (audio, video, pdf, artículo)
  | 'download'           // archivo descargable genérico
  | 'license_key'        // clave de activación
  | 'qr_access'          // acceso via código QR (productos físicos)
  | 'subscription_tier'; // nivel de acceso por suscripción

export interface Entitlement {
  id: string;
  type: EntitlementType;
  referenceId: string;  // ID del recurso incluido (Resource.id)
  label: string;        // nombre legible (evita resolver el recurso solo para mostrarlo)
  metadata?: Record<string, string>;
}
