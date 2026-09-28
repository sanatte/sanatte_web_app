export const SHARED_RESOURCE_VIEWERS_TEXTS = {
  article: {
    badge: 'Artículo',
    readTime: (readTime: string) => `${readTime} de lectura`,
    empty: 'Este artículo aún no tiene contenido.',
  },
  audio: {
    defaultCollection: 'Sanatte Audio',
  },
  media: {
    loading: 'Preparando el reproductor…',
    notReady: 'Este contenido se está preparando. Vuelve pronto.',
    error: 'No se pudo cargar el contenido. Intenta de nuevo.',
  },
  pdf: {
    frameTitle: 'Vista previa del documento',
    fullscreen: 'Pantalla completa',
  },
  waveAudio: {
    generating: 'Generando onda…',
    error: 'No se pudo cargar el audio.',
  },
} as const;
