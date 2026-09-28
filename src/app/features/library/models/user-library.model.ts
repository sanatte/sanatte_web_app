import { Product } from '../../administration/models/product.model';

export interface OwnedProduct {
  product: Product;
  categoryLabel: string;
  categoryTone: 'primary' | 'secondary';
}
