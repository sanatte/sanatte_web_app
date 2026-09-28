import { Component } from '@angular/core';
import { LegalPageComponent } from '../../legal-page.component';
import { TEXTS } from '../../../../core/i18n/texts';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [LegalPageComponent],
  template: `
    <app-legal-page [document]="t" />
  `,
})
export class PrivacyComponent {
  protected readonly t = TEXTS.public.legal.privacy;
}
