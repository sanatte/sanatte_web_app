export type LicenseStatus = 'available' | 'active' | 'revoked';

export interface License {
  id: string;
  code: string;
  batchId: string;
  productId: string;
  productName: string;
  orderId?: string;
  userId?: string;
  userName?: string;
  userInitials?: string;
  userAvatarGradient?: string;
  status: LicenseStatus;
  generatedAt: string;
  activatedAt?: string;
}

export interface LicenseActivity {
  id: string;
  type: 'activation' | 'batch' | 'revocation';
  message: string;
  detail: string;
  timeAgo: string;
}

export interface TrendPoint {
  day: string;
  value: number;
  heightPercent: number;
}
