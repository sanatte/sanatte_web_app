import { Component, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { Product, ProductType, AccessType, ResourceType, getPrimaryImage } from '../../models/product.model';

interface TypeConfig  { label: string; classes: string; }
interface AccessConfig { label: string; icon: string; classes: string; }

const TYPE_CONFIG: Record<ProductType, TypeConfig> = {
  physical:     { label: 'Físico',       classes: 'bg-secondary-fixed text-on-secondary-fixed-variant' },
  digital:      { label: 'Digital',      classes: 'bg-surface-variant text-on-surface-variant' },
  subscription: { label: 'Suscripción',  classes: 'bg-primary-fixed text-on-primary-fixed-variant' },
};

const ACCESS_CONFIG: Record<AccessType, AccessConfig> = {
  qr_activation:   { label: 'QR + Activación', icon: 'qr_code_scanner', classes: 'text-secondary' },
  direct_purchase: { label: 'Compra directa',  icon: 'shopping_bag',    classes: 'text-on-surface-variant' },
  subscription:    { label: 'Suscripción',      icon: 'autorenew',       classes: 'text-primary' },
};

const RESOURCE_ICONS: Record<ResourceType, string> = {
  audio: 'headphones', video: 'videocam', pdf: 'picture_as_pdf', article: 'article',
};

@Component({
  selector: 'app-product-table',
  imports: [DecimalPipe, RouterLink, StatusBadgeComponent, PaginationComponent],
  templateUrl: './product-table.component.html',
})
export class ProductTableComponent {
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

  resourceSummary(product: Product): { icon: string; count: number }[] {
    const countByType = product.resources.reduce((acc, r) => {
      acc[r.type] = (acc[r.type] ?? 0) + 1;
      return acc;
    }, {} as Record<ResourceType, number>);

    return (Object.entries(countByType) as [ResourceType, number][])
      .map(([type, count]) => ({ icon: RESOURCE_ICONS[type], count }));
  }

  priceLabel(product: Product): string {
    if (product.type === 'subscription') {
      return `$${product.price.toFixed(2)}/${product.billingPeriod === 'monthly' ? 'mes' : 'año'}`;
    }
    return `$${product.price.toFixed(2)}`;
  }

  salesLabel(product: Product): string {
    if (product.type === 'physical')     return `${product.salesCount} activadas`;
    if (product.type === 'subscription') return `${product.salesCount} activos`;
    return `${product.salesCount} vendidos`;
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems() / this.pageSize());
  }
}
