import { Component, inject, signal } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MockAuthService } from '../../../core/services/mock-auth.service';
import { AuthShellComponent } from '../components/auth-shell/auth-shell.component';

@Component({
  selector: 'app-verify-email',
  imports: [RouterLink, AuthShellComponent],
  template: `
    <app-auth-shell icon="mark_email_unread">
      <h1 class="font-heading text-headline-md text-on-surface mb-1">Verifica tu correo</h1>
      <p class="font-sans text-label-md text-on-surface-variant mb-5">
        Enviamos un enlace de verificación a
        <span class="font-bold text-on-surface">{{ email() || 'tu correo' }}</span>.
        Ábrelo para activar tu cuenta y proteger el acceso a tus recursos.
      </p>

      <div class="p-4 rounded-xl bg-primary-fixed/60 flex items-start gap-2 mb-6">
        <span class="material-symbols-outlined text-primary text-[18px]">info</span>
        <p class="text-label-sm font-heading text-on-primary-fixed-variant">
          Tu correo es la llave de tus compras y recursos activados: por eso lo verificamos antes de continuar.
        </p>
      </div>

      <!-- Simula el clic en el enlace del correo (en producción llega por email vía Firebase) -->
      <button (click)="simulateLinkClick()"
              class="w-full py-3.5 rounded-full gradient-primary text-white font-heading font-bold
                     shadow-primary hover:opacity-90 active:scale-95 transition-all
                     flex items-center justify-center gap-2 mb-3">
        <span class="material-symbols-outlined text-[20px]">open_in_new</span>
        Abrir enlace de verificación
      </button>

      <button (click)="resend()" [disabled]="resent()"
              class="w-full py-3 rounded-full border border-outline-variant font-heading font-semibold
                     text-on-surface hover:bg-surface-container transition-colors disabled:opacity-60">
        {{ resent() ? 'Correo reenviado ✓' : 'Reenviar correo' }}
      </button>

      <p class="text-center text-label-md font-heading text-on-surface-variant mt-6">
        <a routerLink="/auth/login" class="text-primary font-bold hover:underline inline-flex items-center gap-1">
          <span class="material-symbols-outlined text-[16px]">arrow_back</span> Volver al inicio de sesión
        </a>
      </p>
    </app-auth-shell>
  `,
})
export class VerifyEmailComponent {
  private readonly auth = inject(MockAuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly email = signal(this.auth.pendingEmail());
  readonly resent = signal(false);
  private readonly returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '';

  async resend(): Promise<void> {
    await this.auth.sendEmailVerification();
    this.resent.set(true);
    setTimeout(() => this.resent.set(false), 3000);
  }

  simulateLinkClick(): void {
    // El enlace real (Firebase) llega por correo a /auth/verified?oobCode=…
    this.router.navigate(['/auth/verified'], {
      queryParams: this.returnUrl ? { returnUrl: this.returnUrl } : {},
    });
  }
}
