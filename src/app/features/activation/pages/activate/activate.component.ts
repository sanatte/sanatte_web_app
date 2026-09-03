import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { UserActivationService, ActivationResult } from '../../services/user-activation.service';

@Component({
  selector: 'app-activate',
  imports: [FormsModule, RouterLink],
  templateUrl: './activate.component.html',
})
export class ActivateComponent {
  private readonly route      = inject(ActivatedRoute);
  private readonly router     = inject(Router);
  private readonly activation = inject(UserActivationService);

  private readonly codeParam = toSignal(
    this.route.queryParamMap.pipe(map((p) => p.get('code') ?? '')),
    { initialValue: '' }
  );

  code = '';
  readonly result = signal<ActivationResult | null>(null);
  readonly verifying = signal(false);

  readonly succeeded = computed(() => this.result()?.status === 'success');
  readonly errorMsg = computed(() => {
    const r = this.result();
    return r && r.status !== 'success' ? r.message : '';
  });
  readonly activated = computed(() => {
    const r = this.result();
    return r?.status === 'success' ? r : null;
  });

  constructor() {
    // Precarga el código si viene del QR (?code=).
    const c = this.codeParam();
    if (c) this.code = c;
  }

  async verify(): Promise<void> {
    const code = this.code.trim();
    if (!code) return;
    this.verifying.set(true);
    try {
      const res = await this.activation.activate(code);
      this.result.set(res);
      if (res.status === 'success' && res.welcomeResourceSlug) {
        // Pequeña pausa para que el usuario vea el check de éxito antes de redirigir.
        setTimeout(() => this.router.navigate(['/app/welcome', res.welcomeResourceSlug]), 1200);
      }
    } finally {
      this.verifying.set(false);
    }
  }

  reset(): void {
    this.result.set(null);
  }
}
