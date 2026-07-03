import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Exige rol ADMIN; redirige a /app si el usuario es USER. */
export const adminGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.whenReady();
  if (auth.isAdmin()) return true;
  if (auth.isAuthenticated()) return router.createUrlTree(['/app']);
  return router.createUrlTree(['/auth/login']);
};
