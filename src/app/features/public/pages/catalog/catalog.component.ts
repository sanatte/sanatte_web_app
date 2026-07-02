import { Component, inject, signal, computed } from '@angular/core';
import { ProductService } from '../../../administration/services/product.service';
import { CartService } from '../../services/cart.service';
import { StoreProductCardComponent } from '../../components/store-product-card/store-product-card.component';
import { Product, ProductType } from '../../../administration/models/product.model';

type FilterKey = 'all' | ProductType;

@Component({
  selector: 'app-catalog',
  imports: [StoreProductCardComponent],
  template: `
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <header class="mb-8 text-center max-w-2xl mx-auto">
        <h1 class="font-heading text-headline-lg text-on-surface mb-3">Catálogo Sanatte</h1>
        <p class="font-sans text-body-lg text-on-surface-variant">
          Productos físicos, recursos digitales y suscripciones para tu bienestar.
        </p>
      </header>

      <!-- Buscador + filtros -->
      <div class="flex flex-col md:flex-row gap-gutter md:items-center justify-between mb-8">
        <div class="relative w-full md:w-96 group">
          <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline
                       group-focus-within:text-primary transition-colors">search</span>
          <input type="text" [value]="query()" (input)="query.set($any($event.target).value)"
                 placeholder="Buscar productos..."
                 class="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-transparent
                        focus:border-primary focus:ring-0 rounded-xl outline-none text-body-md
                        placeholder:text-outline-variant transition-colors" />
        </div>
        <div class="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 md:pb-0">
          @for (f of filters; track f.key) {
            <button (click)="activeFilter.set(f.key)"
                    class="px-4 py-2 rounded-full font-heading font-semibold text-label-md whitespace-nowrap transition-all"
                    [class]="activeFilter() === f.key
                      ? 'bg-primary text-white'
                      : 'border border-outline-variant text-on-surface-variant hover:bg-surface-container'">
              {{ f.label }}
            </button>
          }
        </div>
      </div>

      <!-- Grid -->
      @if (filtered().length > 0) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          @for (product of filtered(); track product.id) {
            <app-store-product-card [product]="product" (add)="addToCart($event)" />
          }
        </div>
      } @else {
        <div class="text-center py-16">
          <span class="material-symbols-outlined text-[40px] text-outline-variant block mb-2">search_off</span>
          <p class="font-heading text-on-surface-variant">Sin resultados para tu búsqueda.</p>
        </div>
      }

      <!-- Toast agregado -->
      @if (addedName()) {
        <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-on-surface text-white px-5 py-3
                    rounded-full shadow-xl flex items-center gap-2 text-label-md font-heading">
          <span class="material-symbols-outlined text-green-400 text-[18px]">check_circle</span>
          "{{ addedName() }}" agregado al carrito
        </div>
      }
    </div>
  `,
})
export class CatalogComponent {
  private readonly products = inject(ProductService);
  private readonly cart     = inject(CartService);

  readonly query        = signal('');
  readonly activeFilter = signal<FilterKey>('all');
  readonly addedName    = signal<string | null>(null);

  readonly filters: { key: FilterKey; label: string }[] = [
    { key: 'all',          label: 'Todos' },
    { key: 'physical',     label: 'Físicos' },
    { key: 'digital',      label: 'Digitales' },
    { key: 'subscription', label: 'Suscripciones' },
  ];

  readonly filtered = computed<Product[]>(() => {
    const q = this.query().trim().toLowerCase();
    const f = this.activeFilter();
    return this.products.products().filter((p) => {
      if (p.status !== 'active') return false;
      if (f !== 'all' && p.type !== f) return false;
      if (!q) return true;
      return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    });
  });

  addToCart(product: Product): void {
    this.cart.add(product.id);
    this.addedName.set(product.name);
    setTimeout(() => this.addedName.set(null), 2200);
  }
}
