export const APP_PROFILE_TEXTS = {
  seed: {
    fullName: 'Usuario Sanatte',
    email: 'usuario@sanatte.com',
  },
  header: {
    changeAvatar: 'Cambiar foto de perfil',
    avatarAlt: 'Avatar',
    initialFallback: 'U',
  },
  avatar: {
    tooLarge: 'El archivo supera 3 MB.',
    uploadFailed: 'No se pudo subir el avatar. Inténtalo de nuevo.',
  },
  personal: {
    title: 'Datos personales',
    fullName: 'Nombre completo',
    email: 'Correo electrónico',
    dateOfBirth: 'Fecha de nacimiento',
    location: 'Ubicación',
    locationPlaceholder: 'Ciudad, País',
    saved: 'Cambios guardados',
    save: 'Guardar cambios',
  },
  security: {
    title: 'Seguridad',
    passwordTitle: 'Contraseña y acceso',
    passwordText: 'Actualiza tu contraseña con regularidad para mantener segura tu cuenta.',
    changePassword: 'Cambiar contraseña',
    enable2fa: 'Activar 2FA',
    note: 'Estas opciones se conectarán al iniciar la autenticación con Firebase.',
  },
  email: {
    title: 'Preferencias de correo',
    newsletterTitle: 'Newsletter Sanatte',
    newsletterText: 'Tips de bienestar, contenido nuevo y novedades. Puedes darte de baja cuando quieras.',
    note: 'Los correos de tu cuenta y pedidos (transaccionales) siempre se envían.',
  },
  data: {
    title: 'Gestiona tus datos',
    description: 'Descarga tu historial de bienestar o gestiona la visibilidad de tu cuenta.',
    export: 'Exportar mis datos',
    deleteAccount: 'Eliminar cuenta',
  },
  logout: 'Cerrar sesión',
  settings: {
    title: 'Configuración',
    comingSoon: 'Próximamente — pendiente de mockup.',
  },
} as const;
