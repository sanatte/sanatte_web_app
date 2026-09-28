import { Component } from '@angular/core';
import { TEXTS } from '../../../../core/i18n/texts';
import { AdminPageHeaderComponent } from '../../../../shared/components/admin-page-header/admin-page-header.component';

@Component({
  selector: 'app-admin-reports',
  imports: [AdminPageHeaderComponent],
  template: `
    <section class="px-4 md:px-8 lg:px-container-padding-desktop py-6 max-w-[1400px] mx-auto">
      <app-admin-page-header [title]="t.title" [description]="t.comingSoon" />
    </section>
  `,
})
export class AdminReportsComponent {
  protected readonly t = TEXTS.admin.reports;
}
