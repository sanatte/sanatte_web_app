import { Component, effect, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { TEXTS } from '../../../../core/i18n/texts';
import { LocationType, SalesModel } from '../../models/location.model';
import { CreateLocationInput } from '../../services/location.service';

@Component({
  selector: 'app-location-form-dialog',
  imports: [ReactiveFormsModule],
  templateUrl: './location-form-dialog.component.html',
})
export class LocationFormDialogComponent {
  private readonly fb = inject(FormBuilder);

  protected readonly t = TEXTS.admin.locations;
  protected readonly c = TEXTS.common;
  protected readonly typeOptions = Object.entries(this.t.types) as [LocationType, string][];
  protected readonly salesModelOptions = Object.entries(this.t.salesModels) as [SalesModel, string][];

  readonly isOpen = input.required<boolean>();
  readonly save   = output<CreateLocationInput>();
  readonly cancel = output<void>();

  protected readonly form = this.fb.nonNullable.group({
    name:              ['', Validators.required],
    type:              ['physical_point' as LocationType],
    salesModel:        ['consignment' as SalesModel],
    commissionPercent: [0, [Validators.min(0), Validators.max(100)]],
    contactName:       [''],
    contactPhone:      [''],
  });

  constructor() {
    effect(() => {
      if (!this.isOpen()) return;
      this.form.reset();
      this.syncCommission();
    });

    merge(this.form.controls.type.valueChanges, this.form.controls.salesModel.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.syncCommission());
  }

  protected onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.getRawValue();
    this.save.emit({
      name: v.name.trim(),
      type: v.type,
      salesModel: v.salesModel,
      commissionPercent: this.appliesCommission() ? Number(v.commissionPercent) || 0 : 0,
      contactName: v.contactName.trim() || undefined,
      contactPhone: v.contactPhone.trim() || undefined,
    });
  }

  private appliesCommission(): boolean {
    const { type, salesModel } = this.form.getRawValue();
    return type === 'physical_point' && salesModel === 'consignment';
  }

  private syncCommission(): void {
    const control = this.form.controls.commissionPercent;
    if (this.appliesCommission()) {
      control.enable({ emitEvent: false });
    } else {
      control.setValue(0, { emitEvent: false });
      control.disable({ emitEvent: false });
    }
  }
}
