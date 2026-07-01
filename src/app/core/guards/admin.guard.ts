import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MockAuthService } from '../services/mock-auth.service';

/** Exige rol ADMIN; redirige a /app si el usuario es USER. */
export const adminGuard: CanActivateFn = () => {
  const auth = inject(MockAuthService);
  const router = inject(Router);
  if (auth.isAdmin()) return true;
  if (auth.isAuthenticated()) return router.createUrlTree(['/app']);
  return router.createUrlTree(['/auth/login']);
};
