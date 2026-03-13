import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { FirebaseService } from '../firebase/firebase.service';

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _currentUser = signal<AuthUser | null>(null);
  private readonly _loading = signal(true);
  private firebaseUser: User | null = null;

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this._currentUser());
  readonly loading = this._loading.asReadonly();

  constructor(
    private readonly router: Router,
    private readonly firebaseService: FirebaseService,
  ) {
    // Listen to Firebase auth state changes
    onAuthStateChanged(this.firebaseService.auth, (user) => {
      if (user) {
        this.firebaseUser = user;
        const authUser: AuthUser = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || user.email?.split('@')[0] || '',
          role: 'admin',
        };
        this._currentUser.set(authUser);
      } else {
        this.firebaseUser = null;
        this._currentUser.set(null);
      }
      this._loading.set(false);
    });
  }

  async login(email: string, password: string): Promise<void> {
    this._loading.set(true);
    try {
      await signInWithEmailAndPassword(this.firebaseService.auth, email, password);
    } finally {
      this._loading.set(false);
    }
  }

  async logout(): Promise<void> {
    await signOut(this.firebaseService.auth);
    await this.router.navigate(['/login']);
  }

  async getIdToken(): Promise<string | null> {
    if (!this.firebaseUser) return null;
    return this.firebaseUser.getIdToken();
  }
}
