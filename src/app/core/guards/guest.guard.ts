import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MockAuthService } from '../services/mock-auth.service';
import { UserRole } from '../models/role.model';

/** Solo permite acceso a usuarios NO autenticados (ej: login, register). */
export const guestGuard: CanActivateFn = () => {
  const auth = inject(MockAuthService);
  const router = inject(Router);
  if (!auth.isAuthenticated()) return true;
  const target = auth.role() === UserRole.Admin ? '/admin/dashboard' : '/app/library';
  return router.createUrlTree([target]);
};
