import { Product } from '../../administration/models/product.model';

/**
 * Modelo de la Biblioteca del usuario (vista cliente): los productos que posee.
 * El "progreso"/gamificación se agregará cuando exista tracking real de consumo.
 */
export interface OwnedProduct {
  product: Product;
  categoryLabel: string;    // "Agenda" · "Ebook" · "Audio" · "Curso"…
  categoryTone: 'primary' | 'secondary';
}
