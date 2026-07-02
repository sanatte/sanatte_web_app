import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ProductService } from '../../../administration/services/product.service';
import { CartService } from '../../services/cart.service';
import { StoreContextService } from '../../services/store-context.service';
import { Product, ProductImage } from '../../../administration/models/product.model';

interface Review { author: string; initials: string; rating: number; text: string; }

const HIGHLIGHT_ICONS = ['auto_awesome', 'qr_code_scanner', 'spa', 'workspace_premium'];

// Reviews mock (aún no en el modelo de datos).
const MOCK_REVIEWS: Review[] = [
  { author: 'Fiona M.',  initials: 'FM', rating: 5, text: 'La calidad del papel es increíble y el ritual de 90 días cambió mi mañana. La sincronización con la app es magia.' },
  { author: 'Julien L.', initials: 'JL', rating: 5, text: 'Integrar el QR con contenido de meditación se siente como el futuro del journaling.' },
  { author: 'Sarah A.',  initials: 'SA', rating: 4, text: 'Lo compré como regalo para mi hermana y el empaque fue impecable. La atención al detalle se nota.' },
];

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, CurrencyPipe, DecimalPipe],
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent {
  private readonly route    = inject(ActivatedRoute);
  private readonly router   = inject(Router);
  private readonly products = inject(ProductService);
  private readonly cart     = inject(CartService);
  readonly ctx              = inject(StoreContextService);

  private readonly id = toSignal(this.route.paramMap.pipe(map((p) => p.get('id'))), { initialValue: null });

  readonly product = computed<Product | null>(() => {
    const id = this.id();
    return id ? this.products.getById(id) ?? null : null;
  });

  readonly selectedImage = signal<ProductImage | null>(null);
  readonly displayImage = computed(() => {
    const p = this.product();
    if (!p) return null;
    return this.selectedImage() ?? p.images.find((i) => i.isPrimary) ?? p.images[0] ?? null;
  });

  readonly reviews = MOCK_REVIEWS;
  readonly avgRating = computed(() =>
    this.reviews.reduce((s, r) => s + r.rating, 0) / this.reviews.length
  );

  /** Highlights derivados de las primeras specs del producto. */
  readonly highlights = computed(() =>
    (this.product()?.specs ?? []).slice(0, 3).map((s, i) => ({
      icon: HIGHLIGHT_ICONS[i % HIGHLIGHT_ICONS.length],
      title: s.label,
      description: s.value,
    }))
  );

  readonly isSubscription = computed(() => this.product()?.type === 'subscription');
  readonly isPhysical     = computed(() => this.product()?.type === 'physical');

  readonly addedFlag = signal(false);

  selectImage(img: ProductImage): void { this.selectedImage.set(img); }

  addToCart(): void {
    const p = this.product();
    if (!p) return;
    this.cart.add(p.id);
    this.addedFlag.set(true);
    setTimeout(() => this.addedFlag.set(false), 2200);
  }

  buyNow(): void {
    const p = this.product();
    if (!p) return;
    this.cart.add(p.id);
    this.router.navigateByUrl(this.ctx.cartLink());
  }
}
