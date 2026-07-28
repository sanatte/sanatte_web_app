import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Protege el shell de cliente (/app): si el usuario es ADMIN lo envía al panel
 * (/admin). Los usuarios normales pasan. Debe ir DESPUÉS de mockAuthGuard, que
 * ya garantiza que hay sesión (si no, redirige a login).
 */
export const clientShellGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.whenReady();
  if (auth.isAdmin()) return router.createUrlTree(['/admin']);
  return true;
};
