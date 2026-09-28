import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AuthShellComponent } from '../components/auth-shell/auth-shell.component';
import { TEXTS } from '../../../core/i18n/texts';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterLink, AuthShellComponent],
  template: `
    <app-auth-shell icon="lock_reset">
      @if (!sent()) {
        <h1 class="font-heading text-headline-md text-on-surface mb-1 text-center">{{ t.form.title }}</h1>
        <p class="font-sans text-label-md text-on-surface-variant mb-6 text-center">
          {{ t.form.subtitle }}
        </p>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="text-label-md font-heading font-semibold text-on-surface block mb-1.5">{{ t.form.email }}</label>
            <div class="relative group">
              <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline
                           group-focus-within:text-primary transition-colors text-[20px]">mail</span>
              <input formControlName="email" type="email" [placeholder]="t.form.emailPlaceholder"
                     class="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border border-transparent focus:border-primary
                            focus:ring-4 focus:ring-primary/10 rounded-full outline-none text-body-md transition-all" />
            </div>
          </div>
          <button type="submit" [disabled]="loading() || form.invalid"
                  class="w-full py-4 rounded-full gradient-primary text-white font-heading font-bold text-label-md
                         shadow-primary hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]
                         transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:shadow-none
                         disabled:hover:translate-y-0">
            @if (loading()) {
              <span class="material-symbols-outlined animate-spin text-[20px]">progress_activity</span> {{ t.form.submitting }}
            } @else {
              <span class="material-symbols-outlined text-[20px]">send</span> {{ t.form.submit }}
            }
          </button>
        </form>
      } @else {
        <div class="text-center">
          <div class="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center mx-auto mb-4">
            <span class="material-symbols-outlined text-primary text-[34px]">mark_email_read</span>
          </div>
          <h1 class="font-heading text-headline-md text-on-surface mb-2">{{ t.sent.title }}</h1>
          <p class="font-sans text-body-md text-on-surface-variant mb-6">
            {{ t.sent.messagePrefix }} <span class="font-bold text-on-surface">{{ form.value.email }}</span> {{ t.sent.messageSuffix }}
          </p>
          <button (click)="resend()" [disabled]="loading()"
                  class="text-primary font-heading font-bold text-label-md hover:underline inline-flex items-center gap-1 disabled:opacity-50">
            @if (loading()) {
              <span class="material-symbols-outlined animate-spin text-[16px]">progress_activity</span> {{ t.sent.resending }}
            } @else {
              <span class="material-symbols-outlined text-[16px]">refresh</span> {{ t.sent.resend }}
            }
          </button>
        </div>
      }

      <div class="border-t border-outline-variant/30 mt-6 pt-5 text-center">
        <a routerLink="/auth/login" class="text-primary font-heading font-bold text-label-md hover:underline inline-flex items-center gap-1">
          <span class="material-symbols-outlined text-[16px]">arrow_back</span> {{ t.backToLogin }}
        </a>
      </div>
    </app-auth-shell>
  `,
})
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);

  protected readonly t = TEXTS.auth.forgotPassword;

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });
  readonly loading = signal(false);
  readonly sent = signal(false);

  async onSubmit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (this.loading()) return;
    this.loading.set(true);
    try {
      await this.auth.sendPasswordReset(this.form.getRawValue().email);
      this.sent.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  async resend(): Promise<void> {
    if (this.loading()) return;
    this.loading.set(true);
    try {
      await this.auth.sendPasswordReset(this.form.getRawValue().email);
    } finally {
      this.loading.set(false);
    }
  }
}
