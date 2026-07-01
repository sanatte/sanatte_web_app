export type OrderStatus = 'paid' | 'pending' | 'shipped' | 'cancelled';

export interface DashboardOrder {
  id: string;
  orderId: string;
  customerName: string;
  customerInitials: string;
  customerBgClass: string;
  amount: string;
  status: OrderStatus;
}
