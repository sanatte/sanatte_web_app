import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { ProductService } from '../../administration/services/product.service';
import { Product, getPrimaryImage } from '../../administration/models/product.model';

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface CartLine {
  product: Product;
  quantity: number;
  gradient: string;
  lineTotal: number;
}

const STORAGE_KEY = 'sanatte_cart';

/**
 * CartService — carrito de compra (público, pre-checkout).
 *
 * Estado persistido en localStorage. La compra requiere cuenta: el checkout
 * (fase siguiente) exige iniciar sesión antes de pagar. Migración: sincronizar
 * con backend al autenticar.
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly products = inject(ProductService);

  private readonly _items = signal<CartItem[]>(this.restore());
  readonly items = this._items.asReadonly();

  readonly lines = computed<CartLine[]>(() =>
    this._items()
      .map((i) => {
        const product = this.products.getById(i.productId);
        if (!product) return null;
        return {
          product,
          quantity: i.quantity,
          gradient: getPrimaryImage(product)?.gradient ?? 'from-violet-400 to-purple-600',
          lineTotal: product.price * i.quantity,
        };
      })
      .filter((l): l is CartLine => l !== null)
  );

  // El contador refleja solo productos válidos (evita badge≠carrito por items huérfanos).
  readonly count = computed(() => this.lines().reduce((n, l) => n + l.quantity, 0));

  readonly subtotal = computed(() => this.lines().reduce((sum, l) => sum + l.lineTotal, 0));

  constructor() {
    // Depura items huérfanos (productos que ya no existen en el catálogo) una vez
    // que el catálogo cargó. Suele pasar tras resembrar la BD (cambian los GUID).
    effect(() => {
      const catalog = this.products.products();
      if (catalog.length === 0) return; // aún no carga el catálogo
      const validIds = new Set(catalog.map((p) => p.id));
      const current = this._items();
      const pruned = current.filter((i) => validIds.has(i.productId));
      if (pruned.length !== current.length) {
        this._items.set(pruned);
        this.persist();
      }
    });
  }

  add(productId: string, quantity = 1): void {
    this._items.update((items) => {
      const existing = items.find((i) => i.productId === productId);
      const next = existing
        ? items.map((i) => (i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i))
        : [...items, { productId, quantity }];
      return next;
    });
    this.persist();
  }

  setQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) { this.remove(productId); return; }
    this._items.update((items) => items.map((i) => (i.productId === productId ? { ...i, quantity } : i)));
    this.persist();
  }

  remove(productId: string): void {
    this._items.update((items) => items.filter((i) => i.productId !== productId));
    this.persist();
  }

  clear(): void {
    this._items.set([]);
    this.persist();
  }

  private restore(): CartItem[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    try { return JSON.parse(stored) as CartItem[]; } catch { return []; }
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._items()));
  }
}
