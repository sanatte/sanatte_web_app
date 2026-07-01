import { Component, inject } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { KpiCardComponent } from '../../components/kpi-card/kpi-card.component';
import { GrowthChartComponent } from '../../components/growth-chart/growth-chart.component';
import { TopResourcesComponent } from '../../components/top-resources/top-resources.component';
import { RecentOrdersTableComponent } from '../../components/recent-orders-table/recent-orders-table.component';

@Component({
  selector: 'app-admin-dashboard',
  imports: [KpiCardComponent, GrowthChartComponent, TopResourcesComponent, RecentOrdersTableComponent],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent {
  private readonly dashboardService = inject(DashboardService);

  readonly kpiMetrics = this.dashboardService.kpiMetrics;
  readonly topResources = this.dashboardService.topResources;
  readonly recentOrders = this.dashboardService.recentOrders;

  onFilter(): void {
    console.log('Filter clicked');
  }

  onExport(): void {
    console.log('Export clicked');
  }
}
