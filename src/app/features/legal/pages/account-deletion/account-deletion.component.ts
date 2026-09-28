import { Component } from '@angular/core';
import { LegalPageComponent } from '../../legal-page.component';
import { TEXTS } from '../../../../core/i18n/texts';

@Component({
  selector: 'app-account-deletion',
  standalone: true,
  imports: [LegalPageComponent],
  template: `
    <app-legal-page [document]="t" />
  `,
})
export class AccountDeletionComponent {
  protected readonly t = TEXTS.public.legal.accountDeletion;
}
