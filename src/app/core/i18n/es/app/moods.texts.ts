const entriesLabel = (count: number | null) => (count === 1 ? 'registro' : 'registros');

export const APP_MOODS_TEXTS = {
  history: {
    title: 'Mis emociones',
    periodsAriaLabel: 'Periodo',
    periods: {
      week: 'Semana',
      month: 'Mes',
      quarter: '3 meses',
    },
    subtitles: {
      week: 'Así te has sentido durante los últimos 7 días.',
      month: 'Así te has sentido durante los últimos 30 días.',
      quarter: 'Así te has sentido durante los últimos 3 meses.',
    },
    retry: 'Reintentar',
    summary: {
      title: 'Tu estado de ánimo',
      entriesInDays: (count: number, days: number) => `${count} ${entriesLabel(count)} en ${days} días`,
      mostFrequent: 'Más frecuente',
      noRecord: 'Sin registro',
      frequencyTitle: 'Frecuencia por emoción',
      chartAriaLabel: 'Frecuencia de emociones en el periodo',
      chartTooltip: (count: number | null) => `${count} ${entriesLabel(count)}`,
      empty: 'Aún no tienes emociones registradas en este periodo.',
    },
    entries: {
      title: 'Registros',
      count: (count: number) => `${count} ${entriesLabel(count)}`,
      all: 'Todas',
      emptyTitle: 'Sin registros',
      emptyFiltered: (moodName: string) => `No registraste "${moodName}" en este periodo.`,
      emptyDefault: 'Registra tu emoción del día desde la app para ver tu historial.',
      noNote: 'Sin nota',
      paginationLabel: 'registros',
    },
  },
  errors: {
    history: 'No se pudo cargar tu historial de emociones.',
    summary: 'No se pudo cargar el resumen de tus emociones.',
  },
} as const;
