import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TEXTS } from '../../../../core/i18n/texts';

@Component({
  selector: 'app-activate-redirect',
  template: `
    <div class="flex flex-col items-center justify-center py-24 text-center">
      <span class="material-symbols-outlined animate-spin text-primary text-[32px] mb-3">progress_activity</span>
      <p class="font-heading text-on-surface-variant">{{ t.preparing }}</p>
    </div>
  `,
})
export class ActivateRedirectComponent {
  private readonly route  = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly t = TEXTS.app.activation.redirect;

  constructor() {
    const code = this.route.snapshot.queryParamMap.get('code') ?? '';
    this.router.navigate(['/app/activate'], { queryParams: code ? { code } : {}, replaceUrl: true });
  }
}
