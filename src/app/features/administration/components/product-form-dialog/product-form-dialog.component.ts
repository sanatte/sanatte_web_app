import { Component, input, output, effect, inject, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Product, ProductType, ProductImage } from '../../models/product.model';
import { Entitlement } from '../../models/entitlement.model';
import { Resource, ResourceType } from '../../models/resource.model';
import { ResourceService } from '../../services/resource.service';

const GRADIENT_PALETTE = [
  'from-violet-400 to-purple-600', 'from-indigo-400 to-violet-600',
  'from-rose-400 to-pink-600',     'from-emerald-400 to-teal-600',
  'from-sky-400 to-blue-600',      'from-amber-400 to-orange-500',
  'from-purple-300 to-indigo-500', 'from-teal-400 to-cyan-600',
];

const RESOURCE_ICONS: Record<ResourceType, string> = {
  audio: 'headphones', video: 'videocam', pdf: 'picture_as_pdf', article: 'description',
};

@Component({
  selector: 'app-product-form-dialog',
  imports: [ReactiveFormsModule],
  templateUrl: './product-form-dialog.component.html',
})
export class ProductFormDialogComponent {
  private readonly fb              = inject(FormBuilder);
  private readonly resourceService = inject(ResourceService);

  readonly isOpen  = input.required<boolean>();
  readonly product = input<Product | null>(null);

  readonly save   = output<Partial<Product>>();
  readonly cancel = output<void>();

  readonly images = signal<ProductImage[]>([]);

  readonly form = this.fb.nonNullable.group({
    name:               ['', Validators.required],
    sku:                ['', Validators.required],
    type:               ['physical' as ProductType, Validators.required],
    price:              [0, [Validators.required, Validators.min(0.01)]],
    billingPeriod:      ['monthly'],
    stock:              [null as number | null],
    requiresActivation: [true],
    status:             ['active'],
    description:        [''],
    tags:               [''],
  });

  readonly isEditMode          = computed(() => this.product() !== null);
  readonly selectedType        = signal<ProductType>('physical');
  readonly primaryImage        = computed(() => this.images().find((img) => img.isPrimary) ?? this.images()[0]);
  readonly selectedResourceIds = signal<Set<string>>(new Set());
  readonly allResources        = this.resourceService.resources;
  readonly resourceIcon        = (type: ResourceType) => RESOURCE_ICONS[type];

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
        this.images.set(p.images ? [...p.images] : []);
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
        this.images.set([]);
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

  addImage(): void {
    const usedGradients = new Set(this.images().map((img) => img.gradient));
    const gradient = GRADIENT_PALETTE.find((g) => !usedGradients.has(g))
      ?? GRADIENT_PALETTE[this.images().length % GRADIENT_PALETTE.length];
    const isPrimary = this.images().length === 0;
    this.images.update((list) => [
      ...list,
      { id: `img-new-${Date.now()}`, gradient, altText: 'Nueva imagen', isPrimary },
    ]);
  }

  removeImage(id: string): void {
    this.images.update((list) => {
      const filtered = list.filter((img) => img.id !== id);
      const hasPrimary = filtered.some((img) => img.isPrimary);
      return hasPrimary ? filtered : filtered.map((img, i) => ({ ...img, isPrimary: i === 0 }));
    });
  }

  setPrimary(id: string): void {
    this.images.update((list) => list.map((img) => ({ ...img, isPrimary: img.id === id })));
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const raw  = this.form.getRawValue();
    const type = raw.type as ProductType;
    const imgs = this.images();

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
      images: imgs.length ? imgs : [
        { id: `img-${Date.now()}`, gradient: 'from-violet-400 to-purple-600',
          altText: raw.name, isPrimary: true },
      ],
    });
  }
}
