export const PUBLIC_HOME_TEXTS = {
  hero: {
    badge: 'Bienestar en papel + digital',
    tagline:
      'Un planeador emocional que transforma la prisa en presencia y la culpa en poder. Tu mejor amiga en papel, con recursos digitales que despiertas por QR.',
    scanAndAccess: 'Escanea y accede',
    learnMore: 'Conocer Plena',
    addToCart: 'Agregar al carrito',
    unlockChip: 'Desbloquea recursos digitales',
  },
  resources: {
    title: 'Una agenda que cobra vida',
    description:
      'Cada Plena trae códigos QR que desbloquean recursos digitales exclusivos para acompañar tu práctica.',
  },
  howItWorks: {
    title: 'Cómo funciona',
    description: 'Tu producto físico se conecta con el mundo digital de forma simple y segura.',
    steps: {
      buy: { title: 'Compra', desc: 'Recibe tu agenda Plena con sus códigos QR.' },
      activate: { title: 'Activa', desc: 'Escanea el QR e ingresa con tu cuenta.' },
      access: { title: 'Accede', desc: 'Desbloquea los recursos digitales en tu biblioteca.' },
    },
  },
  more: {
    title: 'Descubre más',
    viewCatalog: 'Ver catálogo',
  },
  cta: {
    title: 'Comienza tu camino al bienestar',
    description: 'Crea tu cuenta para activar tu Plena y acceder a tus recursos desde cualquier lugar.',
    createAccount: 'Crear mi cuenta',
  },
  addedToCart: (name: string) => `"${name}" agregado al carrito`,
} as const;
