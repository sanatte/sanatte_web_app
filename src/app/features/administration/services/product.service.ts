import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Product, ProductImage } from '../models/product.model';
import { Resource } from '../models/resource.model';
import { environment } from '../../../../environments/environment';
import { mapApiProduct, toApiProductBody } from './api-mappers';

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

  /**
   * Devuelve el producto desde la caché o, si no está (p. ej. F5 directo en el
   * detalle antes de que cargue la lista), lo pide a la API por id y lo upserta
   * en el signal para que las mutaciones posteriores (imágenes, etc.) funcionen.
   */
  async fetchById(id: string): Promise<Product | undefined> {
    const cached = this._products().find((p) => p.id === id);
    if (cached) return cached;
    try {
      const raw = await firstValueFrom(this.http.get<unknown>(`${this.base}/${id}`));
      const product = mapApiProduct(raw);
      this._products.update((list) => (list.some((p) => p.id === id) ? list : [product, ...list]));
      return product;
    } catch {
      return undefined;
    }
  }

  /** Busca por SKU — clave de negocio estable (no cambia entre mock y API). */
  getBySku(sku: string): Product | undefined {
    return this._products().find((p) => p.sku === sku);
  }

  async create(product: Omit<Product, 'id' | 'createdAt' | 'salesCount'>): Promise<void> {
    const raw = await firstValueFrom(this.http.post<unknown>(this.base, toApiProductBody(product)));
    const created = mapApiProduct(raw);
    this._products.update((list) => [created, ...list]);
    this._total.update((t) => t + 1);
  }

  /** Edita un producto: mezcla los cambios con el actual y persiste (PUT). */
  async update(id: string, changes: Partial<Product>): Promise<void> {
    const current = this._products().find((p) => p.id === id);
    if (!current) return;
    const merged = { ...current, ...changes };
    const raw = await firstValueFrom(this.http.put<unknown>(`${this.base}/${id}`, toApiProductBody(merged)));
    const updated = mapApiProduct(raw);
    this._products.update((list) => list.map((p) => (p.id === id ? updated : p)));
  }

  async delete(id: string): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.base}/${id}`));
    this._products.update((list) => list.filter((p) => p.id !== id));
    this._total.update((t) => Math.max(0, t - 1));
  }

  // ─── Imágenes — endpoints dedicados ────────────────────────────────────────

  /** Sube una imagen al producto. Devuelve la imagen creada con su URL. */
  async uploadImage(
    productId: string, file: File, altText = '', isPrimary = false
  ): Promise<ProductImage> {
    const fd = new FormData();
    fd.append('file', file, file.name);
    fd.append('altText', altText);
    fd.append('isPrimary', String(isPrimary));
    const raw = await firstValueFrom(
      this.http.post<ProductImage>(`${this.base}/${productId}/images`, fd)
    );
    const newImg: ProductImage = {
      id: raw.id, url: (raw as any).url ?? null,
      gradient: (raw as any).gradient ?? null,
      altText: raw.altText, isPrimary: raw.isPrimary,
    };
    this._products.update((list) =>
      list.map((p) => {
        if (p.id !== productId) return p;
        const images = isPrimary
          ? [...p.images.map((i) => ({ ...i, isPrimary: false })), newImg]
          : [...p.images, newImg];
        return { ...p, images };
      })
    );
    return newImg;
  }

  async setPrimaryImage(productId: string, imageId: string): Promise<void> {
    await firstValueFrom(
      this.http.patch(`${this.base}/${productId}/images/${imageId}/primary`, {})
    );
    this._products.update((list) =>
      list.map((p) => p.id !== productId ? p : {
        ...p,
        images: p.images.map((i) => ({ ...i, isPrimary: i.id === imageId })),
      })
    );
  }

  async removeImage(productId: string, imageId: string): Promise<void> {
    await firstValueFrom(
      this.http.delete(`${this.base}/${productId}/images/${imageId}`)
    );
    this._products.update((list) =>
      list.map((p) => {
        if (p.id !== productId) return p;
        const filtered = p.images.filter((i) => i.id !== imageId);
        const hasPrimary = filtered.some((i) => i.isPrimary);
        const images = hasPrimary ? filtered : filtered.map((i, idx) => ({ ...i, isPrimary: idx === 0 }));
        return { ...p, images };
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
