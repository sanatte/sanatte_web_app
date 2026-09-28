export const MOOD_TRACKING_TEXTS = {
  page: {
    title: 'Tracking Emocional',
    description: 'Historial de emociones registradas por los usuarios en su check-in diario de bienestar.',
    loadError: 'No se pudo cargar el tracking de emociones.',
  },
  filters: {
    periods: {
      '7d': 'Última semana',
      '30d': 'Último mes',
      '90d': 'Últimos 3 meses',
    },
    allMoods: 'Todas las emociones',
  },
  charts: {
    frequency: 'Frecuencia por emoción',
    distribution: 'Distribución emocional',
  },
  empty: {
    title: 'Sin registros',
    description: 'No hay emociones registradas en este período.',
  },
  table: {
    columns: {
      user: 'Usuario',
      mood: 'Emoción',
      note: 'Nota',
      date: 'Fecha',
      view: 'Ver',
    },
    viewHistory: 'Ver historial del usuario',
  },
  pagination: {
    summary: (page: number, totalPages: number, total: number) =>
      `Página ${page} de ${totalPages} — ${total} registros`,
    previous: 'Anterior',
    next: 'Siguiente',
  },
} as const;
