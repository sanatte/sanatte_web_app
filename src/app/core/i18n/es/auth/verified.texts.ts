export const AUTH_VERIFIED_TEXTS = {
  success: {
    title: '¡Correo verificado!',
    message: 'Tu cuenta fue activada correctamente. Ya puedes comenzar tu camino al bienestar.',
    cta: 'Ir a mi biblioteca',
  },
  invalid: {
    title: 'Enlace no válido',
    message: 'El enlace de verificación expiró o ya fue usado. Inicia sesión o solicita uno nuevo.',
    cta: 'Ir al inicio de sesión',
  },
} as const;
