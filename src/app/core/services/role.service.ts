import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MockAuthService } from './mock-auth.service';
import { UserRole } from '../models/role.model';

/**
 * Utilidad de desarrollo: cambia el rol del usuario en caliente
 * para probar ambos flujos sin hacer logout/login.
 * No incluir en builds de producción (usar con isDevMode() si es necesario).
 */
@Injectable({ providedIn: 'root' })
export class RoleService {
  private readonly auth = inject(MockAuthService);
  private readonly router = inject(Router);

  switchToAdmin(): void {
    this.auth.switchRole(UserRole.Admin);
    this.router.navigate(['/admin/dashboard']);
  }

  switchToUser(): void {
    this.auth.switchRole(UserRole.User);
    this.router.navigate(['/app/library']);
  }

  current() {
    return this.auth.role();
  }
}
