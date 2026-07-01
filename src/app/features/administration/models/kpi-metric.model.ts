export interface KpiMetric {
  id: string;
  label: string;
  value: string;
  trend: number;
  trendPositive: boolean;
  icon: string;
  iconBgClass: string;
  iconColorClass: string;
}
