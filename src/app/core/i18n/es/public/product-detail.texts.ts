import type { ProductType } from '../../../../features/administration/models/product.model';

export const PUBLIC_PRODUCT_DETAIL_TEXTS = {
  breadcrumb: 'Productos',
  types: {
    physical: 'Producto físico',
    digital: 'Producto digital',
    subscription: 'Suscripción',
  } satisfies Record<ProductType, string>,
  perYear: '/año',
  perMonth: '/mes',
  addToCart: 'Agregar al carrito',
  buyNow: 'Comprar ahora',
  added: 'Agregado al carrito',
  guarantees: {
    shippingIncluded: 'Envío incluido',
    cancelAnytime: 'Cancela cuando quieras',
    lifetimeAccess: 'Acceso de por vida',
    qrActivation: 'Activación por QR',
  },
  specsTitle: 'Especificaciones técnicas',
  reviews: {
    title: 'Reseñas',
    count: (n: number) => `${n} reseñas`,
    write: 'Escribir reseña',
    mock: [
      {
        author: 'Fiona M.',
        initials: 'FM',
        rating: 5,
        text: 'La calidad del papel es increíble y el ritual de 90 días cambió mi mañana. La sincronización con la app es magia.',
      },
      {
        author: 'Julien L.',
        initials: 'JL',
        rating: 5,
        text: 'Integrar el QR con contenido de meditación se siente como el futuro del journaling.',
      },
      {
        author: 'Sarah A.',
        initials: 'SA',
        rating: 4,
        text: 'Lo compré como regalo para mi hermana y el empaque fue impecable. La atención al detalle se nota.',
      },
    ],
  },
  notFound: 'Producto no encontrado',
  viewCatalog: 'Ver catálogo',
} as const;
