import { Injectable, inject, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ProductService } from '../../administration/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product } from '../../administration/models/product.model';
import { OwnedProduct } from '../models/user-library.model';
import { environment } from '../../../../environments/environment';
import { TEXTS } from '../../../core/i18n/texts';

const CATEGORY = TEXTS.app.library.categories;

interface ApiLibraryItem { productId: string; sku: string; resourcesIncluded: number; }

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

  registerActivated(_productId: string): void {
    this.load();
  }

  isActivated(productId: string): boolean {
    return this._owned().some((o) => o.productId === productId);
  }

  private categoryOf(product: Product): { label: string; tone: 'primary' | 'secondary' } {
    if (product.type === 'subscription') return { label: CATEGORY.subscription, tone: 'secondary' };
    if (product.type === 'physical')     return { label: CATEGORY.physical, tone: 'primary' };
    if (product.tags.some((t) => /ebook|pdf/i.test(t))) return { label: CATEGORY.ebook, tone: 'secondary' };
    if (product.tags.some((t) => /curso|course/i.test(t))) return { label: CATEGORY.course, tone: 'primary' };
    if (product.tags.some((t) => /audio/i.test(t))) return { label: CATEGORY.audio, tone: 'primary' };
    return { label: CATEGORY.digital, tone: 'primary' };
  }
}
