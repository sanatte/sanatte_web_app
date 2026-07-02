import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MockAuthService } from '../../../core/services/mock-auth.service';
import { AuthShellComponent } from '../components/auth-shell/auth-shell.component';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterLink, AuthShellComponent],
  template: `
    <app-auth-shell icon="lock_reset">
      @if (!sent()) {
        <h1 class="font-heading text-headline-md text-on-surface mb-1">Recuperar contraseña</h1>
        <p class="font-sans text-label-md text-on-surface-variant mb-6">
          Ingresa tu correo para recibir un enlace de recuperación.
        </p>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="text-label-md font-heading font-semibold text-on-surface block mb-1.5">Correo electrónico</label>
            <div class="relative group">
              <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline
                           group-focus-within:text-primary transition-colors text-[20px]">mail</span>
              <input formControlName="email" type="email" placeholder="ejemplo@sanatte.com"
                     class="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border border-transparent focus:border-primary
                            focus:ring-4 focus:ring-primary/10 rounded-full outline-none text-body-md transition-all" />
            </div>
          </div>
          <button type="submit" [disabled]="loading() || form.invalid"
                  class="w-full py-3.5 rounded-full gradient-primary text-white font-heading font-bold
                         shadow-primary hover:opacity-90 active:scale-95 transition-all
                         flex items-center justify-center gap-2 disabled:opacity-50">
            @if (loading()) {
              <span class="material-symbols-outlined animate-spin text-[20px]">progress_activity</span> Enviando…
            } @else { Enviar enlace <span class="material-symbols-outlined text-[20px]">arrow_forward</span> }
          </button>
        </form>
      } @else {
        <div class="text-center">
          <div class="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center mx-auto mb-4">
            <span class="material-symbols-outlined text-primary text-[34px]">mark_email_read</span>
          </div>
          <h1 class="font-heading text-headline-md text-on-surface mb-2">Revisa tu correo</h1>
          <p class="font-sans text-body-md text-on-surface-variant mb-6">
            Si <span class="font-bold text-on-surface">{{ form.value.email }}</span> tiene una cuenta,
            recibirás un enlace para restablecer tu contraseña.
          </p>
          <!-- Simula el clic en el enlace del correo (Firebase lo envía por email) -->
          <button (click)="openResetLink()"
                  class="w-full py-3.5 rounded-full gradient-primary text-white font-heading font-bold
                         hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-[20px]">open_in_new</span>
            Abrir enlace de recuperación
          </button>
        </div>
      }

      <div class="border-t border-outline-variant/30 mt-6 pt-5 text-center">
        <a routerLink="/auth/login" class="text-primary font-heading font-bold text-label-md hover:underline inline-flex items-center gap-1">
          <span class="material-symbols-outlined text-[16px]">arrow_back</span> Volver al inicio de sesión
        </a>
      </div>
    </app-auth-shell>
  `,
})
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(MockAuthService);
  private readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });
  readonly loading = this.auth.loading;
  readonly sent = signal(false);

  async onSubmit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    await this.auth.sendPasswordReset(this.form.getRawValue().email);
    this.sent.set(true);
  }

  openResetLink(): void {
    this.router.navigate(['/auth/reset'], { queryParams: { oobCode: 'mock-code' } });
  }
}
