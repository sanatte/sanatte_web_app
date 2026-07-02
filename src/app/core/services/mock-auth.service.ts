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
        displayName: this.prettyName(email),
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
      const user = JSON.parse(stored) as User;
      // Normaliza nombres genéricos de sesiones previas (p. ej. "admin").
      return { ...user, displayName: this.prettyName(user.email, user.displayName) };
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }

  /**
   * Genera un nombre legible a partir del email. Si la parte local es genérica
   * (admin, user, test…) usa un nombre real por defecto. Mock only.
   */
  private prettyName(email: string, current?: string): string {
    const local = (email?.split('@')[0] ?? '').trim();
    const generic = ['admin', 'user', 'usuario', 'test', 'demo', 'hola', 'root', 'sanatte'];
    if (current && !generic.includes(current.toLowerCase()) && current !== local) {
      return current; // conserva un nombre ya personalizado
    }
    if (!local || generic.includes(local.toLowerCase())) return 'María';
    return local.charAt(0).toUpperCase() + local.slice(1);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
