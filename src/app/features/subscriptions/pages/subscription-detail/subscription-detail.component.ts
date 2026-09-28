import { Component } from '@angular/core';
import { TEXTS } from '../../../../core/i18n/texts';

@Component({
  selector: 'app-subscription-detail',
  template: `
    <div class="p-8">
      <h1 class="text-2xl font-bold text-gray-900">{{ t.title }}</h1>
      <p class="mt-2 text-gray-500">{{ t.comingSoon }}</p>
    </div>
  `,
})
export class SubscriptionDetailComponent {
  protected readonly t = TEXTS.app.subscriptions.detail;
}
