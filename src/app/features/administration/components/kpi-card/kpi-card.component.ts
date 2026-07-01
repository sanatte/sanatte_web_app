import { Component, input, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { KpiMetric } from '../../models/kpi-metric.model';

@Component({
  selector: 'app-kpi-card',
  imports: [DecimalPipe],
  template: `
    <div class="glass-card p-6 rounded-lg transition-transform hover:-translate-y-1 duration-300">
      <div class="flex justify-between items-start mb-4">
        <div class="p-3 rounded-xl" [class]="metric().iconBgClass">
          <span class="material-symbols-outlined" [class]="metric().iconColorClass">
            {{ metric().icon }}
          </span>
        </div>
        <span class="text-label-sm px-2 py-1 rounded font-heading"
              [class]="trendClass()">
          {{ trendPrefix() }}{{ metric().trend | number:'1.1-1' }}%
        </span>
      </div>
      <p class="text-on-surface-variant text-label-md font-heading">{{ metric().label }}</p>
      <h3 class="font-heading text-headline-lg text-on-surface mt-1">{{ metric().value }}</h3>
    </div>
  `,
})
export class KpiCardComponent {
  readonly metric = input.required<KpiMetric>();

  readonly trendClass = computed(() =>
    this.metric().trendPositive
      ? 'text-primary bg-primary-fixed/30'
      : 'text-error bg-error-container/30'
  );

  readonly trendPrefix = computed(() => (this.metric().trendPositive ? '+' : ''));
}
