import { Component, inject, computed } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { MockAuthService } from '../../../../core/services/mock-auth.service';
import { UserLibraryService } from '../../services/user-library.service';
import { DailyFocusCardComponent } from '../../components/daily-focus-card/daily-focus-card.component';
import { WeeklyProgressCardComponent } from '../../components/weekly-progress-card/weekly-progress-card.component';
import { OwnedProductCardComponent } from '../../components/owned-product-card/owned-product-card.component';
import { OwnedProduct } from '../../models/user-library.model';

@Component({
  selector: 'app-library-home',
  imports: [
    RouterLink,
    DailyFocusCardComponent,
    WeeklyProgressCardComponent,
    OwnedProductCardComponent,
  ],
  template: `
    <div class="space-y-section-gap max-w-7xl mx-auto w-full">
      <!-- Bienvenida -->
      <section class="space-y-unit">
        <h3 class="font-heading text-headline-lg text-on-surface">
          Hola, <span class="text-primary">{{ firstName() }}</span>
        </h3>
        <p class="font-sans text-body-lg text-on-surface-variant max-w-2xl">
          Qué alegría tenerte de vuelta. Tu camino hacia el bienestar continúa justo donde lo dejaste.
        </p>
      </section>

      @if (hasProducts()) {
        <!-- Bento: Enfoque del día + Progreso semanal -->
        <section class="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          <app-daily-focus-card [focus]="dailyFocus" (start)="onStartFocus()" />
          <app-weekly-progress-card [progress]="weeklyProgress" />
        </section>

        <!-- Mis Productos -->
        <section class="space-y-gutter">
          <div class="flex items-center justify-between">
            <h3 class="font-heading text-headline-md text-on-surface">Mis Productos</h3>
            <a routerLink="/app/activate"
               class="flex items-center gap-1.5 text-primary font-bold font-label-md hover:underline">
              <span class="material-symbols-outlined text-[18px]">qr_code_scanner</span>
              Activar producto
            </a>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            @for (owned of ownedProducts(); track owned.product.id) {
              <app-owned-product-card
                [owned]="owned"
                (open)="onOpenProduct($event)"
                (continue)="onContinue($event)" />
            }
          </div>
        </section>
      } @else {
        <!-- Estado vacío: usuario sin productos activados -->
        <section class="glass-card rounded-lg p-12 text-center max-w-2xl mx-auto mt-8">
          <div class="w-20 h-20 rounded-full bg-primary-fixed flex items-center justify-center mx-auto mb-6">
            <span class="material-symbols-outlined text-primary text-[40px]">auto_stories</span>
          </div>
          <h3 class="font-heading text-headline-md text-on-surface mb-2">
            Tu biblioteca está lista para comenzar
          </h3>
          <p class="font-sans text-body-md text-on-surface-variant max-w-md mx-auto mb-8">
            Activa un producto físico escaneando su código QR, o explora el catálogo para
            descubrir recursos de bienestar.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a routerLink="/app/activate"
               class="px-8 py-3 rounded-full bg-primary text-white font-heading font-bold
                      flex items-center gap-2 hover:bg-primary/90 transition-colors active:scale-95">
              <span class="material-symbols-outlined">qr_code_scanner</span>
              Activar producto
            </a>
            <a routerLink="/app/products"
               class="px-8 py-3 rounded-full bg-surface-container-high text-primary font-heading
                      font-bold hover:bg-surface-container-highest transition-colors">
              Ver catálogo
            </a>
          </div>
        </section>
      }
    </div>
  `,
})
export class LibraryHomeComponent {
  private readonly auth    = inject(MockAuthService);
  private readonly library = inject(UserLibraryService);
  private readonly router  = inject(Router);

  readonly ownedProducts = this.library.ownedProducts;
  readonly hasProducts   = this.library.hasProducts;
  readonly dailyFocus    = this.library.dailyFocus;
  readonly weeklyProgress = this.library.weeklyProgress;

  readonly firstName = computed(() => {
    const name = this.auth.currentUser()?.displayName ?? 'Bienvenido';
    return name.charAt(0).toUpperCase() + name.slice(1);
  });

  onStartFocus(): void {
    // Abre el recurso destacado dentro de su primer producto contenedor (si existe).
    const resId = this.dailyFocus.resourceId;
    const owner = resId
      ? this.ownedProducts().find((o) =>
          o.product.entitlements.some((e) => e.referenceId === resId)
        )
      : undefined;
    if (owner && resId) {
      this.router.navigate(['/app/library', owner.product.id, resId]);
    }
  }

  onOpenProduct(owned: OwnedProduct): void {
    this.router.navigate(['/app/library', owned.product.id]);
  }

  onContinue(owned: OwnedProduct): void {
    // Abre el visor del producto (elige el primer recurso automáticamente).
    this.router.navigate(['/app/library', owned.product.id]);
  }
}
