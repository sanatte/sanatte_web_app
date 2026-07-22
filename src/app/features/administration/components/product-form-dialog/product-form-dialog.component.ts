import { Component, input, output, effect, inject, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Product, ProductType } from '../../models/product.model';
import { Resource, ResourceType, RESOURCE_TYPE_META } from '../../models/resource.model';
import { ResourceService } from '../../services/resource.service';
import { ThousandsSeparatorDirective } from '../../../../shared/directives/thousands-separator.directive';

@Component({
  selector: 'app-product-form-dialog',
  imports: [ReactiveFormsModule, ThousandsSeparatorDirective],
  templateUrl: './product-form-dialog.component.html',
})
export class ProductFormDialogComponent {
  private readonly fb              = inject(FormBuilder);
  private readonly resourceService = inject(ResourceService);

  readonly isOpen       = input.required<boolean>();
  readonly product      = input<Product | null>(null);
  readonly saving       = input(false);
  readonly errorMessage = input('');

  readonly save   = output<Partial<Product>>();
  readonly cancel = output<void>();

  readonly form = this.fb.nonNullable.group({
    name:               ['', Validators.required],
    sku:                ['', Validators.required],
    type:               ['physical' as ProductType, Validators.required],
    price:              [0, [Validators.required, Validators.min(0.01)]],
    billingPeriod:      ['monthly'],
    stock:              [null as number | null],
    requiresActivation: [true],
    status:             ['active'],
    description:        ['', Validators.required],
    tags:               [''],
  });

  readonly isEditMode          = computed(() => this.product() !== null);
  readonly selectedType        = signal<ProductType>('physical');
  readonly selectedResourceIds = signal<Set<string>>(new Set());
  readonly allResources        = this.resourceService.resources;
  readonly resourceIcon        = (type: ResourceType) => RESOURCE_TYPE_META[type].icon;

  readonly selectedResources = computed(() =>
    this.allResources().filter((r) => this.selectedResourceIds().has(r.id))
  );

  constructor() {
    effect(() => {
      const p = this.product();
      if (p) {
        this.form.patchValue({
          name: p.name, sku: p.sku, type: p.type, price: p.price,
          billingPeriod: p.billingPeriod ?? 'monthly', stock: p.stock ?? null,
          requiresActivation: p.requiresActivation, status: p.status,
          description: p.description, tags: p.tags?.join(', ') ?? '',
        });
        this.selectedType.set(p.type);
        const ids = new Set(
          p.entitlements
            .filter((e) => e.type === 'content_item')
            .map((e) => e.referenceId)
        );
        this.selectedResourceIds.set(ids);
      } else {
        this.form.reset({
          name: '', sku: '', type: 'physical', price: 0,
          billingPeriod: 'monthly', stock: null,
          requiresActivation: true, status: 'active', description: '', tags: '',
        });
        this.selectedType.set('physical');
        this.selectedResourceIds.set(new Set());
      }
    });
  }

  toggleResource(resource: Resource): void {
    this.selectedResourceIds.update((set) => {
      const next = new Set(set);
      next.has(resource.id) ? next.delete(resource.id) : next.add(resource.id);
      return next;
    });
  }

  isResourceSelected(id: string): boolean {
    return this.selectedResourceIds().has(id);
  }

  onTypeChange(event: Event): void {
    const type = (event.target as HTMLSelectElement).value as ProductType;
    this.selectedType.set(type);
    this.form.patchValue({ requiresActivation: type === 'physical' });
  }

  generateSku(): void {
    const type = this.selectedType();
    const prefix = type === 'physical' ? 'WLN' : type === 'subscription' ? 'SUB' : 'DIG';
    const num = Math.floor(Math.random() * 900) + 100;
    this.form.patchValue({ sku: `${prefix}-${num}` });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const raw  = this.form.getRawValue();
    const type = raw.type as ProductType;

    // Las imágenes NO se gestionan aquí: se suben/eliminan en el detalle del
    // producto (endpoints dedicados de Firebase Storage). Este form solo maneja
    // los datos; así editar nunca pisa las fotos ya subidas.
    this.save.emit({
      name: raw.name, sku: raw.sku, type,
      price: Number(raw.price),
      billingPeriod: type === 'subscription' ? (raw.billingPeriod as any) : undefined,
      stock: raw.stock ?? undefined,
      requiresActivation: raw.requiresActivation,
      status: raw.status as any,
      description: raw.description,
      tags: raw.tags ? raw.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      accessType: type === 'physical' ? 'qr_activation'
                : type === 'subscription' ? 'subscription'
                : 'direct_purchase',
      entitlements: this.allResources()
        .filter((r) => this.selectedResourceIds().has(r.id))
        .map((r) => ({
          id: `ent-${r.id}`,
          type: 'content_item' as const,
          referenceId: r.id,
          label: r.title,
        })),
      specs: this.product()?.specs ?? [],
    });
  }
}
