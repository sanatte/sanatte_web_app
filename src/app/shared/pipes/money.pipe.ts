import { Pipe, PipeTransform, inject } from '@angular/core';
import { CurrencyService } from '../services/currency.service';

/**
 * MoneyPipe — formatea un monto en la moneda de recaudo con código ISO.
 * Uso: {{ amount | money }} → "COP $96.000".
 */
@Pipe({ name: 'money' })
export class MoneyPipe implements PipeTransform {
  private readonly currency = inject(CurrencyService);
  transform(amount: number | null | undefined): string {
    return this.currency.format(amount ?? 0);
  }
}
