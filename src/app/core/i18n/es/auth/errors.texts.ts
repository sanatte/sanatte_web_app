export const AUTH_ERRORS_TEXTS = {
  backendUnreachable: 'No pudimos conectar con el servidor. Intenta más tarde.',
  register: {
    codes: {
      'auth/email-already-in-use': 'El correo ya está registrado. Inicia sesión.',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
      'auth/invalid-email': 'El correo no es válido.',
    } as Readonly<Record<string, string>>,
    fallback: 'No se pudo crear la cuenta. Intenta de nuevo.',
  },
  resetPassword: {
    codes: {
      'auth/expired-action-code': 'El enlace expiró o ya fue usado. Solicita uno nuevo.',
      'auth/invalid-action-code': 'El enlace expiró o ya fue usado. Solicita uno nuevo.',
    } as Readonly<Record<string, string>>,
    fallback: 'No se pudo restablecer la contraseña. Intenta de nuevo.',
  },
} as const;
