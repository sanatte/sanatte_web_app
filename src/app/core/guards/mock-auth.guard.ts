import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MockAuthService } from '../services/mock-auth.service';

/** Exige sesión activa; redirige a /auth/login si no. */
export const mockAuthGuard: CanActivateFn = () => {
  const auth = inject(MockAuthService);
  const router = inject(Router);
  return auth.isAuthenticated() ? true : router.createUrlTree(['/auth/login']);
};
