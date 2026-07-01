import { UserRole } from '../../../core/models/role.model';

export type UserStatus = 'active' | 'blocked';

export interface AdminUser {
  id: string;
  displayName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatarInitials: string;
  avatarGradient: string;
  productsCount: number;
  activationsCount: number;
  hasActiveSubscription: boolean;
  subscriptionPlan?: string;
  createdAt: string;
  lastLoginAt: string;
}
