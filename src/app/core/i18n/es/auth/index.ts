import { AUTH_AUTH_ACTION_TEXTS } from './auth-action.texts';
import { AUTH_ERRORS_TEXTS } from './errors.texts';
import { AUTH_FORGOT_PASSWORD_TEXTS } from './forgot-password.texts';
import { AUTH_LOGIN_TEXTS } from './login.texts';
import { AUTH_REGISTER_TEXTS } from './register.texts';
import { AUTH_RESET_PASSWORD_TEXTS } from './reset-password.texts';
import { AUTH_SHELL_TEXTS } from './shell.texts';
import { AUTH_VERIFIED_TEXTS } from './verified.texts';
import { AUTH_VERIFY_EMAIL_TEXTS } from './verify-email.texts';

export const AUTH_TEXTS = {
  shell: AUTH_SHELL_TEXTS,
  login: AUTH_LOGIN_TEXTS,
  register: AUTH_REGISTER_TEXTS,
  forgotPassword: AUTH_FORGOT_PASSWORD_TEXTS,
  resetPassword: AUTH_RESET_PASSWORD_TEXTS,
  verifyEmail: AUTH_VERIFY_EMAIL_TEXTS,
  verified: AUTH_VERIFIED_TEXTS,
  authAction: AUTH_AUTH_ACTION_TEXTS,
  errors: AUTH_ERRORS_TEXTS,
} as const;
