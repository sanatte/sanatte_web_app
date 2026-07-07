import { Directive, ElementRef, HostListener, inject, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CurrencyService } from '../services/currency.service';

/**
 * ThousandsSeparatorDirective — máscara de miles para inputs de precio (COP).
 *
 * Muestra el valor con separación de miles del locale (`200.000`) mientras
 * mantiene en el `FormControl` un **número entero** (`200000`). COP no usa
 * decimales, así que solo se aceptan dígitos.
 *
 * Uso: `<input type="text" inputmode="numeric" formControlName="price" appThousandsSeparator />`
 */
@Directive({
  selector: 'input[appThousandsSeparator]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ThousandsSeparatorDirective),
      multi: true,
    },
  ],
})
export class ThousandsSeparatorDirective implements ControlValueAccessor {
  private readonly el = inject(ElementRef<HTMLInputElement>).nativeElement;
  private readonly currency = inject(CurrencyService);

  private readonly formatter = new Intl.NumberFormat(this.currency.locale, {
    maximumFractionDigits: 0,
  });

  private onChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  private format(value: number | null | undefined): string {
    if (value === null || value === undefined || Number.isNaN(value)) return '';
    return this.formatter.format(value);
  }

  writeValue(value: number | null): void {
    this.el.value = this.format(value);
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.el.disabled = isDisabled;
  }

  @HostListener('input')
  onInput(): void {
    const digits = this.el.value.replace(/\D/g, '');
    const value = digits ? parseInt(digits, 10) : null;
    // Reformatea en vivo para mostrar los separadores mientras se escribe.
    this.el.value = this.format(value);
    this.onChange(value);
  }

  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
  }
}
