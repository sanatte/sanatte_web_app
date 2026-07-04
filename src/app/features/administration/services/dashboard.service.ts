import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { KpiMetric } from '../models/kpi-metric.model';
import { DashboardOrder, OrderStatus } from '../models/dashboard-order.model';
import { CurrencyService } from '../../../shared/services/currency.service';
import { environment } from '../../../../environments/environment';

interface ApiDashboard {
  totalSales: number;
  activeUsers: number;
  activations: number;
  activeSubscriptions: number;
  recentOrders: ApiDashboardOrder[];
}

interface ApiDashboardOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerInitials: string;
  amount: number;
  status: string;
}

// Presentación de cada tarjeta KPI (icono/colores). El valor llega de la API.
const KPI_PRESENTATION = [
  { id: 'sales',         label: 'Total Ventas',          icon: 'payments', iconBgClass: 'bg-primary-fixed',      iconColorClass: 'text-on-primary-fixed' },
  { id: 'users',         label: 'Usuarios Activos',      icon: 'person',   iconBgClass: 'bg-secondary-fixed',    iconColorClass: 'text-on-secondary-fixed' },
  { id: 'activations',   label: 'Activaciones',          icon: 'bolt',     iconBgClass: 'bg-tertiary-fixed',     iconColorClass: 'text-on-tertiary-fixed' },
  { id: 'subscriptions', label: 'Suscripciones Activas', icon: 'autorenew', iconBgClass: 'bg-primary-container', iconColorClass: 'text-on-primary-container' },
] as const;

const ORDER_BG = [
  'bg-secondary-fixed/50', 'bg-primary-fixed/50', 'bg-surface-container',
  'bg-secondary-fixed-dim/50', 'bg-tertiary-fixed/50',
];

/**
 * DashboardService — KPIs y pedidos recientes del panel admin, desde
 * `GET /api/admin/dashboard` (datos reales). Las tendencias (%) de los KPIs no se
 * muestran porque aún no se calcula histórico por periodo (trend=0 → oculto).
 */
@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http     = inject(HttpClient);
  private readonly currency = inject(CurrencyService);

  readonly kpiMetrics   = signal<KpiMetric[]>([]);
  readonly recentOrders = signal<DashboardOrder[]>([]);
  readonly loading      = signal(false);

  constructor() { this.load(); }

  async load(): Promise<void> {
    this.loading.set(true);
    try {
      const d = await firstValueFrom(
        this.http.get<ApiDashboard>(`${environment.apiUrl}/admin/dashboard`)
      );
      this.kpiMetrics.set(this.buildKpis(d));
      this.recentOrders.set(d.recentOrders.map((o, i) => this.mapOrder(o, i)));
    } finally {
      this.loading.set(false);
    }
  }

  private buildKpis(d: ApiDashboard): KpiMetric[] {
    const values: Record<string, string> = {
      sales:         this.currency.format(d.totalSales),
      users:         d.activeUsers.toLocaleString('es-CO'),
      activations:   d.activations.toLocaleString('es-CO'),
      subscriptions: d.activeSubscriptions.toLocaleString('es-CO'),
    };
    return KPI_PRESENTATION.map((p) => ({
      ...p,
      value: values[p.id] ?? '0',
      trend: 0,
      trendPositive: true,
    }));
  }

  private mapOrder(o: ApiDashboardOrder, index: number): DashboardOrder {
    return {
      id: o.id,
      orderId: o.orderNumber,
      customerName: o.customerName,
      customerInitials: o.customerInitials,
      customerBgClass: ORDER_BG[index % ORDER_BG.length],
      amount: this.currency.format(o.amount),
      status: (o.status as OrderStatus) ?? 'paid',
    };
  }
}
