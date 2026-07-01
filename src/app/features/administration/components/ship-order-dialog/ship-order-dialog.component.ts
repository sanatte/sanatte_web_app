import { Component, input, output, inject, effect, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Order } from '../../models/order.model';

const CARRIERS = [
  'Servientrega', 'Coordinadora', 'Deprisa', 'TCC',
  'Envia', '4-72', 'FedEx', 'DHL', 'Otro',
];

@Component({
  selector: 'app-ship-order-dialog',
  imports: [ReactiveFormsModule],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-[60] bg-on-background/40 backdrop-blur-sm
                  flex items-center justify-center p-4"
           (click)="cancel.emit()">

        <div class="bg-white w-full max-w-md rounded-lg shadow-2xl flex flex-col"
             (click)="$event.stopPropagation()">

          <!-- Header -->
          <div class="px-8 py-6 border-b border-outline-variant/20">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <span class="material-symbols-outlined text-primary">local_shipping</span>
              </div>
              <div>
                <h2 class="font-heading text-headline-md font-bold text-on-surface">
                  Marcar como Enviado
                </h2>
                <p class="text-label-sm font-heading text-on-surface-variant mt-0.5">
                  {{ order()?.orderNumber }} · {{ order()?.buyerName }}
                </p>
              </div>
            </div>
          </div>

          <!-- Body -->
          <form [formGroup]="form" class="p-8 space-y-5">

            <!-- Transportadora -->
            <div class="space-y-2">
              <label class="text-label-md font-heading font-semibold text-on-surface">
                Transportadora <span class="text-error">*</span>
              </label>
              <select formControlName="carrier"
                      class="w-full bg-surface-container-low border-none rounded-lg px-4 py-3
                             focus:ring-2 focus:ring-primary/50 outline-none text-label-md
                             font-heading cursor-pointer transition-all">
                <option value="">Selecciona la transportadora</option>
                @for (c of carriers; track c) {
                  <option [value]="c">{{ c }}</option>
                }
              </select>
            </div>

            <!-- Número de guía -->
            <div class="space-y-2">
              <label class="text-label-md font-heading font-semibold text-on-surface">
                Número de guía <span class="text-error">*</span>
              </label>
              <input formControlName="trackingNumber" type="text"
                     placeholder="ej. 1234567890"
                     class="w-full bg-surface-container-low border-none rounded-lg px-4 py-3
                            focus:ring-2 focus:ring-primary/50 outline-none text-label-md
                            font-heading transition-all"/>
            </div>

            <!-- Link de rastreo -->
            <div class="space-y-2">
              <label class="text-label-md font-heading font-semibold text-on-surface">
                Link de rastreo
                <span class="text-outline font-normal ml-1">(opcional)</span>
              </label>
              <input formControlName="trackingUrl" type="url"
                     placeholder="https://rastreo.transportadora.com/..."
                     class="w-full bg-surface-container-low border-none rounded-lg px-4 py-3
                            focus:ring-2 focus:ring-primary/50 outline-none text-label-md
                            font-heading transition-all"/>
            </div>

            <!-- Preview -->
            @if (showPreview()) {
              <div class="p-4 bg-surface-container-low rounded-lg border border-outline-variant/30
                          flex items-center gap-3">
                <span class="material-symbols-outlined text-primary text-[20px]">
                  local_shipping
                </span>
                <div class="min-w-0">
                  <p class="text-label-md font-heading font-semibold text-on-surface">
                    {{ form.value.carrier }} · {{ form.value.trackingNumber }}
                  </p>
                  @if (form.value.trackingUrl) {
                    <a [href]="form.value.trackingUrl" target="_blank"
                       class="text-label-sm font-heading text-primary hover:underline truncate block">
                      Ver rastreo ↗
                    </a>
                  }
                </div>
              </div>
            }

          </form>

          <!-- Footer -->
          <div class="px-8 py-5 border-t border-outline-variant/20 flex justify-end gap-3">
            <button type="button" (click)="cancel.emit()"
                    class="px-6 py-3 rounded-full text-label-md font-heading font-bold
                           text-on-surface-variant hover:bg-surface-container-low transition-colors">
              Cancelar
            </button>
            <button type="button" (click)="onSubmit()"
                    [disabled]="!isValid()"
                    class="px-8 py-3 gradient-primary text-white rounded-full text-label-md
                           font-heading font-bold hover:opacity-90 active:scale-95 transition-all
                           disabled:opacity-40 disabled:cursor-not-allowed"
                    style="box-shadow: 0 4px 14px 0 rgba(107,56,212,0.39)">
              Confirmar envío
            </button>
          </div>

        </div>
      </div>
    }
  `,
})
export class ShipOrderDialogComponent {
  private readonly fb = inject(FormBuilder);

  readonly isOpen = input.required<boolean>();
  readonly order  = input<Order | null>(null);

  readonly confirm = output<{ carrier: string; trackingNumber: string; trackingUrl: string }>();
  readonly cancel  = output<void>();

  readonly carriers = CARRIERS;

  readonly form = this.fb.nonNullable.group({
    carrier:        [''],
    trackingNumber: [''],
    trackingUrl:    [''],
  });

  readonly isValid = computed(() =>
    !!this.form.value.carrier && !!this.form.value.trackingNumber
  );

  readonly showPreview = computed(() =>
    !!this.form.value.carrier && !!this.form.value.trackingNumber
  );

  constructor() {
    effect(() => {
      if (!this.isOpen()) {
        this.form.reset({ carrier: '', trackingNumber: '', trackingUrl: '' });
      }
    });
  }

  onSubmit(): void {
    if (!this.isValid()) return;
    const { carrier, trackingNumber, trackingUrl } = this.form.getRawValue();
    this.confirm.emit({ carrier, trackingNumber, trackingUrl });
  }
}
