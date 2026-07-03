import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth, Auth, onAuthStateChanged,
  signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile,
  sendEmailVerification as fbSendEmailVerification,
  signInWithPopup, GoogleAuthProvider, OAuthProvider,
  sendPasswordResetEmail, confirmPasswordReset, signOut,
  User as FbUser,
} from 'firebase/auth';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';
import { UserRole } from '../models/role.model';

const PENDING_KEY = 'sanatte_pending_email';

interface ApiUser { id: string; email: string; displayName: string; role: number; emailVerified: boolean; }

/**
 * AuthService — autenticación real con Firebase Auth.
 *
 * El backend NO emite tokens: Firebase autentica y entrega el ID token (JWT),
 * que el interceptor adjunta como Bearer. El rol (User/Admin) NO viaja en el
 * token de Firebase: se obtiene de nuestro backend (`GET /api/users/me`), que
 * además crea la cuenta local la primera vez (get-or-create por FirebaseUid).
 *
 * Verificación de correo (flujo estricto): el registro deja al usuario en Firebase
 * pero SIN verificar; hasta que confirme el enlace, `currentUser` permanece null
 * (los guards lo mantienen fuera de la app) aunque exista sesión de Firebase para
 * poder reenviar el correo de verificación.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly auth: Auth;

  private readonly _currentUser = signal<User | null>(null);
  private readonly _loading = signal(false);

  readonly currentUser = this._currentUser.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);
  readonly role = computed<UserRole | null>(() => this._currentUser()?.role ?? null);
  readonly isAdmin = computed(() => this.role() === UserRole.Admin);
  readonly emailVerified = computed(() => this._currentUser()?.emailVerified ?? false);

  // Se resuelve tras el primer onAuthStateChanged (evita el race de los guards al recargar).
  private resolveReady!: () => void;
  private readonly readyPromise = new Promise<void>((res) => (this.resolveReady = res));

  constructor() {
    const app = getApps().length ? getApps()[0] : initializeApp(environment.firebase);
    this.auth = getAuth(app);

    onAuthStateChanged(this.auth, async (fbUser) => {
      if (fbUser && (fbUser.emailVerified || this.isFederated(fbUser))) {
        await this.hydrate(fbUser);
      } else {
        this._currentUser.set(null);
      }
      this.resolveReady();
    });
  }

  /** Espera a que Firebase restaure la sesión (usar en los guards). */
  whenReady(): Promise<void> { return this.readyPromise; }

  // ─── Acciones ───────────────────────────────────────────────────────────────

  async login(email: string, password: string): Promise<void> {
    this._loading.set(true);
    try {
      const cred = await signInWithEmailAndPassword(this.auth, email, password);
      if (!cred.user.emailVerified) {
        localStorage.setItem(PENDING_KEY, email);
        throw new Error('email-not-verified');
      }
      await this.hydrate(cred.user); // asegura el rol antes de resolver
    } finally {
      this._loading.set(false);
    }
  }

  async register(name: string, email: string, password: string): Promise<void> {
    this._loading.set(true);
    try {
      const cred = await createUserWithEmailAndPassword(this.auth, email, password);
      if (name?.trim()) await updateProfile(cred.user, { displayName: name.trim() });
      await fbSendEmailVerification(cred.user);
      localStorage.setItem(PENDING_KEY, email);
      // No se cierra sesión: se mantiene la sesión de Firebase (sin verificar) para
      // poder reenviar el correo; currentUser sigue null hasta que verifique.
      this._currentUser.set(null);
    } finally {
      this._loading.set(false);
    }
  }

  async signInWithGoogle(): Promise<void> {
    this._loading.set(true);
    try {
      const cred = await signInWithPopup(this.auth, new GoogleAuthProvider());
      await this.hydrate(cred.user);
    } finally {
      this._loading.set(false);
    }
  }

  async signInWithApple(): Promise<void> {
    this._loading.set(true);
    try {
      const cred = await signInWithPopup(this.auth, new OAuthProvider('apple.com'));
      await this.hydrate(cred.user);
    } finally {
      this._loading.set(false);
    }
  }

  /** Email del registro pendiente de verificación (para la pantalla "verifica tu correo"). */
  pendingEmail(): string | null {
    return this.auth.currentUser?.email ?? localStorage.getItem(PENDING_KEY);
  }

  /** Reenvía el correo de verificación al usuario en sesión (aún sin verificar). */
  async sendEmailVerification(): Promise<void> {
    if (this.auth.currentUser) await fbSendEmailVerification(this.auth.currentUser);
  }

  /** Comprueba si el correo ya fue verificado (tras hacer clic en el enlace). */
  async confirmEmailVerification(): Promise<boolean> {
    const u = this.auth.currentUser;
    if (!u) return false;
    await u.reload();
    if (u.emailVerified) {
      localStorage.removeItem(PENDING_KEY);
      await this.hydrate(u);
      return true;
    }
    return false;
  }

  async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email);
  }

  async resetPassword(oobCode: string, newPassword: string): Promise<void> {
    await confirmPasswordReset(this.auth, oobCode, newPassword);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this._currentUser.set(null);
    // Recarga dura: destruye todos los servicios singleton (biblioteca, perfil,
    // pedidos, etc.) para que no queden datos del usuario anterior al cambiar de
    // cuenta. La navegación SPA no basta porque los `providedIn: 'root'` persisten.
    window.location.assign('/auth/login');
  }

  /** Token de Firebase para el interceptor (Bearer). */
  async getIdToken(): Promise<string | null> {
    return this.auth.currentUser ? this.auth.currentUser.getIdToken() : null;
  }

  // ─── Internos ─────────────────────────────────────────────────────────────

  private isFederated(fbUser: FbUser): boolean {
    return fbUser.providerData.some((p) => p.providerId !== 'password');
  }

  /** Sincroniza con el backend (crea la cuenta la 1ª vez) y fija el rol real. */
  private async hydrate(fbUser: FbUser): Promise<void> {
    let role = UserRole.User;
    let email = fbUser.email ?? '';
    let displayName = fbUser.displayName ?? '';
    try {
      const dto = await firstValueFrom(this.http.get<ApiUser>(`${environment.apiUrl}/users/me`));
      role = dto.role === 1 ? UserRole.Admin : UserRole.User;
      email = dto.email || email;
      displayName = dto.displayName || displayName;
    } catch {
      // Si el backend no responde, deja sesión con rol User.
    }
    this._currentUser.set({
      uid: fbUser.uid,
      email,
      displayName: displayName || email.split('@')[0] || 'Usuario',
      role,
      emailVerified: fbUser.emailVerified,
    });
  }
}
