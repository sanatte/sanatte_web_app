import type { BillingPeriod } from '../../../../features/administration/models/product.model';

export const APP_SUBSCRIPTIONS_TEXTS = {
  list: {
    title: 'Mi Suscripción',
    description: 'Gestiona tu plan, método de pago y facturación.',
    currentPlan: 'Plan actual',
    cancelsOn: (date: string) => `Se cancela el ${date}`,
    active: 'Activa',
    resourcesIncluded: 'Recursos incluidos',
    memberSince: 'Miembro desde',
    accessUntil: 'Acceso hasta',
    nextInvoice: 'Próxima factura',
    reactivate: 'Reactivar suscripción',
    cancel: 'Cancelar suscripción',
    noActive: {
      title: 'No tienes una suscripción activa',
      description: 'Elige un plan para acceder a la biblioteca completa de recursos de bienestar.',
    },
    paymentMethod: {
      title: 'Método de pago',
      expires: (expiry: string) => `Vence ${expiry}`,
      update: 'Actualizar',
      secure: 'Pagos procesados de forma segura (se integrará con Mercado Pago).',
    },
    billing: {
      title: 'Facturación',
      downloadInvoice: 'Descargar factura',
    },
    plans: {
      title: 'Planes disponibles',
      yourPlan: 'Tu plan',
      current: 'Plan actual',
      switchTo: 'Cambiar a este plan',
    },
    periods: {
      monthly: '/mes',
      annual: '/año',
    } satisfies Record<BillingPeriod, string>,
    cancelDialog: {
      title: '¿Cancelar tu suscripción?',
      message:
        'Mantendrás el acceso hasta el final del periodo ya pagado. Después perderás el acceso a los recursos del plan.',
      confirm: 'Sí, cancelar',
      cancel: 'Conservar plan',
    },
  },
  detail: {
    title: 'Detalle de Suscripción',
    comingSoon: 'Próximamente — pendiente de mockup.',
  },
} as const;
