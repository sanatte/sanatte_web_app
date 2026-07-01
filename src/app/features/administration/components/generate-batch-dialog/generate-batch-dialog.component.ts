import { Component, input, output, inject, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-generate-batch-dialog',
  imports: [ReactiveFormsModule],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-[60] bg-on-background/40 backdrop-blur-sm
                  flex items-center justify-center p-4"
           (click)="cancel.emit()">

        <div class="bg-white w-full max-w-md rounded-lg shadow-2xl flex flex-col overflow-hidden"
             (click)="$event.stopPropagation()">

          <!-- Header -->
          <div class="px-8 py-6 border-b border-outline-variant/20">
            <div class="flex items-center gap-3 mb-1">
              <div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <span class="material-symbols-outlined text-primary">add_box</span>
              </div>
              <h2 class="font-heading text-headline-md font-bold text-on-surface">
                Generar lote de licencias
              </h2>
            </div>
            <p class="text-label-md font-heading text-on-surface-variant mt-1">
              Crea códigos QR para un producto físico.
            </p>
          </div>

          <!-- Body -->
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-8 space-y-5">

            <!-- Producto -->
            <div class="space-y-2">
              <label class="text-label-md font-heading font-semibold text-on-surface">
                Producto físico <span class="text-error">*</span>
              </label>
              <select formControlName="productId"
                      class="w-full bg-surface-container-low border-none rounded-lg px-4 py-3
                             focus:ring-2 focus:ring-primary/50 outline-none text-label-md
                             font-heading cursor-pointer">
                <option value="">Selecciona un producto</option>
                @for (p of physicalProducts(); track p.id) {
                  <option [value]="p.id">{{ p.name }} ({{ p.sku }})</option>
                }
              </select>
              @if (form.controls.productId.touched && form.controls.productId.errors) {
                <p class="text-label-sm text-error">Selecciona un producto</p>
              }
            </div>

            <!-- Cantidad -->
            <div class="space-y-2">
              <label class="text-label-md font-heading font-semibold text-on-surface">
                Cantidad de licencias <span class="text-error">*</span>
              </label>
              <input formControlName="quantity" type="number" min="1" max="10000"
                     placeholder="ej. 100"
                     class="w-full bg-surface-container-low border-none rounded-lg px-4 py-3
                            focus:ring-2 focus:ring-primary/50 outline-none text-label-md
                            font-heading transition-all"/>
              @if (form.controls.quantity.touched && form.controls.quantity.errors) {
                <p class="text-label-sm text-error">
                  Ingresa una cantidad entre 1 y 10,000
                </p>
              }
            </div>

            <!-- Preview -->
            @if (selectedProduct()) {
              <div class="p-4 bg-surface-container-low rounded-lg border border-outline-variant/30">
                <p class="text-label-sm font-heading text-on-surface-variant uppercase tracking-wider mb-2">
                  Resumen
                </p>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-[18px] text-primary">qr_code_2</span>
                    <span class="text-label-md font-heading text-on-surface">
                      {{ form.value.quantity || 0 }} licencias para
                      <strong>{{ selectedProduct()?.name }}</strong>
                    </span>
                  </div>
                </div>
                <p class="text-label-sm font-heading text-on-surface-variant mt-1">
                  Se generará el lote con códigos únicos listos para imprimir.
                </p>
              </div>
            }

          </form>

          <!-- Footer -->
          <div class="px-8 py-5 border-t border-outline-variant/20 flex justify-end gap-3 bg-white">
            <button type="button" (click)="cancel.emit()"
                    class="px-6 py-3 rounded-full text-label-md font-heading font-bold
                           text-on-surface-variant hover:bg-surface-container-low transition-colors">
              Cancelar
            </button>
            <button type="button" (click)="onSubmit()"
                    class="px-8 py-3 gradient-primary text-white rounded-full text-label-md
                           font-heading font-bold hover:opacity-90 active:scale-95 transition-all"
                    style="box-shadow: 0 4px 14px 0 rgba(107,56,212,0.39)">
              Generar lote
            </button>
          </div>

        </div>
      </div>
    }
  `,
})
export class GenerateBatchDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);

  readonly isOpen = input.required<boolean>();
  readonly save   = output<{ productId: string; productName: string; quantity: number }>();
  readonly cancel = output<void>();

  readonly form = this.fb.nonNullable.group({
    productId: ['', Validators.required],
    quantity:  [50, [Validators.required, Validators.min(1), Validators.max(10000)]],
  });

  readonly physicalProducts = computed(() =>
    this.productService.products().filter((p) => p.type === 'physical')
  );

  readonly selectedProduct = computed(() => {
    const id = this.form.value.productId;
    return id ? this.physicalProducts().find((p) => p.id === id) ?? null : null;
  });

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const { productId, quantity } = this.form.getRawValue();
    const product = this.physicalProducts().find((p) => p.id === productId);
    if (!product) return;
    this.save.emit({ productId, productName: product.name, quantity: Number(quantity) });
    this.form.reset({ productId: '', quantity: 50 });
  }
}
