import type { ActivationStatus } from '../../../../features/administration/models/activation.model';

export const ACTIVATIONS_TEXTS = {
  page: {
    breadcrumbSection: 'Admin',
    breadcrumbCurrent: 'Activaciones',
    title: 'Gestión de Activaciones',
    description: 'Control de licencias físicas y vinculación de códigos QR.',
    kpis: {
      total: 'Total activas',
      pending: 'Pendientes',
    },
    searchPlaceholder: 'Buscar por código, producto o email...',
    statusFilter: {
      all: 'Estado: Todos',
      success: 'Exitosas',
      pending: 'En proceso',
      failed: 'Fallidas',
    } satisfies Record<'all' | ActivationStatus, string>,
    last30Days: 'Últimos 30 días',
    exportCsv: 'Exportar CSV',
    revokeTitle: 'Revocar activación',
    revokeMessage: (code: string) =>
      `¿Revocar la activación de ${code}? El usuario perderá acceso a los recursos desbloqueados.`,
    revokeConfirm: 'Sí, revocar',
  },
  table: {
    columns: {
      code: 'Código',
      user: 'Usuario',
      product: 'Producto',
      date: 'Fecha',
      status: 'Estado',
      device: 'Dispositivo',
      actions: 'Acciones',
    },
    resourcesUnlocked: (count: number) => `${count} recurso${count !== 1 ? 's' : ''}`,
    timeSuffix: 'h',
    anonymous: 'Anónimo',
    viewDetail: 'Ver detalle',
    revoke: 'Revocar activación',
    empty: 'No se encontraron activaciones',
    paginationLabel: 'activaciones',
    statuses: {
      success: 'Exitosa',
      pending: 'En proceso',
      failed: 'Fallida',
    } satisfies Record<ActivationStatus, string>,
  },
  card: {
    welcome: (productName: string) => `¡Bienvenida a ${productName}!`,
    tagline: 'Tu viaje comienza aquí.',
    logoAlt: 'Sanatte Wellness Ecosystem',
    isotipoAlt: 'Flor Sanatte',
    qrAlt: 'QR de activación',
    defaultPhrase: 'Cada paso hacia\ntu bienestar\ncuenta.',
    tabs: {
      audios: 'Audios guiados',
      exercises: 'Ejercicios',
      resources: 'Recursos digitales',
      wellbeing: 'Bienestar diario',
    },
  },
} as const;
