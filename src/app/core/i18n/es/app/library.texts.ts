export const APP_LIBRARY_TEXTS = {
  home: {
    greeting: 'Hola,',
    fallbackName: 'Bienvenido',
    subtitle: 'Qué alegría tenerte de vuelta. Aquí están tus productos y recursos de bienestar.',
    myProducts: 'Mis Productos',
    activateProduct: 'Activar producto',
    empty: {
      title: 'Tu biblioteca está lista para comenzar',
      description:
        'Activa un producto físico escaneando su código QR, o explora el catálogo para descubrir recursos de bienestar.',
      browseCatalog: 'Ver catálogo',
    },
  },
  card: {
    open: 'Abrir',
  },
  categories: {
    subscription: 'Suscripción',
    physical: 'Agenda',
    ebook: 'Ebook',
    course: 'Curso',
    audio: 'Audio',
    digital: 'Digital',
  },
  viewer: {
    back: 'Volver a la biblioteca',
    save: 'Guardar',
    playlistTitle: 'Contenido del producto',
    resourcesIncluded: (count: number) =>
      `${count} recurso${count !== 1 ? 's' : ''} incluido${count !== 1 ? 's' : ''}`,
    viewLibrary: 'Ver mi biblioteca',
    empty: {
      title: (productName: string) => `El contenido de ${productName} está en camino`,
      description:
        'Aún no hay recursos digitales disponibles para este producto. Te avisaremos cuando estén listos para explorar.',
    },
    notFound: 'Producto no encontrado',
  },
} as const;
