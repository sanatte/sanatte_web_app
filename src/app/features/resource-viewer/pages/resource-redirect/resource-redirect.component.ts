import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * ResourceRedirect — entrada pública del QR de un recurso: `/r/:slug`.
 *
 * Reenvía a `/app/r/:slug` (shell privado). Si no hay sesión, el guard lleva a
 * login preservando el returnUrl y vuelve al recurso tras autenticarse. Así el
 * QR impreso lleva una URL corta y estable: sanatte.com/r/{slug}.
 */
@Component({
  selector: 'app-resource-redirect',
  template: `
    <div class="flex flex-col items-center justify-center py-24 text-center">
      <span class="material-symbols-outlined animate-spin text-primary text-[32px] mb-3">progress_activity</span>
      <p class="font-heading text-on-surface-variant">Abriendo tu recurso…</p>
    </div>
  `,
})
export class ResourceRedirectComponent {
  private readonly route  = inject(ActivatedRoute);
  private readonly router = inject(Router);

  constructor() {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.router.navigate(['/app/r', slug], { replaceUrl: true });
  }
}
