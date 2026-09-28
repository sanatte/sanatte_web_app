import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TEXTS } from '../../../../core/i18n/texts';

@Component({
  selector: 'app-auth-shell',
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-surface flex flex-col items-center justify-center
                px-container-padding-mobile py-10 relative overflow-hidden">
      <div class="absolute -top-32 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem]
                  bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div class="relative z-10 w-full max-w-md">
        <div class="glass-card rounded-lg p-6 md:p-8 transition-all duration-500
                    hover:shadow-[0px_20px_50px_rgb(var(--color-shadow) / 0.10)]">
          <div class="flex justify-center" style="margin-top:-40px;margin-bottom:-40px;">
            <a routerLink="/" [title]="t.homeLink">
              <img src="images/logo.png" [alt]="t.logoAlt" style="height:200px;width:auto;" />
            </a>
          </div>
          <ng-content />
        </div>

        <div class="flex justify-center gap-2 mt-8 opacity-60">
          <div class="w-2 h-2 rounded-full bg-primary/30"></div>
          <div class="w-2 h-2 rounded-full bg-primary/60"></div>
          <div class="w-2 h-2 rounded-full bg-primary/30"></div>
        </div>

        <p class="text-center text-label-sm font-heading text-outline uppercase tracking-widest mt-6">
          {{ t.copyright }}
        </p>
      </div>
    </div>
  `,
})
export class AuthShellComponent {
  protected readonly t = TEXTS.auth.shell;

  readonly icon = input('spa');
}
