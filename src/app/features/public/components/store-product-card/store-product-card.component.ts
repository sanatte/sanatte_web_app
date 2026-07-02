import { Component, input, output, computed, inject } from '@angular/core';
import { MoneyPipe } from '../../../../shared/pipes/money.pipe';
import { RouterLink } from '@angular/router';
import { Product, getPrimaryImage } from '../../../administration/models/product.model';
import { StoreContextService } from '../../services/store-context.service';

const TYPE_LABEL: Record<string, string> = {
  physical: 'Físico', digital: 'Digital', subscription: 'Suscripción',
};

/**
 * StoreProductCard — tarjeta de producto para el catálogo público.
 * Imagen (gradiente), badge de tipo, nombre, precio y CTA (ver / agregar).
 */
@Component({
  selector: 'app-store-product-card',
  imports: [MoneyPipe, RouterLink],
  template: `
    <div class="group bg-surface-container-lowest rounded-lg overflow-hidden shadow-card
                hover:shadow-[0px_20px_40px_rgba(76,29,149,0.1)] transition-all flex flex-col">
      <!-- Imagen -->
      <a [routerLink]="ctx.productLink(product().id)" class="block relative aspect-[4/3] overflow-hidden
             bg-gradient-to-br {{ gradient() }}">
        <div class="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors"></div>
        <span class="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full
                     text-[10px] font-heading font-bold uppercase tracking-wider text-primary">
          {{ typeLabel() }}
        </span>
      </a>
      <!-- Body -->
      <div class="p-5 flex-1 flex flex-col">
        <a [routerLink]="ctx.productLink(product().id)" class="block">
          <h3 class="font-heading font-bold text-on-surface hover:text-primary transition-colors line-clamp-1">
            {{ product().name }}
          </h3>
        </a>
        <p class="font-sans text-label-md text-on-surface-variant line-clamp-2 mt-1 flex-1">
          {{ product().description }}
        </p>
        <div class="flex items-center justify-between mt-4">
          <p class="font-heading font-bold text-primary text-lg">
            {{ product().price | money }}
            @if (product().type === 'subscription') {
              <span class="text-label-sm text-on-surface-variant font-sans">
                {{ product().billingPeriod === 'annual' ? '/año' : '/mes' }}
              </span>
            }
          </p>
          <button (click)="add.emit(product())"
                  class="w-10 h-10 rounded-full gradient-primary text-white flex items-center justify-center
                         hover:opacity-90 active:scale-95 transition-all shadow-md"
                  title="Agregar al carrito">
            <span class="material-symbols-outlined text-[20px]">add_shopping_cart</span>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class StoreProductCardComponent {
  readonly ctx = inject(StoreContextService);

  readonly product = input.required<Product>();
  readonly add     = output<Product>();

  readonly gradient  = computed(() => getPrimaryImage(this.product())?.gradient ?? 'from-violet-400 to-purple-600');
  readonly typeLabel = computed(() => TYPE_LABEL[this.product().type] ?? this.product().type);
}
