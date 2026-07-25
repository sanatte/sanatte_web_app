import { Component, input, output, computed } from '@angular/core';
import { OwnedProduct } from '../../models/user-library.model';
import { getPrimaryImage } from '../../../administration/models/product.model';

/**
 * OwnedProductCard — tarjeta de un producto que el usuario posee. Abre el producto
 * (y sus recursos). El progreso/gamificación llegará con el tracking de consumo.
 */
@Component({
  selector: 'app-owned-product-card',
  template: `
    <div class="group bg-white rounded-lg overflow-hidden flex flex-col shadow-card
                hover:shadow-[0px_20px_40px_rgba(76,29,149,0.1)] transition-all cursor-pointer"
         (click)="open.emit(owned())">
      <!-- Thumbnail: foto real si existe, gradiente como fallback -->
      <div class="relative aspect-video overflow-hidden">
        @if (imageUrl(); as url) {
          <img [src]="url" [alt]="owned().product.name"
               class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
        } @else {
          <div class="absolute inset-0 bg-gradient-to-br {{ imageGradient() }}"></div>
        }
        <div class="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors"></div>
        <span class="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-full
                     font-bold text-[10px] uppercase tracking-tighter"
              [class]="owned().categoryTone === 'secondary' ? 'text-secondary' : 'text-primary'">
          {{ owned().categoryLabel }}
        </span>
      </div>

      <!-- Body -->
      <div class="p-5 flex-1 flex flex-col">
        <div class="space-y-1 min-w-0 flex-1">
          <h4 class="font-heading font-semibold text-on-surface line-clamp-1">
            {{ owned().product.name }}
          </h4>
          <p class="font-sans text-label-md text-on-surface-variant line-clamp-2">
            {{ owned().product.description }}
          </p>
        </div>

        <div class="mt-4 flex justify-end pt-3 border-t border-outline-variant/10">
          <button class="px-4 py-1.5 rounded-full bg-primary text-white font-heading font-bold
                         text-label-sm hover:bg-primary/90 transition-colors active:scale-95"
                  (click)="open.emit(owned()); $event.stopPropagation()">
            Abrir
          </button>
        </div>
      </div>
    </div>
  `,
})
export class OwnedProductCardComponent {
  readonly owned = input.required<OwnedProduct>();
  readonly open  = output<OwnedProduct>();

  readonly imageUrl = computed(() => getPrimaryImage(this.owned().product)?.url ?? null);
  readonly imageGradient = computed(
    () => getPrimaryImage(this.owned().product)?.gradient ?? 'from-violet-400 to-purple-600'
  );
}
