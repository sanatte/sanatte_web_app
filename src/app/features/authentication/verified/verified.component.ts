import { Component, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MockAuthService } from '../../../core/services/mock-auth.service';
import { AuthShellComponent } from '../components/auth-shell/auth-shell.component';

/**
 * Correo verificado (mockup). Se alcanza desde el enlace del correo.
 * Confirma la verificación (promueve al usuario a sesión activa) y da acceso.
 */
@Component({
  selector: 'app-verified',
  imports: [AuthShellComponent],
  template: `
    <app-auth-shell icon="verified">
      @if (ok()) {
        <div class="text-center">
          <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <span class="material-symbols-outlined text-green-600 text-[38px]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
          </div>
          <h1 class="font-heading text-headline-md text-on-surface mb-2">¡Correo verificado!</h1>
          <p class="font-sans text-body-md text-on-surface-variant mb-6">
            Tu cuenta fue activada correctamente. Ya puedes comenzar tu camino al bienestar.
          </p>
          <button (click)="go()"
                  class="w-full py-3.5 rounded-full gradient-primary text-white font-heading font-bold
                         shadow-primary hover:opacity-90 active:scale-95 transition-all
                         flex items-center justify-center gap-2">
            Ir a mi biblioteca
            <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>
      } @else {
        <div class="text-center">
          <div class="w-16 h-16 rounded-full bg-error-container flex items-center justify-center mx-auto mb-4">
            <span class="material-symbols-outlined text-error text-[34px]">link_off</span>
          </div>
          <h1 class="font-heading text-headline-md text-on-surface mb-2">Enlace no válido</h1>
          <p class="font-sans text-body-md text-on-surface-variant mb-6">
            El enlace de verificación expiró o ya fue usado. Inicia sesión o solicita uno nuevo.
          </p>
          <button (click)="toLogin()"
                  class="w-full py-3.5 rounded-full gradient-primary text-white font-heading font-bold
                         hover:opacity-90 active:scale-95 transition-all">
            Ir al inicio de sesión
          </button>
        </div>
      }
    </app-auth-shell>
  `,
})
export class VerifiedComponent {
  private readonly auth = inject(MockAuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly ok = signal(false);
  private readonly returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '';

  constructor() {
    this.auth.confirmEmailVerification().then((success) => this.ok.set(success));
  }

  go(): void {
    this.router.navigateByUrl(this.returnUrl || '/app/library');
  }
  toLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
