import { Injectable, signal } from '@angular/core';
import { KpiMetric } from '../models/kpi-metric.model';
import { DashboardResource } from '../models/dashboard-resource.model';
import { DashboardOrder } from '../models/dashboard-order.model';
import {
  MOCK_KPI_METRICS,
  MOCK_TOP_RESOURCES,
  MOCK_RECENT_ORDERS,
} from '../mocks/dashboard.mock';

/**
 * Servicio Mock del dashboard.
 * Cuando se integre NestJS, solo cambia la implementación interna —
 * los signals que expone este servicio no cambian.
 */
@Injectable({ providedIn: 'root' })
export class DashboardService {
  readonly kpiMetrics = signal<KpiMetric[]>(MOCK_KPI_METRICS);
  readonly topResources = signal<DashboardResource[]>(MOCK_TOP_RESOURCES);
  readonly recentOrders = signal<DashboardOrder[]>(MOCK_RECENT_ORDERS);
  readonly loading = signal(false);
}
