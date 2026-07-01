import { Injectable, signal, computed } from '@angular/core';
import { Product, ProductImage } from '../models/product.model';
import { MOCK_PRODUCTS } from '../mocks/products.mock';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly _products = signal<Product[]>(MOCK_PRODUCTS);

  readonly products = this._products.asReadonly();
  readonly total = computed(() => this._products().length);

  create(product: Omit<Product, 'id' | 'createdAt' | 'salesCount'>): void {
    const newProduct: Product = {
      ...product,
      id: `p${Date.now()}`,
      salesCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    this._products.update((list) => [...list, newProduct]);
  }

  update(id: string, changes: Partial<Product>): void {
    this._products.update((list) =>
      list.map((p) => (p.id === id ? { ...p, ...changes } : p))
    );
  }

  delete(id: string): void {
    this._products.update((list) => list.filter((p) => p.id !== id));
  }

  getById(id: string): Product | undefined {
    return this._products().find((p) => p.id === id);
  }

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
      list.map((p) =>
        p.id === productId ? { ...p, images: [...p.images, image] } : p
      )
    );
  }

  removeImage(productId: string, imageId: string): void {
    this._products.update((list) =>
      list.map((p) => {
        if (p.id !== productId) return p;
        const filtered = p.images.filter((img) => img.id !== imageId);
        // Si se eliminó la principal, marcar la primera como principal
        const hasPrimary = filtered.some((img) => img.isPrimary);
        return {
          ...p,
          images: hasPrimary ? filtered : filtered.map((img, i) => ({ ...img, isPrimary: i === 0 })),
        };
      })
    );
  }
}
