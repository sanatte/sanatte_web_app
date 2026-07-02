import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { EntitlementService } from '../../services/entitlement.service';
import { ResourceService } from '../../services/resource.service';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Product, ProductImage, getPrimaryImage } from '../../models/product.model';
import { Resource, ResourceType, RESOURCE_TYPE_META } from '../../models/resource.model';

@Component({
  selector: 'app-admin-product-detail',
  imports: [RouterLink, CurrencyPipe, DecimalPipe, StatusBadgeComponent, ConfirmDialogComponent],
  templateUrl: './admin-product-detail.component.html',
})
export class AdminProductDetailComponent implements OnInit {
  private readonly route              = inject(ActivatedRoute);
  private readonly service            = inject(ProductService);
  private readonly entitlementService = inject(EntitlementService);
  private readonly resourceService    = inject(ResourceService);

  readonly product         = signal<Product | null>(null);
  readonly selectedImage   = signal<ProductImage | null>(null);
  readonly isConfirmOpen   = signal(false);
  readonly isPickerOpen    = signal(false);

  readonly linkedResources = computed<Resource[]>(() => {
    const p = this.product();
    return p ? this.entitlementService.getResourcesForProduct(p) : [];
  });

  readonly entitlementCount = computed(() => {
    const p = this.product();
    return p ? this.entitlementService.getContentCount(p) : 0;
  });

  // Recursos disponibles para agregar (los que aún no están vinculados)
  readonly availableResources = computed(() => {
    const linked = new Set(this.linkedResources().map((r) => r.id));
    return this.resourceService.resources().filter((r) => !linked.has(r.id));
  });


  readonly primaryImage = computed(() =>
    this.product() ? getPrimaryImage(this.product()!) ?? null : null
  );

  readonly displayImage = computed(() =>
    this.selectedImage() ?? this.primaryImage()
  );

  readonly typeLabel = computed(() => {
    const t = this.product()?.type;
    return t === 'physical' ? 'Físico' : t === 'subscription' ? 'Suscripción' : 'Digital';
  });

  readonly typeClasses = computed(() => {
    const t = this.product()?.type;
    return t === 'physical'
      ? 'bg-secondary-fixed text-on-secondary-fixed-variant'
      : t === 'subscription'
      ? 'bg-primary-fixed text-on-primary-fixed-variant'
      : 'bg-surface-variant text-on-surface-variant';
  });

  resourceIcon = (type: string) => RESOURCE_TYPE_META[type as ResourceType]?.icon ?? 'description';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const p = this.service.getById(id);
      this.product.set(p ?? null);
    }
  }

  selectImage(img: ProductImage): void {
    this.selectedImage.set(img);
  }

  setPrimary(img: ProductImage): void {
    const p = this.product();
    if (!p) return;
    this.service.setPrimaryImage(p.id, img.id);
    this.product.set(this.service.getById(p.id) ?? null);
    this.selectedImage.set(null);
  }

  removeImage(img: ProductImage): void {
    const p = this.product();
    if (!p || p.images.length <= 1) return;
    this.service.removeImage(p.id, img.id);
    this.product.set(this.service.getById(p.id) ?? null);
    this.selectedImage.set(null);
  }

  toggleStatus(): void {
    const p = this.product();
    if (!p) return;
    this.service.update(p.id, { status: p.status === 'active' ? 'inactive' : 'active' });
    this.product.set(this.service.getById(p.id) ?? null);
  }

  addResource(resource: Resource): void {
    const p = this.product();
    if (!p) return;
    this.service.addResourceEntitlement(p.id, resource);
    this.product.set(this.service.getById(p.id) ?? null);
    this.isPickerOpen.set(false);
  }

  removeResource(resourceId: string): void {
    const p = this.product();
    if (!p) return;
    this.service.removeResourceEntitlement(p.id, resourceId);
    this.product.set(this.service.getById(p.id) ?? null);
  }

  confirmDelete(): void {
    const p = this.product();
    if (p) this.service.delete(p.id);
    this.isConfirmOpen.set(false);
  }
}
