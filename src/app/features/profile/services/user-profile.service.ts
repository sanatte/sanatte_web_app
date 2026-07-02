import { Injectable, inject, signal } from '@angular/core';
import { MockAuthService } from '../../../core/services/mock-auth.service';

/**
 * Perfil editable del usuario (vista cliente).
 *
 * Fase Mock: nombre/email vienen de MockAuth; los campos extra (fecha de
 * nacimiento, ubicación) y la preferencia de newsletter se persisten en
 * localStorage. Migración: reemplazar por el perfil del backend (Firebase/NestJS).
 */
export interface UserProfile {
  fullName: string;
  email: string;
  dateOfBirth: string;   // yyyy-mm-dd
  location: string;
  newsletterSubscribed: boolean;
}

const STORAGE_KEY = 'sanatte_profile_prefs';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  private readonly auth = inject(MockAuthService);

  private readonly _profile = signal<UserProfile>(this.restore());
  readonly profile = this._profile.asReadonly();

  /** Actualiza campos editables del perfil (persistidos). */
  save(changes: Partial<UserProfile>): void {
    this._profile.update((p) => ({ ...p, ...changes }));
    this.persist();
  }

  setNewsletter(subscribed: boolean): void {
    this.save({ newsletterSubscribed: subscribed });
  }

  private restore(): UserProfile {
    const user = this.auth.currentUser();
    const base: UserProfile = {
      fullName: user?.displayName
        ? user.displayName.charAt(0).toUpperCase() + user.displayName.slice(1)
        : 'Usuario Sanatte',
      email: user?.email ?? 'usuario@sanatte.com',
      dateOfBirth: '',
      location: '',
      newsletterSubscribed: true,
    };
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return base;
    try {
      return { ...base, ...(JSON.parse(stored) as Partial<UserProfile>) };
    } catch {
      return base;
    }
  }

  private persist(): void {
    const { dateOfBirth, location, newsletterSubscribed } = this._profile();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ dateOfBirth, location, newsletterSubscribed }));
  }
}
