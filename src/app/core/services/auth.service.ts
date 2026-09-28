import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth, Auth, onAuthStateChanged,
  signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile,
  signInWithPopup, GoogleAuthProvider, OAuthProvider,
  sendPasswordResetEmail, confirmPasswordReset, signOut,
  applyActionCode, verifyPasswordResetCode,
  ActionCodeSettings,
  User as FbUser,
} from 'firebase/auth';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';
import { UserRole } from '../models/role.model';
import { APP_LAYOUT_TEXTS } from '../i18n/es/app/layout.texts';

const PENDING_KEY = 'sanatte_pending_email';

const RESET_PASSWORD_SETTINGS: ActionCodeSettings = {
  url: `${environment.publicBaseUrl}/auth/login`,
  handleCodeInApp: false,
};

interface ApiUser { id: string; email: string; displayName: string; role: number; emailVerified: boolean; }

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

  private resolveReady!: () => void;
  private readonly readyPromise = new Promise<void>((res) => (this.resolveReady = res));

  constructor() {
    const app = getApps().length ? getApps()[0] : initializeApp(environment.firebase);
    this.auth = getAuth(app);

    onAuthStateChanged(this.auth, async (fbUser) => {
      if (fbUser && (fbUser.emailVerified || this.isFederated(fbUser))) {
        try { await this.hydrate(fbUser); }
        catch { this._currentUser.set(null); }
      } else {
        this._currentUser.set(null);
      }
      this.resolveReady();
    });
  }

  whenReady(): Promise<void> { return this.readyPromise; }

  async login(email: string, password: string): Promise<void> {
    this._loading.set(true);
    try {
      const cred = await signInWithEmailAndPassword(this.auth, email, password);
      if (!cred.user.emailVerified) {
        localStorage.setItem(PENDING_KEY, email);
        throw new Error('email-not-verified');
      }
      await this.establishSession(cred.user);
    } finally {
      this._loading.set(false);
    }
  }

  async register(name: string, email: string, password: string): Promise<void> {
    this._loading.set(true);
    try {
      const cred = await createUserWithEmailAndPassword(this.auth, email, password);
      if (name?.trim()) await updateProfile(cred.user, { displayName: name.trim() });
      await this.sendVerificationEmail(email);
      localStorage.setItem(PENDING_KEY, email);
      this._currentUser.set(null);
    } finally {
      this._loading.set(false);
    }
  }

  async signInWithGoogle(): Promise<void> {
    this._loading.set(true);
    try {
      const cred = await signInWithPopup(this.auth, new GoogleAuthProvider());
      await this.establishSession(cred.user);
    } finally {
      this._loading.set(false);
    }
  }

  async signInWithApple(): Promise<void> {
    this._loading.set(true);
    try {
      const cred = await signInWithPopup(this.auth, new OAuthProvider('apple.com'));
      await this.establishSession(cred.user);
    } finally {
      this._loading.set(false);
    }
  }

  pendingEmail(): string | null {
    return this.auth.currentUser?.email ?? localStorage.getItem(PENDING_KEY);
  }

  async sendEmailVerification(): Promise<void> {
    const email = this.auth.currentUser?.email ?? localStorage.getItem(PENDING_KEY);
    if (email) await this.sendVerificationEmail(email);
  }

  private sendVerificationEmail(email: string): Promise<void> {
    return firstValueFrom(
      this.http.post<void>(`${environment.apiUrl}/auth/send-email-verification`, { email })
    );
  }

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
    await firstValueFrom(
      this.http.post(`${environment.apiUrl}/auth/send-password-reset`, { email })
    );
  }

  async resetPassword(oobCode: string, newPassword: string): Promise<void> {
    await confirmPasswordReset(this.auth, oobCode, newPassword);
  }

  async applyEmailVerificationCode(oobCode: string): Promise<void> {
    await applyActionCode(this.auth, oobCode);
    localStorage.removeItem(PENDING_KEY);
    if (this.auth.currentUser) {
      await this.auth.currentUser.reload();
      if (this.auth.currentUser.emailVerified) {
        await this.hydrate(this.auth.currentUser).catch(() => undefined);
      }
    }
  }

  async verifyResetCode(oobCode: string): Promise<string> {
    return verifyPasswordResetCode(this.auth, oobCode);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this._currentUser.set(null);
    window.location.assign('/auth/login');
  }

  async getIdToken(): Promise<string | null> {
    return this.auth.currentUser ? this.auth.currentUser.getIdToken() : null;
  }

  private isFederated(fbUser: FbUser): boolean {
    return fbUser.providerData.some((p) => p.providerId !== 'password');
  }

  private async establishSession(fbUser: FbUser): Promise<void> {
    try {
      await this.hydrate(fbUser);
    } catch {
      await signOut(this.auth);
      this._currentUser.set(null);
      throw new Error('backend-unreachable');
    }
  }

  private async hydrate(fbUser: FbUser): Promise<void> {
    const dto = await firstValueFrom(this.http.get<ApiUser>(`${environment.apiUrl}/users/me`));
    this._currentUser.set({
      uid: fbUser.uid,
      email: dto.email || fbUser.email || '',
      displayName: dto.displayName || fbUser.displayName || fbUser.email?.split('@')[0] || APP_LAYOUT_TEXTS.account.defaultName,
      role: dto.role === 1 ? UserRole.Admin : UserRole.User,
      emailVerified: fbUser.emailVerified,
    });
  }
}
