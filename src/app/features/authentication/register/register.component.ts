import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AuthShellComponent } from '../components/auth-shell/auth-shell.component';
import { TEXTS } from '../../../core/i18n/texts';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, AuthShellComponent],
  template: `
    <app-auth-shell icon="person_add">
      <h1 class="font-heading text-headline-md text-on-surface mb-1">{{ t.title }}</h1>
      <p class="font-sans text-label-md text-on-surface-variant mb-6">
        {{ t.subtitle }}
      </p>

      @if (errorMessage()) {
        <div class="mb-4 p-3 rounded-xl bg-error-container/50 border border-error/20 text-error
                    text-label-md font-heading flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px]">error</span>
          {{ errorMessage() }}
        </div>
      }

      <button (click)="withGoogle()" [disabled]="loading()"
              class="w-full py-3 rounded-full border border-outline-variant bg-white font-heading
                     font-semibold text-on-surface flex items-center justify-center gap-2
                     hover:bg-surface-container transition-colors disabled:opacity-50">
        <img src="https://www.google.com/favicon.ico" alt="" class="w-4 h-4" />
        {{ t.google }}
      </button>

      <div class="flex items-center gap-3 my-5">
        <div class="flex-1 h-px bg-outline-variant/40"></div>
        <span class="text-label-sm font-heading text-outline">{{ t.divider }}</span>
        <div class="flex-1 h-px bg-outline-variant/40"></div>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
        <div>
          <label class="text-label-md font-heading font-semibold text-on-surface block mb-1.5">{{ t.form.name }}</label>
          <div class="relative group">
            <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline
                         group-focus-within:text-primary transition-colors text-[20px]">person</span>
            <input formControlName="name" type="text" [placeholder]="t.form.namePlaceholder"
                   class="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border border-transparent focus:border-primary
                          focus:ring-4 focus:ring-primary/10 rounded-full outline-none text-body-md transition-all" />
          </div>
        </div>
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
        <div>
          <label class="text-label-md font-heading font-semibold text-on-surface block mb-1.5">{{ t.form.password }}</label>
          <div class="relative group">
            <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline
                         group-focus-within:text-primary transition-colors text-[20px]">lock</span>
            <input formControlName="password" [type]="showPassword() ? 'text' : 'password'" [placeholder]="t.form.passwordPlaceholder"
                   class="w-full pl-12 pr-11 py-3.5 bg-surface-container-low border border-transparent focus:border-primary
                          focus:ring-4 focus:ring-primary/10 rounded-full outline-none text-body-md transition-all" />
            <button type="button" (click)="showPassword.set(!showPassword())"
                    class="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors">
              <span class="material-symbols-outlined text-[20px]">{{ showPassword() ? 'visibility_off' : 'visibility' }}</span>
            </button>
          </div>
        </div>

        <label class="flex items-start gap-2 cursor-pointer">
          <input formControlName="terms" type="checkbox" class="mt-0.5 accent-primary w-4 h-4" />
          <span class="text-label-sm font-heading text-on-surface-variant">
            {{ t.form.termsPrefix }}
            <a routerLink="/legal/privacidad" target="_blank" class="text-primary hover:underline">{{ t.form.termsLink }}</a>.
          </span>
        </label>

        <button type="submit" [disabled]="loading() || form.invalid"
                class="group w-full py-3.5 rounded-full gradient-primary text-white font-heading font-bold
                       shadow-primary-lg hover:opacity-95 active:scale-[0.98] transition-all
                       flex items-center justify-center gap-2 disabled:opacity-50">
          @if (loading()) {
            <span class="material-symbols-outlined animate-spin text-[20px]">progress_activity</span> {{ t.submitting }}
          } @else {
            {{ t.submit }}
            <span class="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
          }
        </button>
      </form>

      <p class="text-center text-label-md font-heading text-on-surface-variant mt-6">
        {{ t.hasAccount }}
        <a routerLink="/auth/login" [queryParams]="{ returnUrl: returnUrl() }"
           class="text-primary font-bold hover:underline">{{ t.login }}</a>
      </p>
    </app-auth-shell>
  `,
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly t = TEXTS.auth.register;
  private readonly errors = TEXTS.auth.errors;

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    terms: [false, [Validators.requiredTrue]],
  });

  readonly loading = this.auth.loading;
  readonly showPassword = signal(false);
  readonly errorMessage = signal('');
  readonly returnUrl = signal(this.route.snapshot.queryParamMap.get('returnUrl') ?? '');

  async onSubmit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.errorMessage.set('');
    const { name, email, password } = this.form.getRawValue();
    try {
      await this.auth.register(name, email, password);
      await this.router.navigate(['/auth/verify-email'], {
        queryParams: this.returnUrl() ? { returnUrl: this.returnUrl() } : {},
      });
    } catch (e) {
      const code = (e as { code?: string })?.code;
      this.errorMessage.set(
        (code && this.errors.register.codes[code]) || this.errors.register.fallback
      );
    }
  }

  async withGoogle(): Promise<void> {
    this.errorMessage.set('');
    try {
      await this.auth.signInWithGoogle();
      await this.router.navigateByUrl(this.returnUrl() || '/app/library');
    } catch (e) {
      this.errorMessage.set(
        e instanceof Error && e.message === 'backend-unreachable'
          ? this.errors.backendUnreachable
          : this.t.errors.google
      );
    }
  }
}
