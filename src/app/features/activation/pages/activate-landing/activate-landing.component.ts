import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-activate-landing',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-[#faf7f2] flex flex-col items-center justify-center
                px-6 py-12 font-heading">

      <!-- Logo -->
      <div class="flex flex-col items-center gap-3 mb-10">
        <img src="/images/flor_isotipo.png" alt="Sanatte" class="w-16 h-16" />
        <img src="/images/sanatte_wellness.png" alt="Sanatte Wellness Ecosystem" class="h-10" />
      </div>

      <!-- Headline -->
      <div class="text-center max-w-sm mb-10">
        <h1 class="text-headline-lg text-[#1e1b2e] font-extrabold leading-tight mb-4">
          ¡Tu producto está<br>listo para activar!
        </h1>
        <p class="text-body-md text-[#5a556a] leading-relaxed">
          Crea tu cuenta o inicia sesión para acceder a tu biblioteca digital de
          meditaciones, ejercicios y recursos de bienestar.
        </p>
      </div>

      <!-- CTAs principales -->
      <div class="w-full max-w-xs flex flex-col gap-3 mb-8">
        <a [routerLink]="['/auth/register']"
           [queryParams]="{ returnUrl: returnUrl }"
           class="w-full py-4 rounded-full text-center text-white font-bold text-body-md
                  bg-[#6b38d4] hover:bg-[#5a2ec0] active:scale-[0.98] transition-all
                  shadow-[0px_8px_24px_rgba(107,56,212,0.28)]">
          Crear cuenta gratuita
        </a>

        <a [routerLink]="['/auth/login']"
           [queryParams]="{ returnUrl: returnUrl }"
           class="w-full py-4 rounded-full text-center text-[#6b38d4] font-bold text-body-md
                  border-2 border-[#6b38d4] hover:bg-[#6b38d4]/5 active:scale-[0.98] transition-all">
          Ya tengo cuenta
        </a>
      </div>

      <!-- Divider -->
      <div class="flex items-center gap-3 w-full max-w-xs mb-7">
        <div class="flex-1 h-px bg-[#d8d0e8]"></div>
        <span class="text-label-sm text-[#9492a3]">o activa desde la app</span>
        <div class="flex-1 h-px bg-[#d8d0e8]"></div>
      </div>

      <!-- App Store links -->
      <div class="flex gap-3 mb-10">
        <a href="https://apps.apple.com" target="_blank" rel="noopener"
           class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1e1b2e] text-white
                  hover:bg-[#2e2a45] active:scale-[0.97] transition-all">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          <div class="text-left leading-tight">
            <div class="text-[9px] opacity-70 font-normal">Descargar en</div>
            <div class="text-label-md font-bold">App Store</div>
          </div>
        </a>

        <a href="https://play.google.com" target="_blank" rel="noopener"
           class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1e1b2e] text-white
                  hover:bg-[#2e2a45] active:scale-[0.97] transition-all">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 20.5v-17c0-.83.94-1.3 1.6-.8l14 8.5c.6.36.6 1.24 0 1.6l-14 8.5c-.66.5-1.6.03-1.6-.8zm2-3.15L16.01 12 5 6.65v10.7z"/>
          </svg>
          <div class="text-left leading-tight">
            <div class="text-[9px] opacity-70 font-normal">Disponible en</div>
            <div class="text-label-md font-bold">Google Play</div>
          </div>
        </a>
      </div>

      <!-- Footer -->
      <p class="text-label-sm text-[#9492a3]">sanatte.com</p>

    </div>
  `,
})
export class ActivateLandingComponent {
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
