import { Component, inject, signal } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
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

      <!-- Acción real: el usuario abre el enlace del correo y vuelve aquí a confirmar. -->
      <button (click)="checkVerified()" [disabled]="checking()"
              class="w-full py-3.5 rounded-full gradient-primary text-white font-heading font-bold
                     shadow-primary hover:opacity-90 active:scale-95 transition-all
                     flex items-center justify-center gap-2 mb-3 disabled:opacity-60">
        @if (checking()) {
          <span class="material-symbols-outlined animate-spin text-[20px]">progress_activity</span> Comprobando…
        } @else {
          <span class="material-symbols-outlined text-[20px]">check_circle</span> Ya verifiqué mi correo
        }
      </button>

      @if (notYet()) {
        <p class="text-label-sm text-error font-heading text-center mb-3">
          Aún no detectamos la verificación. Abre el enlace del correo y vuelve a intentar.
        </p>
      }

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
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly email = signal(this.auth.pendingEmail());
  readonly resent = signal(false);
  readonly checking = signal(false);
  readonly notYet = signal(false);
  private readonly returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '';

  async resend(): Promise<void> {
    await this.auth.sendEmailVerification();
    this.resent.set(true);
    setTimeout(() => this.resent.set(false), 3000);
  }

  /** El usuario ya abrió el enlace del correo: recargamos su estado y, si quedó
   *  verificado, lo promovemos a sesión activa y entramos. */
  async checkVerified(): Promise<void> {
    this.checking.set(true);
    this.notYet.set(false);
    try {
      const ok = await this.auth.confirmEmailVerification();
      if (ok) {
        await this.router.navigateByUrl(this.returnUrl || '/app/library');
      } else {
        this.notYet.set(true);
      }
    } finally {
      this.checking.set(false);
    }
  }
}
