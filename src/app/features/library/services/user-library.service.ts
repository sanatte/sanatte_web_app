import { Injectable, inject, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ProductService } from '../../administration/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product } from '../../administration/models/product.model';
import { OwnedProduct } from '../models/user-library.model';
import { environment } from '../../../../environments/environment';

interface ApiLibraryItem { productId: string; sku: string; resourcesIncluded: number; }

/**
 * UserLibraryService — datos de la Biblioteca del usuario autenticado.
 *
 * La propiedad de productos proviene de `GET /api/me/library` (compras de
 * digital/suscripción ∪ productos físicos activados por QR). El `Product` completo
 * se hidrata desde el catálogo ya cargado en ProductService.
 */
@Injectable({ providedIn: 'root' })
export class UserLibraryService {
  private readonly http           = inject(HttpClient);
  private readonly productService = inject(ProductService);
  private readonly auth           = inject(AuthService);

  private readonly _owned   = signal<ApiLibraryItem[]>([]);
  private readonly _loading = signal(false);
  readonly loading = this._loading.asReadonly();

  constructor() { this.load(); }

  async load(): Promise<void> {
    await this.auth.whenReady();
    if (!this.auth.currentUser()) { this._owned.set([]); return; }
    this._loading.set(true);
    try {
      const items = await firstValueFrom(
        this.http.get<ApiLibraryItem[]>(`${environment.apiUrl}/me/library`)
      );
      this._owned.set(items);
    } finally {
      this._loading.set(false);
    }
  }

  /** Productos que el usuario posee/activó. */
  readonly ownedProducts = computed<OwnedProduct[]>(() => {
    const catalog = this.productService.products();
    return this._owned()
      .map((item) => catalog.find((p) => p.id === item.productId))
      .filter((p): p is Product => !!p)
      .map((p) => {
        const { label, tone } = this.categoryOf(p);
        return { product: p, categoryLabel: label, categoryTone: tone };
      });
  });

  readonly hasProducts = computed(() => this.ownedProducts().length > 0);

  /** Tras activar un producto, refresca la biblioteca desde el backend. */
  registerActivated(_productId: string): void {
    this.load();
  }

  isActivated(productId: string): boolean {
    return this._owned().some((o) => o.productId === productId);
  }

  /** Etiqueta de categoría derivada del tipo/tags del producto. */
  private categoryOf(product: Product): { label: string; tone: 'primary' | 'secondary' } {
    if (product.type === 'subscription') return { label: 'Suscripción', tone: 'secondary' };
    if (product.type === 'physical')     return { label: 'Agenda', tone: 'primary' };
    // digital → afinar por tags
    if (product.tags.some((t) => /ebook|pdf/i.test(t))) return { label: 'Ebook', tone: 'secondary' };
    if (product.tags.some((t) => /curso|course/i.test(t))) return { label: 'Curso', tone: 'primary' };
    if (product.tags.some((t) => /audio/i.test(t))) return { label: 'Audio', tone: 'primary' };
    return { label: 'Digital', tone: 'primary' };
  }
}
