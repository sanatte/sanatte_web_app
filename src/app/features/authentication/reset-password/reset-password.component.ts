import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AuthShellComponent } from '../components/auth-shell/auth-shell.component';
import { TEXTS } from '../../../core/i18n/texts';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, AuthShellComponent, RouterLink],
  template: `
    <app-auth-shell icon="password">
      @if (!done()) {
        <h1 class="font-heading text-headline-md text-on-surface mb-1">{{ t.form.title }}</h1>
        <p class="font-sans text-label-md text-on-surface-variant mb-6">
          {{ t.form.subtitle }}
        </p>

        @if (!hasCode()) {
          <div class="mb-4 p-4 rounded-xl bg-error-container/50 border border-error/20 text-error
                      text-label-md font-heading flex items-start gap-2">
            <span class="material-symbols-outlined text-[18px] flex-shrink-0 mt-0.5">error</span>
            <div>
              {{ t.form.invalidLink }}
              <a routerLink="/auth/forgot"
                 class="block mt-1 text-primary font-bold hover:underline">
                {{ t.form.requestNewLink }}
              </a>
            </div>
          </div>
        }

        @if (errorMessage()) {
          <div class="mb-4 p-3 rounded-xl bg-error-container/50 border border-error/20 text-error
                      text-label-md font-heading flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px]">error</span>
            {{ errorMessage() }}
          </div>
        }

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="text-label-md font-heading font-semibold text-on-surface block mb-1.5">{{ t.form.password }}</label>
            <div class="relative group">
              <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline
                           group-focus-within:text-primary transition-colors text-[20px]">lock</span>
              <input formControlName="password" [type]="show() ? 'text' : 'password'" [placeholder]="t.form.passwordPlaceholder"
                     class="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border border-transparent focus:border-primary
                            focus:ring-4 focus:ring-primary/10 rounded-full outline-none text-body-md transition-all" />
            </div>
          </div>
          <div>
            <label class="text-label-md font-heading font-semibold text-on-surface block mb-1.5">{{ t.form.confirm }}</label>
            <div class="relative group">
              <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline
                           group-focus-within:text-primary transition-colors text-[20px]">lock</span>
              <input formControlName="confirm" [type]="show() ? 'text' : 'password'" [placeholder]="t.form.confirmPlaceholder"
                     class="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border border-transparent focus:border-primary
                            focus:ring-4 focus:ring-primary/10 rounded-full outline-none text-body-md transition-all" />
            </div>
            @if (form.hasError('mismatch') && form.get('confirm')?.touched) {
              <p class="text-error text-label-sm font-heading mt-1.5">{{ t.form.mismatch }}</p>
            }
          </div>
          <label class="flex items-center gap-2 cursor-pointer text-label-sm font-heading text-on-surface-variant">
            <input type="checkbox" [checked]="show()" (change)="show.set(!show())" class="accent-primary w-4 h-4" />
            {{ t.form.showPasswords }}
          </label>

          <button type="submit" [disabled]="loading() || form.invalid || !hasCode()"
                  class="w-full py-3.5 rounded-full gradient-primary text-white font-heading font-bold
                         shadow-primary hover:opacity-90 active:scale-95 transition-all
                         flex items-center justify-center gap-2 disabled:opacity-50">
            @if (loading()) {
              <span class="material-symbols-outlined animate-spin text-[20px]">progress_activity</span> {{ t.form.submitting }}
            } @else { {{ t.form.submit }} }
          </button>
        </form>
      } @else {
        <div class="text-center">
          <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <span class="material-symbols-outlined text-green-600 text-[34px]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
          </div>
          <h1 class="font-heading text-headline-md text-on-surface mb-2">{{ t.done.title }}</h1>
          <p class="font-sans text-body-md text-on-surface-variant mb-6">
            {{ t.done.message }}
          </p>
          <button (click)="toLogin()"
                  class="w-full py-3.5 rounded-full gradient-primary text-white font-heading font-bold
                         hover:opacity-90 active:scale-95 transition-all">
            {{ t.done.login }}
          </button>
        </div>
      }
    </app-auth-shell>
  `,
})
export class ResetPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly t = TEXTS.auth.resetPassword;
  private readonly errors = TEXTS.auth.errors.resetPassword;

  private readonly oobCode = this.route.snapshot.queryParamMap.get('oobCode') ?? '';

  readonly form = this.fb.nonNullable.group(
    {
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', [Validators.required]],
    },
    { validators: [this.matchValidator] },
  );
  readonly loading    = this.auth.loading;
  readonly show       = signal(false);
  readonly done       = signal(false);
  readonly hasCode    = signal(this.oobCode.length > 0);
  readonly errorMessage = signal('');

  private matchValidator(group: AbstractControl) {
    const p = group.get('password')?.value;
    const c = group.get('confirm')?.value;
    return p && c && p !== c ? { mismatch: true } : null;
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid || !this.oobCode) { this.form.markAllAsTouched(); return; }
    this.errorMessage.set('');
    try {
      await this.auth.resetPassword(this.oobCode, this.form.getRawValue().password);
      this.done.set(true);
    } catch (e) {
      const code = (e as { code?: string })?.code;
      this.errorMessage.set((code && this.errors.codes[code]) || this.errors.fallback);
    }
  }

  toLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
