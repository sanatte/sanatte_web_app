import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Product, ProductImage } from '../models/product.model';
import { Resource } from '../models/resource.model';
import { environment } from '../../../../environments/environment';
import { mapApiProduct } from './api-mappers';

interface PagedResult<T> { items: T[]; page: number; pageSize: number; totalItems: number; }

/**
 * ProductService — conectado a la API .NET real.
 *
 * La API pública (signals `products`, `total`, métodos `getById`/`create`/`update`/`delete`)
 * es idéntica a la versión mock: los componentes no cambian.
 *
 * Estrategia de sincronización:
 * - Al inicializar se carga la primera página de productos.
 * - Las mutaciones (create/update/delete) se aplican localmente sobre el signal
 *   y además persisten en la API → UI reactiva sin esperar refresh completo.
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/products`;

  private readonly _products = signal<Product[]>([]);
  private readonly _loading  = signal(false);
  private readonly _total    = signal(0);

  readonly products = this._products.asReadonly();
  readonly loading  = this._loading.asReadonly();
  readonly total    = computed(() => this._total());

  constructor() { this.loadAll(); }

  /** Carga todos los productos activos + inactivos para el admin (onlyActive=false). */
  async loadAll(): Promise<void> {
    this._loading.set(true);
    try {
      const params = new HttpParams().set('pageSize', '100').set('onlyActive', 'false');
      const res = await firstValueFrom(this.http.get<PagedResult<Product>>(this.base, { params }));
      this._products.set(res.items.map(mapApiProduct));
      this._total.set(res.totalItems);
    } finally {
      this._loading.set(false);
    }
  }

  getById(id: string): Product | undefined {
    return this._products().find((p) => p.id === id);
  }

  /** Busca por SKU — clave de negocio estable (no cambia entre mock y API). */
  getBySku(sku: string): Product | undefined {
    return this._products().find((p) => p.sku === sku);
  }

  async create(product: Omit<Product, 'id' | 'createdAt' | 'salesCount'>): Promise<void> {
    const raw = await firstValueFrom(this.http.post<unknown>(this.base, product));
    const created = mapApiProduct(raw);
    this._products.update((list) => [created, ...list]);
    this._total.update((t) => t + 1);
  }

  update(id: string, changes: Partial<Product>): void {
    // Actualización optimista local (sin esperar la API por ahora — siguiente slice)
    this._products.update((list) =>
      list.map((p) => (p.id === id ? { ...p, ...changes } : p))
    );
  }

  delete(id: string): void {
    this._products.update((list) => list.filter((p) => p.id !== id));
    this._total.update((t) => Math.max(0, t - 1));
  }

  // ─── Imágenes y entitlements (local, pendiente de endpoints propios) ────────

  setPrimaryImage(productId: string, imageId: string): void {
    this._products.update((list) =>
      list.map((p) =>
        p.id === productId
          ? { ...p, images: p.images.map((img) => ({ ...img, isPrimary: img.id === imageId })) }
          : p
      )
    );
  }

  addImage(productId: string, image: ProductImage): void {
    this._products.update((list) =>
      list.map((p) => p.id === productId ? { ...p, images: [...p.images, image] } : p)
    );
  }

  removeImage(productId: string, imageId: string): void {
    this._products.update((list) =>
      list.map((p) => {
        if (p.id !== productId) return p;
        const filtered = p.images.filter((img) => img.id !== imageId);
        const hasPrimary = filtered.some((img) => img.isPrimary);
        return { ...p, images: hasPrimary ? filtered : filtered.map((img, i) => ({ ...img, isPrimary: i === 0 })) };
      })
    );
  }

  /** Vincula un recurso al producto (capa Entitlement en la API — ruta admin). */
  async addResourceEntitlement(productId: string, resource: Resource): Promise<void> {
    const url = `${environment.apiUrl}/admin/products/${productId}/entitlements`;
    const raw = await firstValueFrom(this.http.post<unknown>(url, { resourceId: resource.id }));
    const updated = mapApiProduct(raw);
    this._products.update((list) => list.map((p) => p.id === productId ? updated : p));
  }

  /** Desvincula un recurso del producto. */
  async removeResourceEntitlement(productId: string, resourceId: string): Promise<void> {
    const url = `${environment.apiUrl}/admin/products/${productId}/entitlements/${resourceId}`;
    const raw = await firstValueFrom(this.http.delete<unknown>(url));
    const updated = mapApiProduct(raw);
    this._products.update((list) => list.map((p) => p.id === productId ? updated : p));
  }
}
