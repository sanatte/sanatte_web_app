import type { ProductType } from '../../../../features/administration/models/product.model';

export const PUBLIC_CATALOG_TEXTS = {
  title: 'Catálogo Sanatte',
  description: 'Productos físicos, recursos digitales y suscripciones para tu bienestar.',
  searchPlaceholder: 'Buscar productos...',
  filters: {
    all: 'Todos',
    physical: 'Físicos',
    digital: 'Digitales',
    subscription: 'Suscripciones',
  } satisfies Record<'all' | ProductType, string>,
  noResults: 'Sin resultados para tu búsqueda.',
  addedToCart: (name: string) => `"${name}" agregado al carrito`,
  productCard: {
    types: {
      physical: 'Físico',
      digital: 'Digital',
      subscription: 'Suscripción',
    } satisfies Record<ProductType, string>,
    perYear: '/año',
    perMonth: '/mes',
    addToCart: 'Agregar al carrito',
  },
} as const;
