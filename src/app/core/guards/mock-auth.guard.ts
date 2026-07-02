import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MockAuthService } from '../services/mock-auth.service';

/** Exige sesión activa; redirige a /auth/login (preservando returnUrl) si no. */
export const mockAuthGuard: CanActivateFn = (_route, state) => {
  const auth = inject(MockAuthService);
  const router = inject(Router);
  return auth.isAuthenticated()
    ? true
    : router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });
};
