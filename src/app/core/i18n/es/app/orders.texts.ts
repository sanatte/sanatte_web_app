import type { ProductType } from '../../../../features/administration/models/product.model';

export const APP_ORDERS_TEXTS = {
  orderNumber: (orderNumber: string) => `Pedido ${orderNumber}`,
  list: {
    title: 'Historial de Pedidos',
    description: 'Revisa el estado de tus compras y accede a tus productos de bienestar.',
    searchPlaceholder: 'Buscar por ID o producto...',
    filters: {
      all: 'Todos',
      in_progress: 'En proceso',
      shipped: 'Enviado',
      delivered: 'Entregado',
      active: 'Activo',
    },
    showing: (shown: number, total: number) =>
      `Mostrando ${shown} de ${total} pedido${total !== 1 ? 's' : ''}`,
    empty: {
      noOrdersTitle: 'Aún no tienes pedidos',
      noOrdersDescription: 'Cuando realices una compra aparecerá aquí tu historial.',
      noResultsTitle: 'Sin resultados',
      noResultsDescription: 'Prueba con otro término o filtro de búsqueda.',
    },
  },
  card: {
    status: 'Estado',
    total: 'Total',
    viewDetail: 'Ver Detalle',
  },
  detail: {
    breadcrumb: 'Mis Pedidos',
    title: (orderNumber: string) => `Detalle del Pedido ${orderNumber}`,
    placedOn: (date: string, time: string) => `Realizado el ${date} · ${time}`,
    pendingActivation: {
      title: 'Este producto está pendiente de activación',
      description: 'Escanea el QR de tu producto o ingresa el código para desbloquear los recursos digitales.',
      cta: 'Activar ahora',
    },
    tracker: {
      shippingTitle: 'Estado del envío',
      orderTitle: 'Estado del pedido',
      steps: {
        confirmed: 'Confirmado',
        processing: 'Procesando',
        onTheWay: 'En camino',
        delivered: 'Entregado',
        paymentConfirmed: 'Pago confirmado',
        subscriptionActive: 'Suscripción activa',
        accessActive: 'Acceso activo',
      },
    },
    cancelled: 'Este pedido fue cancelado.',
    items: {
      title: 'Artículos en tu pedido',
      productTypes: {
        physical: 'Producto físico',
        digital: 'Producto digital',
        subscription: 'Suscripción',
      } satisfies Record<ProductType, string>,
      quantity: (quantity: number) => `Cantidad: ${quantity}`,
      included: 'Incluido',
      includedWith: (productName: string) => `Incluido con ${productName}`,
      accessNow: 'Acceder ahora',
    },
    shipping: {
      title: 'Envío',
      carrier: 'Transportadora',
      trackingNumber: 'Guía',
      track: 'Rastrear envío',
      preparing: 'Tu pedido se está preparando. Te compartiremos la guía de rastreo al despacharlo.',
    },
    payment: {
      title: 'Resumen de pago',
      subtotal: 'Subtotal',
      shipping: 'Envío',
      free: 'Gratis',
      taxes: 'Impuestos',
      total: 'Total',
      downloadInvoice: 'Descargar factura',
    },
    support: {
      title: '¿Necesitas ayuda?',
      description: 'Si tienes dudas sobre este pedido, nuestro equipo está aquí.',
      contact: 'Contactar soporte',
    },
    notFound: 'Pedido no encontrado',
    back: 'Volver a mis pedidos',
  },
} as const;
