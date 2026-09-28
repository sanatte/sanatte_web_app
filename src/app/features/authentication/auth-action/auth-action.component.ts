import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthShellComponent } from '../components/auth-shell/auth-shell.component';
import { TEXTS } from '../../../core/i18n/texts';

@Component({
  selector: 'app-auth-action',
  imports: [AuthShellComponent],
  template: `
    <app-auth-shell icon="link">
      <div class="text-center py-6">
        @if (invalid()) {
          <div class="w-16 h-16 rounded-full bg-error-container flex items-center justify-center mx-auto mb-4">
            <span class="material-symbols-outlined text-error text-[34px]">link_off</span>
          </div>
          <h1 class="font-heading text-headline-md text-on-surface mb-2">{{ t.invalid.title }}</h1>
          <p class="font-sans text-body-md text-on-surface-variant mb-6">
            {{ t.invalid.message }}
          </p>
          <button (click)="toLogin()"
                  class="w-full py-3.5 rounded-full gradient-primary text-white font-heading font-bold
                         hover:opacity-90 active:scale-95 transition-all">
            {{ t.invalid.cta }}
          </button>
        } @else {
          <span class="material-symbols-outlined animate-spin text-primary text-[40px]">progress_activity</span>
          <p class="font-sans text-body-md text-on-surface-variant mt-4">{{ c.actions.processing }}</p>
        }
      </div>
    </app-auth-shell>
  `,
})
export class AuthActionComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly t = TEXTS.auth.authAction;
  protected readonly c = TEXTS.common;

  readonly invalid = signal(false);

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    const mode = params.get('mode');
    const oobCode = params.get('oobCode') ?? '';
    const continueUrl = params.get('continueUrl');
    const returnUrl = continueUrl ? this.extractReturnUrl(continueUrl) : '';

    if (!oobCode) { this.invalid.set(true); return; }

    switch (mode) {
      case 'resetPassword':
        this.router.navigate(['/auth/reset'], { queryParams: { oobCode, ...(returnUrl && { returnUrl }) } });
        break;
      case 'verifyEmail':
        this.router.navigate(['/auth/verified'], { queryParams: { oobCode, ...(returnUrl && { returnUrl }) } });
        break;
      default:
        this.invalid.set(true);
    }
  }

  private extractReturnUrl(continueUrl: string): string {
    try {
      return new URL(continueUrl).searchParams.get('returnUrl') ?? '';
    } catch {
      return '';
    }
  }

  toLogin(): void { this.router.navigate(['/auth/login']); }
}
