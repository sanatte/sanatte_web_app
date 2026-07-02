import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { UserRole } from '../models/role.model';

const STORAGE_KEY = 'sanatte_user';
const PENDING_KEY = 'sanatte_pending_user';
const MOCK_DELAY = 600;

/**
 * Autenticación simulada (fase Mock).
 *
 * Métodos mapeados 1:1 a Firebase Auth (ver tabla en el plan):
 *   login → signInWithEmailAndPassword · register → createUserWithEmailAndPassword
 *   signInWithGoogle → signInWithPopup(GoogleAuthProvider)
 *   sendPasswordReset → sendPasswordResetEmail · resetPassword → confirmPasswordReset
 *   sendEmailVerification / confirmEmailVerification → sendEmailVerification / applyActionCode
 *
 * Regla de negocio: el correo es la llave de los recursos. El registro por
 * email/contraseña exige verificación ANTES de acceder (usuario "pendiente" que
 * no tiene sesión activa hasta verificar). Google entra ya verificado.
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
  readonly emailVerified = computed(() => this._currentUser()?.emailVerified ?? false);

  /** Inicio de sesión con email/contraseña. Heurística mock: admin@… → ADMIN. */
  async login(email: string, _password: string): Promise<void> {
    this._loading.set(true);
    try {
      await this.delay(MOCK_DELAY);
      const role = email.trim().toLowerCase().startsWith('admin@') ? UserRole.Admin : UserRole.User;
      this.persist({
        uid: `mock-uid-${role.toLowerCase()}`,
        email,
        displayName: this.prettyName(email),
        role,
        emailVerified: true, // quien ya tiene cuenta se asume verificado
      });
    } finally {
      this._loading.set(false);
    }
  }

  /**
   * Registro con email/contraseña → crea un usuario PENDIENTE (sin sesión activa)
   * y "envía" el correo de verificación. No accede hasta verificar.
   */
  async register(name: string, email: string, _password: string): Promise<void> {
    this._loading.set(true);
    try {
      await this.delay(MOCK_DELAY);
      const pending: User = {
        uid: `mock-uid-${Date.now()}`,
        email,
        displayName: name.trim() || this.prettyName(email),
        role: UserRole.User,
        emailVerified: false,
      };
      localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
    } finally {
      this._loading.set(false);
    }
  }

  /** Inicio/registro con Google → entra ya verificado (Google verifica el correo). */
  async signInWithGoogle(): Promise<void> {
    this._loading.set(true);
    try {
      await this.delay(MOCK_DELAY);
      this.persist({
        uid: 'mock-uid-google',
        email: 'usuario@gmail.com',
        displayName: 'Usuario Google',
        role: UserRole.User,
        emailVerified: true,
      });
    } finally {
      this._loading.set(false);
    }
  }

  /** Email del registro pendiente de verificación (para la pantalla "verifica tu correo"). */
  pendingEmail(): string | null {
    const p = this.restorePending();
    return p?.email ?? null;
  }

  /** Simula reenviar el correo de verificación. */
  async sendEmailVerification(): Promise<void> {
    await this.delay(MOCK_DELAY);
  }

  /**
   * Confirma la verificación (mock: equivale a hacer clic en el enlace del correo).
   * Promueve el usuario pendiente a sesión activa y verificada.
   */
  async confirmEmailVerification(): Promise<boolean> {
    const pending = this.restorePending();
    if (!pending) {
      // Si ya hay sesión, solo marca verificado.
      const u = this._currentUser();
      if (u) { this.persist({ ...u, emailVerified: true }); return true; }
      return false;
    }
    this.persist({ ...pending, emailVerified: true });
    localStorage.removeItem(PENDING_KEY);
    return true;
  }

  /** Solicita enlace de recuperación (mock). */
  async sendPasswordReset(_email: string): Promise<void> {
    await this.delay(MOCK_DELAY);
  }

  /** Restablece la contraseña (mock). */
  async resetPassword(_code: string, _newPassword: string): Promise<void> {
    await this.delay(MOCK_DELAY);
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
      return {
        ...user,
        emailVerified: user.emailVerified ?? true,
        displayName: this.prettyName(user.email, user.displayName),
      };
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }

  private restorePending(): User | null {
    const stored = localStorage.getItem(PENDING_KEY);
    if (!stored) return null;
    try { return JSON.parse(stored) as User; } catch { return null; }
  }

  /**
   * Genera un nombre legible a partir del email. Si la parte local es genérica
   * (admin, user, test…) usa un nombre real por defecto. Mock only.
   */
  private prettyName(email: string, current?: string): string {
    const local = (email?.split('@')[0] ?? '').trim();
    const generic = ['admin', 'user', 'usuario', 'test', 'demo', 'hola', 'root', 'sanatte'];
    if (current && !generic.includes(current.toLowerCase()) && current !== local) {
      return current;
    }
    if (!local || generic.includes(local.toLowerCase())) return 'María';
    return local.charAt(0).toUpperCase() + local.slice(1);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
