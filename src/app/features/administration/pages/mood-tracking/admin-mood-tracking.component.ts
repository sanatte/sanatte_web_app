import {
  Component, inject, signal, computed, AfterViewInit,
  ViewChild, ElementRef, OnDestroy
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MoodTrackingService } from '../../services/mood-tracking.service';
import { MoodCatalogService } from '../../services/mood-catalog.service';
import { MoodEntryAdmin } from '../../models/mood-catalog.model';
import { AdminPageHeaderComponent } from '../../../../shared/components/admin-page-header/admin-page-header.component';
import { Chart, registerables } from 'chart.js';
import { themeHex } from '../../../../shared/utils/theme-color';
import { TEXTS } from '../../../../core/i18n/texts';

Chart.register(...registerables);

const PERIOD_DAYS: Record<string, number> = {
  '7d': 7, '30d': 30, '90d': 90,
};

@Component({
  selector: 'app-admin-mood-tracking',
  imports: [AdminPageHeaderComponent, FormsModule],
  templateUrl: './admin-mood-tracking.component.html',
})
export class AdminMoodTrackingComponent implements AfterViewInit, OnDestroy {
  private readonly trackingSvc = inject(MoodTrackingService);
  private readonly catalogSvc  = inject(MoodCatalogService);

  protected readonly t = TEXTS.admin.moodTracking;

  readonly entries  = this.trackingSvc.entries;
  readonly total    = this.trackingSvc.total;
  readonly loading  = this.trackingSvc.loading;
  readonly error    = this.trackingSvc.error;
  readonly catalogs = this.catalogSvc.catalogs;

  readonly searchUser       = signal('');
  readonly selectedCatalog  = signal('');
  readonly selectedPeriod   = signal('30d');
  readonly currentPage      = signal(1);
  readonly pageSize         = 20;

  readonly focusedUser = signal<{ id: string; name: string; email: string } | null>(null);

  readonly totalPages = computed(() => Math.ceil(this.total() / this.pageSize));

  @ViewChild('barChart')  private barChartRef!:  ElementRef<HTMLCanvasElement>;
  @ViewChild('donutChart') private donutChartRef!: ElementRef<HTMLCanvasElement>;
  private barChart?:   Chart;
  private donutChart?: Chart;

  ngAfterViewInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.barChart?.destroy();
    this.donutChart?.destroy();
  }

  async loadData(): Promise<void> {
    const period = PERIOD_DAYS[this.selectedPeriod()] ?? 30;
    const from = new Date();
    from.setDate(from.getDate() - period);
    const fromStr = from.toISOString().split('T')[0];

    const userId = this.focusedUser()?.id;
    await this.trackingSvc.loadAll({
      userId,
      moodCatalogId: this.selectedCatalog() || undefined,
      from: fromStr,
      page: this.currentPage(),
      pageSize: this.pageSize,
    });

    if (userId) this.renderCharts();
  }

  focusUser(entry: MoodEntryAdmin): void {
    this.focusedUser.set({
      id:    entry.userId,
      name:  entry.userDisplayName,
      email: entry.userEmail,
    });
    this.currentPage.set(1);
    this.loadData();
  }

  clearUserFocus(): void {
    this.focusedUser.set(null);
    this.currentPage.set(1);
    this.loadData();
  }

  onFilterChange(): void {
    this.currentPage.set(1);
    this.loadData();
  }

  changePage(page: number): void {
    this.currentPage.set(page);
    this.loadData();
  }

  private renderCharts(): void {
    const entries = this.entries();
    if (!entries.length) return;

    const counts: Record<string, { name: string; emoji: string; count: number }> = {};
    for (const e of entries) {
      if (!counts[e.moodCatalogId]) {
        counts[e.moodCatalogId] = { name: e.moodName, emoji: e.moodEmoji, count: 0 };
      }
      counts[e.moodCatalogId].count++;
    }
    const labels  = Object.values(counts).map((c) => `${c.emoji} ${c.name}`);
    const data    = Object.values(counts).map((c) => c.count);
    const colors  = ['primary', 'secondary', 'success', 'warning', 'info', 'error'].map(themeHex);

    this.barChart?.destroy();
    this.donutChart?.destroy();

    if (this.barChartRef?.nativeElement) {
      this.barChart = new Chart(this.barChartRef.nativeElement, {
        type: 'bar',
        data: { labels, datasets: [{ data, backgroundColor: colors, borderRadius: 8 }] },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
        },
      });
    }

    if (this.donutChartRef?.nativeElement) {
      this.donutChart = new Chart(this.donutChartRef.nativeElement, {
        type: 'doughnut',
        data: { labels, datasets: [{ data, backgroundColor: colors }] },
        options: {
          responsive: true,
          plugins: { legend: { position: 'bottom' } },
        },
      });
    }
  }
}
