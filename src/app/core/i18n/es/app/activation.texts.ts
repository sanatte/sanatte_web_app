export const APP_ACTIVATION_TEXTS = {
  fallbackProductName: 'Producto',
  success: {
    badge: 'Activación exitosa',
    titlePrefix: '¡Tu experiencia',
    titleSuffix: 'ha comenzado!',
    unlockedPrefix: 'Tu producto fue validado correctamente. Desbloqueaste',
    unlockedResources: (count: number) => (count !== 1 ? 'recursos digitales' : 'recurso digital'),
    exploreResources: 'Explorar los recursos',
    goToLibrary: 'Ir a mi biblioteca',
    needHelp: '¿Necesitas ayuda?',
    contactSupport: 'Contactar soporte',
  },
  form: {
    badge: 'Activación',
    title: 'Activa tu experiencia física',
    description:
      'Conecta tu producto físico con nuestro ecosistema digital para desbloquear meditaciones guiadas, seguimiento de hábitos y contenido exclusivo.',
    benefits: {
      resourcesTitle: 'Recursos exclusivos',
      resourcesText: 'Acceso a la biblioteca premium del producto.',
      syncTitle: 'Sincronización digital',
      syncText: 'Registra tus avances y digitaliza tus reflexiones.',
    },
    cardTitle: 'Verificar código',
    cardHint: 'Si el escaneo automático no funcionó, ingresa el código que aparece debajo del QR de tu producto.',
    codeLabel: 'Código de producto',
    codePlaceholder: 'EJ. SN-B2-0051',
    verify: 'Verificar código',
    verifying: 'Verificando…',
    whereIsCode: '¿Dónde encuentro mi código?',
  },
  landing: {
    logoAlt: 'Sanatte',
    wordmarkAlt: 'Sanatte Wellness Ecosystem',
    titleLine1: '¡Tu producto está',
    titleLine2: 'listo para activar!',
    description:
      'Crea tu cuenta o inicia sesión para acceder a tu biblioteca digital de meditaciones, ejercicios y recursos de bienestar.',
    register: 'Crear cuenta gratuita',
    login: 'Ya tengo cuenta',
    divider: 'o activa desde la app',
    appStore: {
      caption: 'Descargar en',
      name: 'App Store',
    },
    googlePlay: {
      caption: 'Disponible en',
      name: 'Google Play',
    },
    footer: 'sanatte.com',
  },
  redirect: {
    preparing: 'Preparando la activación…',
  },
} as const;
