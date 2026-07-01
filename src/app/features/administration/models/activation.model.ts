export type ActivationStatus = 'success' | 'pending' | 'failed';

export interface Activation {
  id: string;
  licenseCode: string;
  orderId?: string;
  productId: string;
  productName: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  userInitials?: string;
  userAvatarGradient?: string;
  status: ActivationStatus;
  date: string;
  time: string;
  ipAddress: string;
  device: string;
  resourcesUnlocked: number;
  createdAt: string;
}

export interface DeviceStat {
  label: string;
  percentage: number;
  heightPercent: number;
  colorClass: string;
  dotClass: string;
}

export interface SecurityAlert {
  id: string;
  type: 'error' | 'warning';
  title: string;
  detail: string;
}
