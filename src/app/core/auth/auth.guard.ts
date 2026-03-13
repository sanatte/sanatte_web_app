import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/** Wait for Firebase auth to finish loading */
function waitForAuth(authService: AuthService): Promise<void> {
  return new Promise((resolve) => {
    if (!authService.loading()) {
      resolve();
      return;
    }
    const interval = setInterval(() => {
      if (!authService.loading()) {
        clearInterval(interval);
        resolve();
      }
    }, 50);
  });
}

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  await waitForAuth(authService);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};

/** Redirect authenticated users away from login */
export const guestGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  await waitForAuth(authService);

  if (!authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};
