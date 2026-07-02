import { Component, input, output, computed } from '@angular/core';
import { CircularProgressComponent } from '../../../../shared/components/circular-progress/circular-progress.component';
import { OwnedProduct } from '../../models/user-library.model';
import { getPrimaryImage } from '../../../administration/models/product.model';

/**
 * OwnedProductCard — tarjeta de producto adquirido con anillo de progreso.
 * CTA contextual: "Continuar" (en progreso) · "Repasar" (completado) · "Empezar" (nuevo).
 * Tamaño moderado, alineado con ResourceCard (aspect-video + p-5).
 */
@Component({
  selector: 'app-owned-product-card',
  imports: [CircularProgressComponent],
  template: `
    <div class="group bg-white rounded-lg overflow-hidden flex flex-col shadow-card
                hover:shadow-[0px_20px_40px_rgba(76,29,149,0.1)] transition-all cursor-pointer"
         (click)="open.emit(owned())">
      <!-- Thumbnail (gradiente placeholder) -->
      <div class="relative aspect-video overflow-hidden bg-gradient-to-br {{ imageGradient() }}">
        <div class="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors"></div>
        <span class="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-full
                     font-bold text-[10px] uppercase tracking-tighter"
              [class]="owned().categoryTone === 'secondary' ? 'text-secondary' : 'text-primary'">
          {{ owned().categoryLabel }}
        </span>
      </div>

      <!-- Body -->
      <div class="p-5 flex-1 flex flex-col">
        <div class="flex justify-between items-start gap-3">
          <div class="space-y-1 min-w-0">
            <h4 class="font-heading font-semibold text-on-surface line-clamp-1">
              {{ owned().product.name }}
            </h4>
            <p class="font-sans text-label-md text-on-surface-variant line-clamp-2">
              {{ owned().product.description }}
            </p>
          </div>
          <app-circular-progress [value]="owned().progress" [size]="40" />
        </div>

        <div class="mt-4 flex items-center justify-between pt-3 border-t border-outline-variant/10">
          @if (owned().status === 'completed') {
            <span class="text-label-sm text-on-surface-variant flex items-center gap-1">
              <span class="material-symbols-outlined text-primary text-[15px]">check_circle</span>
              Completado
            </span>
            <button class="px-4 py-1.5 rounded-full bg-surface-container-high text-primary font-heading
                           font-bold text-label-sm hover:bg-surface-container-highest transition-colors active:scale-95"
                    (click)="continue.emit(owned()); $event.stopPropagation()">
              {{ ctaLabel() }}
            </button>
          } @else {
            <span class="text-label-sm text-on-surface-variant">{{ owned().progress }}% completado</span>
            <button class="px-4 py-1.5 rounded-full bg-primary text-white font-heading font-bold
                           text-label-sm hover:bg-primary/90 transition-colors active:scale-95"
                    (click)="continue.emit(owned()); $event.stopPropagation()">
              {{ ctaLabel() }}
            </button>
          }
        </div>
      </div>
    </div>
  `,
})
export class OwnedProductCardComponent {
  readonly owned = input.required<OwnedProduct>();
  readonly open     = output<OwnedProduct>();
  readonly continue = output<OwnedProduct>();

  readonly imageGradient = computed(
    () => getPrimaryImage(this.owned().product)?.gradient ?? 'from-violet-400 to-purple-600'
  );

  readonly ctaLabel = computed(() => {
    switch (this.owned().status) {
      case 'completed':   return 'Repasar';
      case 'in_progress': return 'Continuar';
      default:            return 'Empezar';
    }
  });
}
