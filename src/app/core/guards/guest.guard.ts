import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/role.model';

/** Solo permite acceso a usuarios NO autenticados (ej: login, register). */
export const guestGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.whenReady();
  if (!auth.isAuthenticated()) return true;
  const target = auth.role() === UserRole.Admin ? '/admin/dashboard' : '/app/library';
  return router.createUrlTree([target]);
};
