import { Injectable, inject, computed } from '@angular/core';
import { ProductService } from '../../administration/services/product.service';
import { Product } from '../../administration/models/product.model';
import { OwnedProduct, DailyFocus, WeeklyProgress, ProgressStatus } from '../models/user-library.model';

/**
 * UserLibraryService — datos de la Biblioteca del usuario autenticado.
 *
 * Fase Mock: el usuario "posee" un subconjunto de productos con un progreso simulado.
 * Migración: reemplazar `OWNED` por la respuesta del backend (productos activados vía
 * QR / comprados) y calcular `progress` desde el consumo real de recursos.
 * La API pública (signals/getters) no cambia.
 */

// Progreso simulado por producto (productId → % completado).
const MOCK_PROGRESS: Record<string, number> = {
  p1: 65,   // Plena (Agenda)
  p3: 100,  // The Silent Mind (eBook)
  p2: 30,   // Guided Flow Pro (Suscripción)
};

@Injectable({ providedIn: 'root' })
export class UserLibraryService {
  private readonly productService = inject(ProductService);

  /** Productos que el usuario posee/activó, con su progreso. */
  readonly ownedProducts = computed<OwnedProduct[]>(() =>
    this.productService
      .products()
      .filter((p) => p.id in MOCK_PROGRESS)
      .map((p) => this.toOwnedProduct(p, MOCK_PROGRESS[p.id]))
  );

  readonly hasProducts = computed(() => this.ownedProducts().length > 0);

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
