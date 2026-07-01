import { Injectable, inject } from '@angular/core';
import { Product } from '../models/product.model';
import { Entitlement } from '../models/entitlement.model';
import { Resource } from '../models/resource.model';
import { ResourceService } from './resource.service';

/**
 * EntitlementService — capa de resolución entre el ecommerce core y los módulos
 * de contenido del tenant.
 *
 * El ecommerce core (Product, Order, License) habla solo con Entitlements.
 * Este servicio resuelve qué objetos reales (Resources en Sanatte) corresponden
 * a cada entitlement.
 *
 * Para un nuevo tenant: crear un servicio análogo que resuelva hacia sus propios
 * modelos de contenido sin modificar Product ni Order.
 */
@Injectable({ providedIn: 'root' })
export class EntitlementService {
  private readonly resourceService = inject(ResourceService);

  /** Recursos (Sanatte) vinculados a un producto a través de sus entitlements. */
  getResourcesForProduct(product: Product): Resource[] {
    return product.entitlements
      .filter((e) => e.type === 'content_item')
      .map((e) => this.resourceService.getById(e.referenceId))
      .filter((r): r is Resource => r !== undefined);
  }

  /** Cantidad de content_items de un producto (sin resolver). */
  getContentCount(product: Product): number {
    return product.entitlements.filter((e) => e.type === 'content_item').length;
  }

  /** Productos que tienen un entitlement apuntando a un resource dado. */
  getLinkedProductCount(resourceId: string, products: Product[]): number {
    return products.filter((p) =>
      p.entitlements.some(
        (e) => e.type === 'content_item' && e.referenceId === resourceId
      )
    ).length;
  }

  /** Construye un mapa resourceId → nº de productos vinculados (para la UI de recursos). */
  buildLinkedCountMap(products: Product[]): Record<string, number> {
    const map: Record<string, number> = {};
    for (const p of products) {
      for (const e of p.entitlements.filter((e) => e.type === 'content_item')) {
        map[e.referenceId] = (map[e.referenceId] ?? 0) + 1;
      }
    }
    return map;
  }

  /** Añade un content_item entitlement a un producto. */
  addContentEntitlement(product: Product, resource: Resource): Entitlement {
    return {
      id: `ent-${Date.now()}`,
      type: 'content_item',
      referenceId: resource.id,
      label: resource.title,
    };
  }
}
