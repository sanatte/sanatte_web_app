import { Component, inject, signal, computed, effect } from '@angular/core';
import { UserProfileService } from '../../services/user-profile.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-profile-home',
  templateUrl: './profile-home.component.html',
})
export class ProfileHomeComponent {
  readonly profileService = inject(UserProfileService);
  private readonly auth   = inject(AuthService);

  // Copia editable del perfil (se confirma con "Guardar cambios").
  readonly form = signal({ ...this.profileService.profile() });
  private dirty = false;

  readonly newsletter = computed(() => this.profileService.profile().newsletterSubscribed);
  readonly initial    = computed(() => (this.form().fullName.charAt(0) || 'U').toUpperCase());

  readonly savedFlag      = signal(false);
  readonly uploadingAvatar = signal(false);
  readonly avatarError    = signal('');

  constructor() {
    // El perfil llega async del backend; resincroniza el form hasta que el
    // usuario empiece a editar (para no pisar sus cambios en curso).
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
      this.avatarError.set('El archivo supera 3 MB.');
      return;
    }
    this.avatarError.set('');
    this.uploadingAvatar.set(true);
    try {
      await this.profileService.uploadAvatar(file);
    } catch {
      this.avatarError.set('No se pudo subir el avatar. Inténtalo de nuevo.');
    } finally {
      this.uploadingAvatar.set(false);
      (event.target as HTMLInputElement).value = '';
    }
  }

  logout(): void { this.auth.logout(); }
}
