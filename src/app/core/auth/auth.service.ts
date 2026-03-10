import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _currentUser = signal<AuthUser | null>(null);
  private readonly _loading = signal(false);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this._currentUser());
  readonly loading = this._loading.asReadonly();

  constructor(private readonly router: Router) {
    // Restore session from localStorage
    const stored = localStorage.getItem('sanatte_user');
    if (stored) {
      try {
        this._currentUser.set(JSON.parse(stored));
      } catch {
        localStorage.removeItem('sanatte_user');
      }
    }
  }

  /**
   * Simulated login — replace with Firebase Auth when config is ready.
   * For now, accepts any email/password and creates a mock admin user.
   */
  async login(email: string, _password: string): Promise<void> {
    this._loading.set(true);
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const user: AuthUser = {
        uid: 'mock-uid-001',
        email,
        displayName: email.split('@')[0],
        role: 'admin',
      };

      this._currentUser.set(user);
      localStorage.setItem('sanatte_user', JSON.stringify(user));
    } finally {
      this._loading.set(false);
    }
  }

  async logout(): Promise<void> {
    this._currentUser.set(null);
    localStorage.removeItem('sanatte_user');
    await this.router.navigate(['/login']);
  }

  /**
   * Returns a mock token for API calls.
   * Replace with: await firebase.auth().currentUser?.getIdToken()
   */
  async getIdToken(): Promise<string | null> {
    if (!this._currentUser()) return null;
    return 'mock-firebase-id-token';
  }
}
