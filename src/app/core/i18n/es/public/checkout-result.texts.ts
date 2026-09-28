export const PUBLIC_CHECKOUT_RESULT_TEXTS = {
  checking: 'Confirmando tu pago…',
  success: {
    title: '¡Pago confirmado!',
    thanks: 'Gracias por tu compra.',
    order: (orderNumber: string) => `Pedido ${orderNumber}`,
    viewOrders: 'Ver mis pedidos',
    goToLibrary: 'Ir a mi biblioteca',
  },
  pending: {
    title: 'Pago en proceso',
    description:
      'Tu pago está siendo procesado (ej. Efecty/PSE). Te avisaremos cuando se acredite; lo verás en "Mis pedidos".',
    viewOrders: 'Ver mis pedidos',
  },
  failure: {
    title: 'El pago no se completó',
    description: 'No se realizó ningún cargo. Puedes intentarlo de nuevo.',
    backToCheckout: 'Volver al checkout',
  },
} as const;
