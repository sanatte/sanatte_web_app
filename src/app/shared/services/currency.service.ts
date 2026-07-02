import { Injectable } from '@angular/core';

/**
 * CurrencyService — fuente ÚNICA de moneda de la tienda.
 *
 * Moneda de recaudo = COP (Mercado Pago Colombia liquida en pesos colombianos).
 * Se muestra SIEMPRE con código ISO para evitar la ambigüedad del signo "$"
 * (USD, COP, MXN… todos usan "$"). Ej: "COP $96.000".
 *
 * Migración multi-moneda: exponer `code`/`locale` desde config del tenant y, si
 * se muestran precios localizados, convertir con tasas reales — el cargo real
 * seguirá siendo en la moneda de recaudo (MP).
 */
@Injectable({ providedIn: 'root' })
export class CurrencyService {
  /** Código ISO 4217 de la moneda de recaudo. */
  readonly code = 'COP';
  /** Locale para el formateo de miles/decimales. */
  readonly locale = 'es-CO';
  /** COP no usa decimales en el uso cotidiano. */
  readonly fractionDigits = 0;

  /** Formatea un monto con código ISO. Ej: 96000 → "COP $96.000". */
  format(amount: number): string {
    const n = new Intl.NumberFormat(this.locale, {
      minimumFractionDigits: this.fractionDigits,
      maximumFractionDigits: this.fractionDigits,
    }).format(amount ?? 0);
    return `${this.code} $${n}`;
  }
}
