import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MockAuthService } from '../../../core/services/mock-auth.service';
import { environment } from '../../../../environments/environment';

/**
 * Perfil editable del usuario (vista cliente).
 *
 * Consume `GET/PUT /api/me/profile`. Mientras carga, se muestra un perfil base
 * derivado de la sesión (nombre/email). Los campos extra (fecha de nacimiento,
 * ubicación, newsletter) se persisten en el backend contra el usuario.
 */
export interface UserProfile {
  fullName: string;
  email: string;
  dateOfBirth: string;   // yyyy-mm-dd
  location: string;
  newsletterSubscribed: boolean;
}

interface ApiProfile {
  fullName: string;
  email: string;
  dateOfBirth: string | null;
  location: string | null;
  newsletterSubscribed: boolean;
}

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(MockAuthService);
  private readonly base = `${environment.apiUrl}/me/profile`;

  private readonly _profile = signal<UserProfile>(this.seed());
  readonly profile = this._profile.asReadonly();

  constructor() { this.load(); }

  async load(): Promise<void> {
    const raw = await firstValueFrom(this.http.get<ApiProfile>(this.base));
    this._profile.set(this.fromApi(raw));
  }

  /** Actualiza campos editables del perfil y persiste en el backend. */
  async save(changes: Partial<UserProfile>): Promise<void> {
    const next = { ...this._profile(), ...changes };
    this._profile.set(next);
    const raw = await firstValueFrom(
      this.http.put<ApiProfile>(this.base, {
        fullName: next.fullName,
        dateOfBirth: next.dateOfBirth || null,
        location: next.location || null,
        newsletterSubscribed: next.newsletterSubscribed,
      })
    );
    this._profile.set(this.fromApi(raw));
  }

  setNewsletter(subscribed: boolean): void {
    this.save({ newsletterSubscribed: subscribed });
  }

  private fromApi(raw: ApiProfile): UserProfile {
    return {
      fullName: raw.fullName,
      email: raw.email,
      dateOfBirth: raw.dateOfBirth ?? '',
      location: raw.location ?? '',
      newsletterSubscribed: raw.newsletterSubscribed,
    };
  }

  /** Perfil base inmediato desde la sesión, hasta que responde el backend. */
  private seed(): UserProfile {
    const user = this.auth.currentUser();
    return {
      fullName: user?.displayName ?? 'Usuario Sanatte',
      email: user?.email ?? 'usuario@sanatte.com',
      dateOfBirth: '',
      location: '',
      newsletterSubscribed: true,
    };
  }
}
