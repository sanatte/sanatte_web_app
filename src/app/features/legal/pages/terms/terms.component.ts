import { Component } from '@angular/core';
import { LegalPageComponent } from '../../legal-page.component';
import { TEXTS } from '../../../../core/i18n/texts';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [LegalPageComponent],
  template: `
    <app-legal-page [document]="t" />
  `,
})
export class TermsComponent {
  protected readonly t = TEXTS.public.legal.terms;
}
