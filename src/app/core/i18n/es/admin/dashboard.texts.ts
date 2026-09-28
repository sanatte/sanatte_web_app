import type { OrderStatus } from '../../../../features/administration/models/dashboard-order.model';

export const DASHBOARD_TEXTS = {
  kpis: {
    sales: 'Total Ventas',
    users: 'Usuarios Activos',
    activations: 'Activaciones',
    subscriptions: 'Suscripciones Activas',
  },
  recentOrders: {
    title: 'Pedidos Recientes',
    subtitle: (count: number) => `Últimas ${count} transacciones.`,
    filter: 'Filtrar',
    loadMore: 'Cargar más transacciones',
    columns: {
      orderId: 'Order ID',
      customer: 'Cliente',
      amount: 'Monto',
      status: 'Estado',
      action: 'Acción',
    },
    statuses: {
      paid: 'Pagado',
      pending: 'Pendiente',
      shipped: 'Enviado',
      cancelled: 'Cancelado',
    } satisfies Record<OrderStatus, string>,
  },
} as const;
