import { ProductType } from './product.model';

export type PaymentStatus  = 'paid' | 'pending' | 'cancelled';

export type DeliveryStatus =
  | 'preparing'           // Physical: preparando despacho
  | 'shipped'             // Physical: enviado
  | 'delivered'           // Physical: entregado
  | 'pending_activation'  // Physical: pagado pero QR no activado aún
  | 'digital_active'      // Digital: acceso activo
  | 'subscription_active' // Subscription: suscripción activa
  | 'cancelled';

export interface OrderProduct {
  id: string;
  name: string;
  type: ProductType;
}

export interface Order {
  id: string;
  orderNumber: string;
  buyerName: string;
  buyerEmail: string;
  buyerInitials: string;
  buyerAvatarGradient: string;
  products: OrderProduct[];
  date: string;
  time: string;
  total: number;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  shippingCarrier?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  createdAt: string;
}
