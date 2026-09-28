import { Component, inject, signal, computed, effect } from '@angular/core';
import { UserProfileService } from '../../services/user-profile.service';
import { AuthService } from '../../../../core/services/auth.service';
import { TEXTS } from '../../../../core/i18n/texts';

@Component({
  selector: 'app-profile-home',
  templateUrl: './profile-home.component.html',
})
export class ProfileHomeComponent {
  readonly profileService = inject(UserProfileService);
  private readonly auth   = inject(AuthService);

  protected readonly t = TEXTS.app.profile;

  readonly form = signal({ ...this.profileService.profile() });
  private dirty = false;

  readonly newsletter = computed(() => this.profileService.profile().newsletterSubscribed);
  readonly initial    = computed(() => (this.form().fullName.charAt(0) || this.t.header.initialFallback).toUpperCase());

  readonly savedFlag      = signal(false);
  readonly uploadingAvatar = signal(false);
  readonly avatarError    = signal('');

  constructor() {
    effect(() => {
      const p = this.profileService.profile();
      if (!this.dirty) this.form.set({ ...p });
    });
  }

  update(key: 'fullName' | 'dateOfBirth' | 'location', value: string): void {
    this.dirty = true;
    this.form.update((f) => ({ ...f, [key]: value }));
  }

  saveChanges(): void {
    const { fullName, dateOfBirth, location } = this.form();
    this.profileService.save({ fullName, dateOfBirth, location });
    this.dirty = false;
    this.savedFlag.set(true);
    setTimeout(() => this.savedFlag.set(false), 2500);
  }

  toggleNewsletter(): void {
    this.profileService.setNewsletter(!this.newsletter());
  }

  async onAvatarFileChange(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      this.avatarError.set(this.t.avatar.tooLarge);
      return;
    }
    this.avatarError.set('');
    this.uploadingAvatar.set(true);
    try {
      await this.profileService.uploadAvatar(file);
    } catch {
      this.avatarError.set(this.t.avatar.uploadFailed);
    } finally {
      this.uploadingAvatar.set(false);
      (event.target as HTMLInputElement).value = '';
    }
  }

  logout(): void { this.auth.logout(); }
}
