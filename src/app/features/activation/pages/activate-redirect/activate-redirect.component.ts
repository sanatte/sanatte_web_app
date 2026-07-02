import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * ActivateRedirect — punto de entrada público del QR impreso: `/activate?code=`.
 *
 * Reenvía a `/app/activate?code=` (shell privado, requiere cuenta). Si el usuario
 * no tiene sesión, el guard lo lleva a login preservando el returnUrl con el código,
 * y vuelve a la activación tras autenticarse. Así el QR lleva una URL limpia.
 */
@Component({
  selector: 'app-activate-redirect',
  template: `
    <div class="flex flex-col items-center justify-center py-24 text-center">
      <span class="material-symbols-outlined animate-spin text-primary text-[32px] mb-3">progress_activity</span>
      <p class="font-heading text-on-surface-variant">Preparando la activación…</p>
    </div>
  `,
})
export class ActivateRedirectComponent {
  private readonly route  = inject(ActivatedRoute);
  private readonly router = inject(Router);

  constructor() {
    const code = this.route.snapshot.queryParamMap.get('code') ?? '';
    this.router.navigate(['/app/activate'], { queryParams: code ? { code } : {}, replaceUrl: true });
  }
}
