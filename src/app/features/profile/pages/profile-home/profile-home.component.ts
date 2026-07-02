import { Component, inject, signal, computed } from '@angular/core';
import { UserProfileService } from '../../services/user-profile.service';
import { MockAuthService } from '../../../../core/services/mock-auth.service';

@Component({
  selector: 'app-profile-home',
  templateUrl: './profile-home.component.html',
})
export class ProfileHomeComponent {
  private readonly profileService = inject(UserProfileService);
  private readonly auth           = inject(MockAuthService);

  // Copia editable del perfil (se confirma con "Guardar cambios").
  readonly form = signal({ ...this.profileService.profile() });

  readonly newsletter = computed(() => this.profileService.profile().newsletterSubscribed);
  readonly initial    = computed(() => (this.form().fullName.charAt(0) || 'U').toUpperCase());

  readonly savedFlag = signal(false);

  update(key: 'fullName' | 'dateOfBirth' | 'location', value: string): void {
    this.form.update((f) => ({ ...f, [key]: value }));
  }

  saveChanges(): void {
    const { fullName, dateOfBirth, location } = this.form();
    this.profileService.save({ fullName, dateOfBirth, location });
    this.savedFlag.set(true);
    setTimeout(() => this.savedFlag.set(false), 2500);
  }

  toggleNewsletter(): void {
    this.profileService.setNewsletter(!this.newsletter());
  }

  logout(): void { this.auth.logout(); }
}
