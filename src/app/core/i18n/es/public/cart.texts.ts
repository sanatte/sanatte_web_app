import type { ProductType } from '../../../../features/administration/models/product.model';

export const PUBLIC_CART_TEXTS = {
  title: 'Tu carrito de compras',
  description: 'Revisa tu selección de bienestar.',
  types: {
    physical: 'Producto físico',
    digital: 'Producto digital',
    subscription: 'Suscripción',
  } satisfies Record<ProductType, string>,
  remove: 'Eliminar',
  addMore: 'Agregar más productos',
  summary: {
    title: 'Resumen del pedido',
    subtotal: 'Subtotal',
    shipping: 'Envío',
    free: 'Gratis',
    taxIncluded: 'IVA incluido',
    total: 'Total',
    proceed: 'Proceder al pago',
    secure: 'Pago seguro · requiere iniciar sesión',
    freeReturns: 'Devoluciones gratis en productos físicos dentro de 30 días.',
  },
  empty: {
    title: 'Tu carrito está vacío',
    description: 'Explora el catálogo y agrega productos de bienestar a tu carrito.',
    viewCatalog: 'Ver catálogo',
  },
} as const;
