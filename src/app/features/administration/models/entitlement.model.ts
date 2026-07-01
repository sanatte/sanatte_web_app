/**
 * Entitlement — qué "entrega" un producto al ser comprado/activado.
 *
 * Es el punto de extensión clave para multi-tenancy:
 *   - Sanatte wellness:  type='content_item'  → referenceId apunta a un Resource
 *   - Academia música:   type='content_item'  → referenceId apunta a una Lección
 *   - Software:          type='download'       → referenceId apunta a un DownloadLink
 *   - Producto físico:   type='qr_access'      → referenceId apunta a un QrBundle
 *   - Suscripción:       type='subscription_tier' → referenceId apunta a un Tier
 *
 * El ecommerce core (Product, Order, License, Activation) NO conoce los módulos
 * de contenido. Solo trabaja con Entitlements. Cada tenant conecta su propio
 * módulo de contenido a través del EntitlementService.
 */
export type EntitlementType =
  | 'content_item'       // ítem de contenido digital (audio, video, pdf, artículo)
  | 'download'           // archivo descargable genérico
  | 'license_key'        // clave de activación de software
  | 'qr_access'          // acceso via código QR (productos físicos)
  | 'subscription_tier'; // nivel de acceso por suscripción

export interface Entitlement {
  id: string;
  type: EntitlementType;
  referenceId: string;  // ID del item en el módulo de contenido del tenant
  label: string;        // nombre legible (evita resolver el item solo para mostrarlo)
  metadata?: Record<string, string>;
}
