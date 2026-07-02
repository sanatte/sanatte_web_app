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

/** Tono semántico de un estado de entrega (cada vista lo mapea a sus clases). */
export type DeliveryTone = 'success' | 'info' | 'accent' | 'warning' | 'neutral' | 'error';

/**
 * Metadata de presentación por estado de entrega (etiqueta + icono + tono).
 * Fuente ÚNICA usada por la tabla admin y las tarjetas de usuario.
 */
export const DELIVERY_STATUS_META: Record<DeliveryStatus, { label: string; icon: string; tone: DeliveryTone }> = {
  preparing:           { label: 'Preparando',         icon: 'pending',         tone: 'neutral' },
  shipped:             { label: 'Enviado',            icon: 'local_shipping',  tone: 'info'    },
  delivered:           { label: 'Entregado',          icon: 'check_circle',    tone: 'success' },
  pending_activation:  { label: 'Pend. activación',   icon: 'qr_code_scanner', tone: 'warning' },
  digital_active:      { label: 'Acceso activo',      icon: 'bolt',            tone: 'accent'  },
  subscription_active: { label: 'Suscripción activa', icon: 'autorenew',       tone: 'info'    },
  cancelled:           { label: 'Cancelado',          icon: 'cancel',          tone: 'error'   },
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
