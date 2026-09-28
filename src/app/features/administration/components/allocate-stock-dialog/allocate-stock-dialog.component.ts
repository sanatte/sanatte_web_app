import { Component, computed, effect, inject, input, output } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TEXTS } from '../../../../core/i18n/texts';
import { ThousandsSeparatorDirective } from '../../../../shared/directives/thousands-separator.directive';
import { InventoryRow, SalesLocation } from '../../models/location.model';
import { Product } from '../../models/product.model';

export type AllocateMode = 'assign' | 'return';

export interface AllocateRequest {
  productId: string;
  quantity: number;
}

@Component({
  selector: 'app-allocate-stock-dialog',
  imports: [ReactiveFormsModule, ThousandsSeparatorDirective],
  templateUrl: './allocate-stock-dialog.component.html',
})
export class AllocateStockDialogComponent {
  private readonly fb = inject(FormBuilder);

  protected readonly t = TEXTS.admin.locations.allocate;
  protected readonly c = TEXTS.common;

  readonly location  = input.required<SalesLocation | null>();
  readonly mode      = input.required<AllocateMode>();
  readonly inventory = input.required<InventoryRow[]>();
  readonly products  = input.required<Product[]>();
  readonly busy      = input(false);
  readonly message   = input<string | null>(null);

  readonly submitted     = output<AllocateRequest>();
  readonly productChange = output<void>();
  readonly cancel        = output<void>();

  protected readonly form = this.fb.nonNullable.group({
    productId: ['', Validators.required],
    quantity:  [1, [Validators.required, Validators.min(1)]],
  });

  private readonly productId = toSignal(this.form.controls.productId.valueChanges, { initialValue: '' });
  private readonly quantity  = toSignal(this.form.controls.quantity.valueChanges, { initialValue: 1 });

  protected readonly isReturn       = computed(() => this.mode() === 'return');
  protected readonly activeProducts = computed(() => this.products().filter(p => p.status === 'active'));
  protected readonly hasProduct     = computed(() => !!this.productId());

  protected readonly maxUnits = computed(() => {
    const pid = this.productId();
    if (!pid) return 0;
    const locationId = this.isReturn() ? this.location()?.id : null;
    const row = this.inventory().find(r => r.locationId === locationId && r.productId === pid);
    return (this.isReturn() ? row?.assigned : row?.available) ?? 0;
  });

  protected readonly quantityExceedsStock = computed(() => {
    if (!this.hasProduct()) return false;
    const qty = Number(this.quantity() ?? 0);
    return qty > 0 && qty > this.maxUnits();
  });

  protected readonly canSubmit = computed(() =>
    !this.busy()
    && !this.quantityExceedsStock()
    && !(this.hasProduct() && this.maxUnits() === 0)
  );

  constructor() {
    effect(() => {
      if (this.location()) this.form.reset();
    });

    this.form.controls.productId.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.form.controls.quantity.setValue(1);
        this.productChange.emit();
      });
  }

  protected onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (!this.canSubmit()) return;
    const { productId, quantity } = this.form.getRawValue();
    this.submitted.emit({ productId, quantity: Number(quantity) });
  }
}
