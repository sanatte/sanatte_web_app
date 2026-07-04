import { Component, inject } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { KpiCardComponent } from '../../components/kpi-card/kpi-card.component';
import { RecentOrdersTableComponent } from '../../components/recent-orders-table/recent-orders-table.component';

@Component({
  selector: 'app-admin-dashboard',
  imports: [KpiCardComponent, RecentOrdersTableComponent],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent {
  private readonly dashboardService = inject(DashboardService);

  readonly kpiMetrics = this.dashboardService.kpiMetrics;
  readonly recentOrders = this.dashboardService.recentOrders;

  onFilter(): void {
    // Filtro de pedidos recientes — pendiente
  }

  onExport(): void {
    // Exportar — pendiente
  }
}
