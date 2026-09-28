export const AUTH_FORGOT_PASSWORD_TEXTS = {
  form: {
    title: 'Recuperar contraseña',
    subtitle: 'Ingresa tu correo para recibir un enlace de recuperación.',
    email: 'Correo electrónico',
    emailPlaceholder: 'ejemplo@sanatte.com',
    submit: 'Enviar enlace',
    submitting: 'Enviando…',
  },
  sent: {
    title: 'Revisa tu correo',
    messagePrefix: 'Si',
    messageSuffix: 'tiene una cuenta, recibirás un enlace para restablecer tu contraseña. Revisa también la carpeta de spam.',
    resend: '¿No te llegó? Reenviar',
    resending: 'Reenviando…',
  },
  backToLogin: 'Volver al inicio de sesión',
} as const;
