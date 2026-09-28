import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TEXTS } from '../../../../core/i18n/texts';

@Component({
  selector: 'app-resource-redirect',
  template: `
    <div class="flex flex-col items-center justify-center py-24 text-center">
      <span class="material-symbols-outlined animate-spin text-primary text-[32px] mb-3">progress_activity</span>
      <p class="font-heading text-on-surface-variant">{{ t.opening }}</p>
    </div>
  `,
})
export class ResourceRedirectComponent {
  protected readonly t = TEXTS.app.resourceViewer;

  private readonly route  = inject(ActivatedRoute);
  private readonly router = inject(Router);

  constructor() {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.router.navigate(['/app/r', slug], { replaceUrl: true });
  }
}
