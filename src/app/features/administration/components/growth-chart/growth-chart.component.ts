import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-growth-chart',
  template: `
    <div class="glass-card p-8 rounded-lg overflow-hidden">
      <div class="flex justify-between items-end mb-8">
        <div>
          <h4 class="font-heading text-headline-md text-on-surface">Growth of Active Minds</h4>
          <p class="text-on-surface-variant text-label-md mt-1">
            Visualizando el progreso del bienestar mental en nuestro ecosistema.
          </p>
        </div>
        <select (change)="onPeriodChange($event)"
                class="bg-surface-container border-none rounded-full text-label-md font-heading
                       px-4 py-2 focus:ring-primary/50 cursor-pointer outline-none">
          @for (p of periods; track p.value) {
            <option [value]="p.value">{{ p.label }}</option>
          }
        </select>
      </div>

      <!-- SVG Chart -->
      <div class="relative h-72 w-full">
        <svg class="absolute inset-0 w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stop-color="rgba(107,56,212,0.20)"/>
              <stop offset="100%" stop-color="rgba(107,56,212,0)"/>
            </linearGradient>
          </defs>
          <path [attr.d]="chartPath()" fill="url(#chartGradient)"/>
          <path [attr.d]="chartLine()" fill="none" stroke="#6b38d4"
                stroke-width="3" stroke-linecap="round"/>
          <!-- Data points -->
          @for (pt of dataPoints(); track pt.x) {
            <circle [attr.cx]="pt.x" [attr.cy]="pt.y" r="5"
                    fill="#6b38d4" opacity="0.6"/>
            <circle [attr.cx]="pt.x" [attr.cy]="pt.y" r="10"
                    fill="#6b38d4" opacity="0.1"/>
          }
        </svg>
      </div>

      <!-- Month labels -->
      <div class="flex justify-between mt-4 px-2">
        @for (month of activeMonths(); track month) {
          <span class="text-on-surface-variant text-label-sm font-heading">{{ month }}</span>
        }
      </div>
    </div>
  `,
})
export class GrowthChartComponent {
  readonly periods = [
    { value: '6m', label: 'Últimos 6 meses' },
    { value: '1y', label: 'Último año' },
    { value: 'all', label: 'Todo el tiempo' },
  ];

  private readonly selectedPeriod = signal('6m');

  private readonly chartData: Record<string, { y: number; month: string }[]> = {
    '6m': [
      { y: 250, month: 'Enero' },
      { y: 190, month: 'Febrero' },
      { y: 200, month: 'Marzo' },
      { y: 120, month: 'Abril' },
      { y:  80, month: 'Mayo' },
      { y:  40, month: 'Junio' },
    ],
    '1y': [
      { y: 270, month: 'Jul' }, { y: 240, month: 'Ago' }, { y: 220, month: 'Sep' },
      { y: 200, month: 'Oct' }, { y: 180, month: 'Nov' }, { y: 160, month: 'Dic' },
      { y: 140, month: 'Ene' }, { y: 120, month: 'Feb' }, { y: 100, month: 'Mar' },
      { y:  80, month: 'Abr' }, { y:  60, month: 'May' }, { y:  40, month: 'Jun' },
    ],
    'all': [
      { y: 290, month: '2021' }, { y: 220, month: '2022' },
      { y: 160, month: '2023' }, { y: 80,  month: '2024' },
      { y: 40,  month: '2025' },
    ],
  };

  readonly activeMonths = () =>
    this.chartData[this.selectedPeriod()].map((d) => d.month);

  readonly dataPoints = () => {
    const data = this.chartData[this.selectedPeriod()];
    const n = data.length;
    return data.map((d, i) => ({
      x: (i / (n - 1)) * 800,
      y: d.y,
    }));
  };

  readonly chartLine = () => {
    const pts = this.dataPoints();
    if (!pts.length) return '';
    const [first, ...rest] = pts;
    const moves = rest.map((p) => `L${p.x},${p.y}`).join(' ');
    return `M${first.x},${first.y} ${moves}`;
  };

  readonly chartPath = () => {
    const line = this.chartLine();
    const pts = this.dataPoints();
    if (!pts.length) return '';
    const last = pts[pts.length - 1];
    return `${line} V300 H0 Z`;
  };

  onPeriodChange(event: Event): void {
    this.selectedPeriod.set((event.target as HTMLSelectElement).value);
  }
}
