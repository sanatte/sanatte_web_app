import { Component, input, computed } from '@angular/core';

/**
 * CircularProgress — anillo de progreso con conic-gradient (design "Serene Pulse").
 * Reutilizable: tarjetas de producto, stats, perfil, suscripciones.
 *
 * Uso:
 *   <app-circular-progress [value]="65" />
 *   <app-circular-progress [value]="100" [size]="64" [showLabel]="true" />
 */
@Component({
  selector: 'app-circular-progress',
  template: `
    <div
      class="rounded-full shrink-0 flex items-center justify-center"
      [style.width.px]="size()"
      [style.height.px]="size()"
      [style.background]="background()">
      @if (showLabel()) {
        <span class="font-heading font-bold text-on-surface"
              [style.fontSize.px]="size() * 0.26">
          {{ value() }}%
        </span>
      } @else if (value() >= 100) {
        <span class="material-symbols-outlined text-primary"
              [style.fontSize.px]="size() * 0.4">check</span>
      }
    </div>
  `,
})
export class CircularProgressComponent {
  readonly value     = input.required<number>();      // 0–100
  readonly size      = input(48);                      // px
  readonly showLabel = input(false);
  readonly track     = input('#e9ddff');               // primary-fixed
  readonly fill      = input('#6b38d4');               // primary

  private readonly ringWidth = computed(() => (this.showLabel() ? 82 : 79));

  readonly background = computed(() => {
    const v = Math.min(100, Math.max(0, this.value()));
    return `radial-gradient(closest-side, white ${this.ringWidth()}%, transparent 80% 100%),`
      + ` conic-gradient(${this.fill()} calc(${v} * 1%), ${this.track()} 0)`;
  });
}
