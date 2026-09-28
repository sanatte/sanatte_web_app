import { Component, inject, computed } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { UserLibraryService } from '../../services/user-library.service';
import { OwnedProductCardComponent } from '../../components/owned-product-card/owned-product-card.component';
import { OwnedProduct } from '../../models/user-library.model';
import { TEXTS } from '../../../../core/i18n/texts';

@Component({
  selector: 'app-library-home',
  imports: [RouterLink, OwnedProductCardComponent],
  template: `
    <div class="space-y-section-gap max-w-7xl mx-auto w-full">
      <section class="space-y-unit">
        <h3 class="font-heading text-headline-lg text-on-surface">
          {{ t.greeting }} <span class="text-primary">{{ firstName() }}</span>
        </h3>
        <p class="font-sans text-body-lg text-on-surface-variant max-w-2xl">
          {{ t.subtitle }}
        </p>
      </section>

      @if (hasProducts()) {
        <section class="space-y-gutter">
          <div class="flex items-center justify-between">
            <h3 class="font-heading text-headline-md text-on-surface">{{ t.myProducts }}</h3>
            <a routerLink="/app/activate"
               class="flex items-center gap-1.5 text-primary font-bold text-label-md hover:underline">
              <span class="material-symbols-outlined text-[18px]">qr_code_scanner</span>
              {{ t.activateProduct }}
            </a>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            @for (owned of ownedProducts(); track owned.product.id) {
              <app-owned-product-card [owned]="owned" (open)="onOpenProduct($event)" />
            }
          </div>
        </section>
      } @else {
        <section class="glass-card rounded-lg p-12 text-center max-w-2xl mx-auto mt-8">
          <div class="w-20 h-20 rounded-full bg-primary-fixed flex items-center justify-center mx-auto mb-6">
            <span class="material-symbols-outlined text-primary text-[40px]">auto_stories</span>
          </div>
          <h3 class="font-heading text-headline-md text-on-surface mb-2">
            {{ t.empty.title }}
          </h3>
          <p class="font-sans text-body-md text-on-surface-variant max-w-md mx-auto mb-8">
            {{ t.empty.description }}
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a routerLink="/app/activate"
               class="px-8 py-3 rounded-full bg-primary text-white font-heading font-bold
                      flex items-center gap-2 hover:bg-primary/90 transition-colors active:scale-95">
              <span class="material-symbols-outlined">qr_code_scanner</span>
              {{ t.activateProduct }}
            </a>
            <a routerLink="/app/products"
               class="px-8 py-3 rounded-full bg-surface-container-high text-primary font-heading
                      font-bold hover:bg-surface-container-highest transition-colors">
              {{ t.empty.browseCatalog }}
            </a>
          </div>
        </section>
      }
    </div>
  `,
})
export class LibraryHomeComponent {
  private readonly auth    = inject(AuthService);
  private readonly library = inject(UserLibraryService);
  private readonly router  = inject(Router);

  protected readonly t = TEXTS.app.library.home;

  readonly ownedProducts = this.library.ownedProducts;
  readonly hasProducts   = this.library.hasProducts;

  readonly firstName = computed(() => {
    const name = this.auth.currentUser()?.displayName ?? this.t.fallbackName;
    return name.charAt(0).toUpperCase() + name.slice(1);
  });

  onOpenProduct(owned: OwnedProduct): void {
    this.router.navigate(['/app/library', owned.product.id]);
  }
}
