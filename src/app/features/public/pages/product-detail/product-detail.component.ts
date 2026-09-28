import { Component, inject, signal, computed } from '@angular/core';
import { MoneyPipe } from '../../../../shared/pipes/money.pipe';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ProductService } from '../../../administration/services/product.service';
import { CartService } from '../../services/cart.service';
import { StoreContextService } from '../../services/store-context.service';
import { Product, ProductImage } from '../../../administration/models/product.model';
import { TEXTS } from '../../../../core/i18n/texts';

const HIGHLIGHT_ICONS = ['auto_awesome', 'qr_code_scanner', 'spa', 'workspace_premium'];

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, MoneyPipe, DecimalPipe],
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent {
  private readonly route    = inject(ActivatedRoute);
  private readonly router   = inject(Router);
  private readonly products = inject(ProductService);
  private readonly cart     = inject(CartService);
  readonly ctx              = inject(StoreContextService);

  protected readonly t = TEXTS.public.productDetail;

  private readonly id = toSignal(this.route.paramMap.pipe(map((p) => p.get('id'))), { initialValue: null });

  readonly loading = signal(true);

  readonly product = computed<Product | null>(() => {
    const id = this.id();
    return id ? this.products.getById(id) ?? null : null;
  });

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe(async (pm) => {
      const id = pm.get('id');
      if (!id) { this.loading.set(false); return; }
      this.loading.set(true);
      await this.products.fetchById(id);
      this.loading.set(false);
    });
  }

  readonly selectedImage = signal<ProductImage | null>(null);
  readonly displayImage = computed(() => {
    const p = this.product();
    if (!p) return null;
    return this.selectedImage() ?? p.images.find((i) => i.isPrimary) ?? p.images[0] ?? null;
  });

  readonly reviews = this.t.reviews.mock;
  readonly avgRating = computed(() =>
    this.reviews.reduce((s, r) => s + r.rating, 0) / this.reviews.length
  );

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
