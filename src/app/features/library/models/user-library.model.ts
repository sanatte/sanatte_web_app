import { Product } from '../../administration/models/product.model';

/**
 * Modelos de la Biblioteca del usuario (vista cliente).
 *
 * El "progreso" es una capa de gamificación sobre el ecommerce core.
 * Hoy es mock; en fase backend se calculará desde el consumo real de recursos
 * (eventos de reproducción/lectura por entitlement).
 */
export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';

export interface OwnedProduct {
  product: Product;
  progress: number;         // 0–100
  status: ProgressStatus;
  categoryLabel: string;    // "Agenda" · "Ebook" · "Audio" · "Curso"…
  categoryTone: 'primary' | 'secondary';
}

export interface DailyFocus {
  badge: string;            // "Enfoque del día"
  title: string;
  description: string;
  durationMinutes: number;
  gradient: string;         // tailwind gradient classes
  resourceId?: string;
}

export interface WeeklyProgress {
  percentage: number;
  daysCompleted: number;
  daysTotal: number;
  quote: string;
}
