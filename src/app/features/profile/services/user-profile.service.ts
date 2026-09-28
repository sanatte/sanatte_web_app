import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';
import { TEXTS } from '../../../core/i18n/texts';

export interface UserProfile {
  fullName: string;
  email: string;
  avatarUrl: string | null;
  dateOfBirth: string;
  location: string;
  newsletterSubscribed: boolean;
}

interface ApiProfile {
  fullName: string;
  email: string;
  avatarUrl?: string | null;
  dateOfBirth: string | null;
  location: string | null;
  newsletterSubscribed: boolean;
}

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly base = `${environment.apiUrl}/me/profile`;

  private readonly _profile = signal<UserProfile>(this.seed());
  readonly profile = this._profile.asReadonly();

  constructor() { this.load(); }

  async load(): Promise<void> {
    await this.auth.whenReady();
    if (!this.auth.currentUser()) return;
    const raw = await firstValueFrom(this.http.get<ApiProfile>(this.base));
    this._profile.set(this.fromApi(raw));
  }

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

  async uploadAvatar(file: File): Promise<void> {
    const fd = new FormData();
    fd.append('file', file, file.name);
    const raw = await firstValueFrom(
      this.http.put<ApiProfile>(`${environment.apiUrl}/me/avatar`, fd)
    );
    this._profile.set(this.fromApi(raw));
  }

  private fromApi(raw: ApiProfile): UserProfile {
    return {
      fullName: raw.fullName,
      email: raw.email,
      avatarUrl: raw.avatarUrl ?? null,
      dateOfBirth: raw.dateOfBirth ?? '',
      location: raw.location ?? '',
      newsletterSubscribed: raw.newsletterSubscribed,
    };
  }

  private seed(): UserProfile {
    const user = this.auth.currentUser();
    return {
      fullName: user?.displayName ?? TEXTS.app.profile.seed.fullName,
      email: user?.email ?? TEXTS.app.profile.seed.email,
      avatarUrl: user?.avatarUrl ?? null,
      dateOfBirth: '',
      location: '',
      newsletterSubscribed: true,
    };
  }
}
