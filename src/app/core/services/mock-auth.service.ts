import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { UserRole } from '../models/role.model';

const STORAGE_KEY = 'sanatte_user';
const MOCK_DELAY = 600;

/**
 * Autenticación simulada (fase Mock).
 *
 * Acepta cualquier credencial y crea un usuario con el rol indicado.
 * Para migrar: reemplazar el cuerpo de `login`/`getIdToken` por Firebase Auth
 * o por el AuthService HTTP de NestJS — la API pública (signals) no cambia.
 */
@Injectable({ providedIn: 'root' })
export class MockAuthService {
  private readonly router = inject(Router);

  private readonly _currentUser = signal<User | null>(this.restore());
  private readonly _loading = signal(false);

  readonly currentUser = this._currentUser.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);
  readonly role = computed<UserRole | null>(() => this._currentUser()?.role ?? null);
  readonly isAdmin = computed(() => this.role() === UserRole.Admin);

  async login(email: string, _password: string, role: UserRole = UserRole.Admin): Promise<void> {
    this._loading.set(true);
    try {
      await this.delay(MOCK_DELAY);
      const user: User = {
        uid: `mock-uid-${role.toLowerCase()}`,
        email,
        displayName: email.split('@')[0],
        role,
      };
      this.persist(user);
    } finally {
      this._loading.set(false);
    }
  }

  async logout(): Promise<void> {
    this._currentUser.set(null);
    localStorage.removeItem(STORAGE_KEY);
    await this.router.navigate(['/auth/login']);
  }

  /** Cambio de rol en caliente (solo desarrollo, para probar ambos flujos). */
  switchRole(role: UserRole): void {
    const user = this._currentUser();
    if (user) this.persist({ ...user, role });
  }

  /** Token simulado. Reemplazar por `firebase.auth().currentUser?.getIdToken()`. */
  async getIdToken(): Promise<string | null> {
    return this._currentUser() ? 'mock-firebase-id-token' : null;
  }

  private persist(user: User): void {
    this._currentUser.set(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }

  private restore(): User | null {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as User;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
