import { KpiMetric } from '../models/kpi-metric.model';
import { DashboardResource } from '../models/dashboard-resource.model';
import { DashboardOrder } from '../models/dashboard-order.model';

export const MOCK_KPI_METRICS: KpiMetric[] = [
  {
    id: 'sales',
    label: 'Total Ventas',
    value: '$48,290',
    trend: 12.4,
    trendPositive: true,
    icon: 'payments',
    iconBgClass: 'bg-primary-fixed',
    iconColorClass: 'text-on-primary-fixed',
  },
  {
    id: 'users',
    label: 'Usuarios Activos',
    value: '12,402',
    trend: 5.2,
    trendPositive: true,
    icon: 'person',
    iconBgClass: 'bg-secondary-fixed',
    iconColorClass: 'text-on-secondary-fixed',
  },
  {
    id: 'activations',
    label: 'Activaciones',
    value: '3,850',
    trend: -1.8,
    trendPositive: false,
    icon: 'bolt',
    iconBgClass: 'bg-tertiary-fixed',
    iconColorClass: 'text-on-tertiary-fixed',
  },
  {
    id: 'subscriptions',
    label: 'Suscripciones Activas',
    value: '8,124',
    trend: 8.1,
    trendPositive: true,
    icon: 'autorenew',
    iconBgClass: 'bg-primary-container',
    iconColorClass: 'text-on-primary-container',
  },
];

export const MOCK_TOP_RESOURCES: DashboardResource[] = [
  {
    id: 'r1',
    title: 'Deep Sleep Echoes',
    type: 'audio',
    stats: '4.2k Escuchas',
    progressPercent: 85,
    thumbnailGradient: 'from-purple-400 to-indigo-600',
  },
  {
    id: 'r2',
    title: 'Morning Flow Yoga',
    type: 'video',
    stats: '3.8k Vistas',
    progressPercent: 72,
    thumbnailGradient: 'from-violet-400 to-purple-700',
  },
  {
    id: 'r3',
    title: 'Anxiety Release Alpha',
    type: 'audio',
    stats: '2.9k Escuchas',
    progressPercent: 60,
    thumbnailGradient: 'from-indigo-300 to-purple-500',
  },
];

export const MOCK_RECENT_ORDERS: DashboardOrder[] = [
  {
    id: '1',
    orderId: '#SN-92834',
    customerName: 'Jane Doe',
    customerInitials: 'JD',
    customerBgClass: 'bg-secondary-fixed/50',
    amount: '$199.00',
    status: 'paid',
  },
  {
    id: '2',
    orderId: '#SN-92835',
    customerName: 'Arthur Smith',
    customerInitials: 'AS',
    customerBgClass: 'bg-primary-fixed/50',
    amount: '$89.50',
    status: 'pending',
  },
  {
    id: '3',
    orderId: '#SN-92836',
    customerName: 'Emma Luna',
    customerInitials: 'EL',
    customerBgClass: 'bg-surface-container',
    amount: '$240.00',
    status: 'shipped',
  },
  {
    id: '4',
    orderId: '#SN-92837',
    customerName: 'Marcus Bell',
    customerInitials: 'MB',
    customerBgClass: 'bg-secondary-fixed-dim/50',
    amount: '$45.00',
    status: 'paid',
  },
  {
    id: '5',
    orderId: '#SN-92838',
    customerName: 'Sofia Reyes',
    customerInitials: 'SR',
    customerBgClass: 'bg-tertiary-fixed/50',
    amount: '$120.00',
    status: 'shipped',
  },
];
