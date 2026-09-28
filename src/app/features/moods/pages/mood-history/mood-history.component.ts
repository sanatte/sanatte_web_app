import {
  Component, DestroyRef, ElementRef, afterRenderEffect, computed, inject, signal, viewChild,
} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { UserMoodsService } from '../../services/user-moods.service';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { themeHex, themeRgba } from '../../../../shared/utils/theme-color';

Chart.register(...registerables);

type PeriodKey = 'week' | 'month' | 'quarter';

interface PeriodOption {
  key: PeriodKey;
  label: string;
  days: number;
}

interface WeekDay {
  date: string;
  label: string;
  dayNumber: number;
  emoji: string | null;
  moodName: string | null;
  color: string | null;
  isToday: boolean;
}

const PERIODS: PeriodOption[] = [
  { key: 'week',    label: 'Semana',  days: 7 },
  { key: 'month',   label: 'Mes',     days: 30 },
  { key: 'quarter', label: '3 meses', days: 90 },
];

const PERIOD_SUBTITLES: Record<PeriodKey, string> = {
  week:    'Así te has sentido durante los últimos 7 días.',
  month:   'Así te has sentido durante los últimos 30 días.',
  quarter: 'Así te has sentido durante los últimos 3 meses.',
};

const WEEKDAY_FORMAT = new Intl.DateTimeFormat('es', { weekday: 'short' });
const LONG_DATE_FORMAT = new Intl.DateTimeFormat('es', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
});

function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseIsoDate(value: string): Date {
  const [y, m, d] = value.slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d);
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function hexToRgba(color: string | null | undefined, alpha: number): string | null {
  if (!color) return null;
  const hex = color.trim().replace('#', '');
  const full = hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex.slice(0, 6);
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

@Component({
  selector: 'app-mood-history',
  imports: [PaginationComponent],
  templateUrl: './mood-history.component.html',
})
export class MoodHistoryComponent {
  private readonly moods = inject(UserMoodsService);

  readonly entries        = this.moods.entries;
  readonly total          = this.moods.total;
  readonly summary        = this.moods.summary;
  readonly catalog        = this.moods.catalog;
  readonly loading        = this.moods.loading;
  readonly summaryLoading = this.moods.summaryLoading;
  readonly error          = this.moods.error;
  readonly summaryError   = this.moods.summaryError;

  readonly periods  = PERIODS;
  readonly pageSize = 10;

  readonly period      = signal<PeriodKey>('week');
  readonly moodFilter  = signal<string | null>(null);
  readonly currentPage = signal(1);
  private readonly themeVersion = signal(0);

  readonly range = computed(() => {
    const days = PERIODS.find((p) => p.key === this.period())!.days;
    const to = new Date();
    const from = new Date(to.getFullYear(), to.getMonth(), to.getDate() - (days - 1));
    return { from: toIsoDate(from), to: toIsoDate(to) };
  });

  readonly subtitle = computed(() => PERIOD_SUBTITLES[this.period()]);

  readonly weekDays = computed<WeekDay[]>(() => {
    const { from } = this.range();
    const today = toIsoDate(new Date());
    const start = parseIsoDate(from);
    const byDate = new Map((this.summary()?.days ?? []).map((d) => [d.date.slice(0, 10), d]));
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      const iso = toIsoDate(day);
      const record = byDate.get(iso);
      return {
        date: iso,
        label: capitalize(WEEKDAY_FORMAT.format(day).replace('.', '')),
        dayNumber: day.getDate(),
        emoji: record?.moodEmoji ?? null,
        moodName: record?.moodName ?? null,
        color: hexToRgba(record?.moodColor, 0.22),
        isToday: iso === today,
      };
    });
  });

  readonly topMood = computed(() => this.summary()?.byMood[0] ?? null);

  readonly hasSummaryData = computed(() => (this.summary()?.totalEntries ?? 0) > 0);

  readonly activeFilterName = computed(() => {
    const id = this.moodFilter();
    return id ? this.catalog().find((c) => c.id === id)?.name ?? null : null;
  });

  private readonly chartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('moodChart');
  private chart?: Chart;

  constructor() {
    this.moods.loadCatalog();
    this.reload();

    const observer = new MutationObserver(() => this.themeVersion.update((v) => v + 1));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    inject(DestroyRef).onDestroy(() => {
      observer.disconnect();
      this.chart?.destroy();
    });

    afterRenderEffect(() => {
      this.themeVersion();
      const canvas = this.chartCanvas()?.nativeElement;
      const summary = this.summary();
      this.chart?.destroy();
      this.chart = undefined;
      if (!canvas || !summary?.byMood.length) return;
      this.chart = this.buildChart(canvas);
    });
  }

  selectPeriod(key: PeriodKey): void {
    if (this.period() === key) return;
    this.period.set(key);
    this.reload();
  }

  selectMood(id: string | null): void {
    if (this.moodFilter() === id) return;
    this.moodFilter.set(id);
    this.currentPage.set(1);
    this.loadHistory();
  }

  changePage(page: number): void {
    this.currentPage.set(page);
    this.loadHistory();
  }

  retry(): void {
    this.reload();
  }

  tint(color: string | null | undefined): string | null {
    return hexToRgba(color, 0.22);
  }

  formatLongDate(value: string): string {
    return capitalize(LONG_DATE_FORMAT.format(parseIsoDate(value)));
  }

  private reload(): void {
    const { from, to } = this.range();
    this.currentPage.set(1);
    this.moods.loadSummary(from, to);
    this.loadHistory();
  }

  private loadHistory(): void {
    const { from, to } = this.range();
    this.moods.loadHistory({
      page: this.currentPage(),
      pageSize: this.pageSize,
      from,
      to,
      moodCatalogId: this.moodFilter(),
    });
  }

  private buildChart(canvas: HTMLCanvasElement): Chart {
    const byMood = this.summary()!.byMood;
    const fallback = themeHex('primary');
    const labels = byMood.map((m) => `${m.emoji} ${m.name}`);
    const data = byMood.map((m) => m.count);
    const colors = byMood.map((m) => hexToRgba(m.color, 1) ?? fallback);
    const tickColor = themeHex('on-surface-variant');
    const gridColor = themeRgba('outline-variant', 0.4);

    return new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderRadius: 999,
          borderSkipped: false,
          maxBarThickness: 36,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.parsed.y} ${ctx.parsed.y === 1 ? 'registro' : 'registros'}`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: { color: tickColor, font: { size: 12 } },
          },
          y: {
            beginAtZero: true,
            border: { display: false },
            grid: { color: gridColor },
            ticks: { color: tickColor, stepSize: 1, precision: 0 },
          },
        },
      },
    });
  }
}
