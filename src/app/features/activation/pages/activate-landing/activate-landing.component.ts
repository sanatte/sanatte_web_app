import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { TEXTS } from '../../../../core/i18n/texts';

@Component({
  selector: 'app-activate-landing',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-surface flex flex-col items-center justify-center
                px-6 py-12 font-heading">

      <div class="flex flex-col items-center gap-3 mb-10">
        <img src="/images/flor_isotipo.png" [alt]="t.logoAlt" class="w-16 h-16" />
        <img src="/images/sanatte_wellness.png" [alt]="t.wordmarkAlt" class="h-10" />
      </div>

      <div class="text-center max-w-sm mb-10">
        <h1 class="text-headline-lg text-on-surface font-extrabold leading-tight mb-4">
          {{ t.titleLine1 }}<br>{{ t.titleLine2 }}
        </h1>
        <p class="text-body-md text-on-surface-variant leading-relaxed">
          {{ t.description }}
        </p>
      </div>

      <div class="w-full max-w-xs flex flex-col gap-3 mb-8">
        <a [routerLink]="['/auth/register']"
           [queryParams]="{ returnUrl: returnUrl }"
           class="w-full py-4 rounded-full text-center text-white font-bold text-body-md
                  bg-primary hover:bg-primary-dark active:scale-[0.98] transition-all
                  shadow-primary-lg">
          {{ t.register }}
        </a>

        <a [routerLink]="['/auth/login']"
           [queryParams]="{ returnUrl: returnUrl }"
           class="w-full py-4 rounded-full text-center text-primary font-bold text-body-md
                  border-2 border-primary hover:bg-primary/5 active:scale-[0.98] transition-all">
          {{ t.login }}
        </a>
      </div>

      <div class="flex items-center gap-3 w-full max-w-xs mb-7">
        <div class="flex-1 h-px bg-outline-variant"></div>
        <span class="text-label-sm text-outline">{{ t.divider }}</span>
        <div class="flex-1 h-px bg-outline-variant"></div>
      </div>

      <div class="flex gap-3 mb-10">
        <a href="https://apps.apple.com" target="_blank" rel="noopener"
           class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-950 text-white
                  hover:bg-brand-800 active:scale-[0.97] transition-all">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          <div class="text-left leading-tight">
            <div class="text-[9px] opacity-70 font-normal">{{ t.appStore.caption }}</div>
            <div class="text-label-md font-bold">{{ t.appStore.name }}</div>
          </div>
        </a>

        <a href="https://play.google.com" target="_blank" rel="noopener"
           class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-950 text-white
                  hover:bg-brand-800 active:scale-[0.97] transition-all">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 20.5v-17c0-.83.94-1.3 1.6-.8l14 8.5c.6.36.6 1.24 0 1.6l-14 8.5c-.66.5-1.6.03-1.6-.8zm2-3.15L16.01 12 5 6.65v10.7z"/>
          </svg>
          <div class="text-left leading-tight">
            <div class="text-[9px] opacity-70 font-normal">{{ t.googlePlay.caption }}</div>
            <div class="text-label-md font-bold">{{ t.googlePlay.name }}</div>
          </div>
        </a>
      </div>

      <p class="text-label-sm text-outline">{{ t.footer }}</p>

    </div>
  `,
})
export class ActivateLandingComponent {
  protected readonly t = TEXTS.app.activation.landing;
  protected readonly returnUrl: string;

  constructor() {
    const route  = inject(ActivatedRoute);
    const router = inject(Router);
    const auth   = inject(AuthService);

    const code = route.snapshot.queryParamMap.get('code') ?? '';
    this.returnUrl = `/app/activate${code ? `?code=${encodeURIComponent(code)}` : ''}`;

    if (auth.isAuthenticated()) {
      router.navigate(['/app/activate'], {
        queryParams: code ? { code } : {},
        replaceUrl: true,
      });
    }
  }
}
