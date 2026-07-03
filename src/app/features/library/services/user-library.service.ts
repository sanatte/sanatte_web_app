import { Injectable, inject, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ProductService } from '../../administration/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product } from '../../administration/models/product.model';
import { OwnedProduct, DailyFocus, WeeklyProgress, ProgressStatus } from '../models/user-library.model';
import { environment } from '../../../../environments/environment';

interface ApiLibraryItem { productId: string; sku: string; resourcesIncluded: number; }

/**
 * UserLibraryService — datos de la Biblioteca del usuario autenticado.
 *
 * La propiedad de productos proviene de `GET /api/me/library` (pedidos pagados ∪
 * licencias activadas por QR). El `Product` completo se hidrata desde el catálogo
 * ya cargado en ProductService. El "progreso", el enfoque del día y el resumen
 * semanal siguen como presentación (mock): son gamificación que requiere tracking
 * de consumo real de recursos, aún no implementado.
 */

// Progreso simulado por SKU (clave estable). Presentación hasta que exista
// tracking real de consumo por recurso.
const MOCK_PROGRESS: Record<string, number> = {
  'WLN-001': 45,   // Plena (activada por QR)
  'DIG-115': 100,  // The Silent Mind (eBook — compra directa)
  'DIG-082': 30,   // Guided Flow Pro (suscripción)
};

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

  /** Productos que el usuario posee/activó, con su progreso. */
  readonly ownedProducts = computed<OwnedProduct[]>(() => {
    const catalog = this.productService.products();
    return this._owned()
      .map((item) => catalog.find((p) => p.id === item.productId))
      .filter((p): p is Product => !!p)
      .map((p) => this.toOwnedProduct(p, MOCK_PROGRESS[p.sku] ?? 0));
  });

  readonly hasProducts = computed(() => this.ownedProducts().length > 0);

  /** Tras activar un producto, refresca la biblioteca desde el backend. */
  registerActivated(_productId: string): void {
    this.load();
  }

  isActivated(productId: string): boolean {
    return this._owned().some((o) => o.productId === productId);
  }

  readonly dailyFocus: DailyFocus = {
    badge: 'Enfoque del día',
    title: 'Meditación: Claridad Mental',
    description:
      'Una sesión de 15 minutos diseñada para reducir el ruido cognitivo y centrar tu atención en lo esencial.',
    durationMinutes: 15,
    gradient: 'from-indigo-500 via-purple-600 to-violet-800',
    resourceId: 'res-7',
  };

  readonly weeklyProgress: WeeklyProgress = {
    percentage: 85,
    daysCompleted: 4,
    daysTotal: 5,
    quote: 'La constancia es la llave del bienestar profundo.',
  };

  private toOwnedProduct(product: Product, progress: number): OwnedProduct {
    const status: ProgressStatus =
      progress >= 100 ? 'completed' : progress > 0 ? 'in_progress' : 'not_started';

    const { label, tone } = this.categoryOf(product);
    return { product, progress, status, categoryLabel: label, categoryTone: tone };
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
