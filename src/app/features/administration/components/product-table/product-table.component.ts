import { Component, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { Product, ProductType, AccessType, getPrimaryImage } from '../../models/product.model';
import { TEXTS } from '../../../../core/i18n/texts';

const PRODUCT_TEXTS = TEXTS.admin.products;

interface TypeConfig  { label: string; classes: string; }
interface AccessConfig { label: string; icon: string; classes: string; }

const TYPE_CONFIG: Record<ProductType, TypeConfig> = {
  physical:     { label: PRODUCT_TEXTS.types.physical,     classes: 'bg-secondary-fixed text-on-secondary-fixed-variant' },
  digital:      { label: PRODUCT_TEXTS.types.digital,      classes: 'bg-surface-variant text-on-surface-variant' },
  subscription: { label: PRODUCT_TEXTS.types.subscription, classes: 'bg-primary-fixed text-on-primary-fixed-variant' },
};

const ACCESS_CONFIG: Record<AccessType, AccessConfig> = {
  qr_activation:   { label: PRODUCT_TEXTS.accessTypes.qr_activation,   icon: 'qr_code_scanner', classes: 'text-secondary' },
  direct_purchase: { label: PRODUCT_TEXTS.accessTypes.direct_purchase, icon: 'shopping_bag',    classes: 'text-on-surface-variant' },
  subscription:    { label: PRODUCT_TEXTS.accessTypes.subscription,    icon: 'autorenew',       classes: 'text-primary' },
};

@Component({
  selector: 'app-product-table',
  imports: [DecimalPipe, RouterLink, StatusBadgeComponent, PaginationComponent],
  templateUrl: './product-table.component.html',
})
export class ProductTableComponent {
  protected readonly t = PRODUCT_TEXTS;
  protected readonly c = TEXTS.common;

  readonly products   = input.required<Product[]>();
  readonly totalItems = input.required<number>();
  readonly currentPage = input.required<number>();
  readonly pageSize    = input<number>(8);

  readonly editProduct   = output<Product>();
  readonly deleteProduct = output<Product>();
  readonly pageChange    = output<number>();

  typeConfig    = (t: ProductType)  => TYPE_CONFIG[t];
  accessConfig  = (a: AccessType)  => ACCESS_CONFIG[a];
  primaryImage  = (p: Product)     => getPrimaryImage(p);

  contentCount(product: Product): number {
    return product.entitlements.filter((e) => e.type === 'content_item').length;
  }

  priceLabel(product: Product): string {
    if (product.type === 'subscription') {
      return `$${product.price.toFixed(2)}/${this.t.billingPeriods[product.billingPeriod ?? 'annual']}`;
    }
    return `$${product.price.toFixed(2)}`;
  }

  salesLabel(product: Product): string {
    return `${product.salesCount} ${this.t.salesUnits[product.type]}`;
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems() / this.pageSize());
  }
}
