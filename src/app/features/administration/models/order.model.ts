import { TEXTS } from '../../../core/i18n/texts';
import { ProductType } from './product.model';

export type PaymentStatus  = 'paid' | 'pending' | 'cancelled';

export type DeliveryStatus =
  | 'preparing'
  | 'shipped'
  | 'delivered'
  | 'pending_activation'
  | 'digital_active'
  | 'subscription_active'
  | 'cancelled';

export interface OrderProduct {
  id: string;
  name: string;
  type: ProductType;
}

export type DeliveryTone = 'success' | 'info' | 'accent' | 'warning' | 'neutral' | 'error';

const DELIVERY_LABEL = TEXTS.admin.orders.deliveryStatuses;

export const DELIVERY_STATUS_META: Record<DeliveryStatus, { label: string; icon: string; tone: DeliveryTone }> = {
  preparing:           { label: DELIVERY_LABEL.preparing,                icon: 'pending',         tone: 'neutral' },
  shipped:             { label: DELIVERY_LABEL.shipped,                  icon: 'local_shipping',  tone: 'info'    },
  delivered:           { label: DELIVERY_LABEL.delivered,                icon: 'check_circle',    tone: 'success' },
  pending_activation:  { label: DELIVERY_LABEL.pending_activation,       icon: 'qr_code_scanner', tone: 'warning' },
  digital_active:      { label: DELIVERY_LABEL.digital_active,           icon: 'bolt',            tone: 'accent'  },
  subscription_active: { label: DELIVERY_LABEL.subscription_active,      icon: 'autorenew',       tone: 'info'    },
  cancelled:           { label: DELIVERY_LABEL.cancelled,                icon: 'cancel',          tone: 'error'   },
};

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
