import { AdminUser } from '../models/user-admin.model';
import { UserRole } from '../../../core/models/role.model';

export const MOCK_ADMIN_USERS: AdminUser[] = [
  {
    id: 'u1', displayName: 'Ana García', email: 'ana.garcia@gmail.com',
    role: UserRole.User, status: 'active', avatarInitials: 'AG',
    avatarGradient: 'from-violet-400 to-purple-600',
    productsCount: 2, activationsCount: 2, hasActiveSubscription: true,
    subscriptionPlan: 'Guided Flow Pro', createdAt: '2024-10-15', lastLoginAt: '2026-06-28',
  },
  {
    id: 'u2', displayName: 'Carlos Mendez', email: 'cmendez@outlook.com',
    role: UserRole.User, status: 'active', avatarInitials: 'CM',
    avatarGradient: 'from-indigo-400 to-blue-600',
    productsCount: 1, activationsCount: 1, hasActiveSubscription: false,
    createdAt: '2024-11-02', lastLoginAt: '2026-06-25',
  },
  {
    id: 'u3', displayName: 'Laura Ríos', email: 'laurarios@sanatte.com',
    role: UserRole.Admin, status: 'active', avatarInitials: 'LR',
    avatarGradient: 'from-emerald-400 to-teal-600',
    productsCount: 0, activationsCount: 0, hasActiveSubscription: false,
    createdAt: '2024-09-01', lastLoginAt: '2026-06-30',
  },
  {
    id: 'u4', displayName: 'Miguel Torres', email: 'miguel.t@gmail.com',
    role: UserRole.User, status: 'blocked', avatarInitials: 'MT',
    avatarGradient: 'from-rose-400 to-red-600',
    productsCount: 1, activationsCount: 0, hasActiveSubscription: false,
    createdAt: '2024-12-10', lastLoginAt: '2025-03-15',
  },
  {
    id: 'u5', displayName: 'Sofía Reyes', email: 'sofia.reyes@hotmail.com',
    role: UserRole.User, status: 'active', avatarInitials: 'SR',
    avatarGradient: 'from-pink-400 to-rose-600',
    productsCount: 3, activationsCount: 2, hasActiveSubscription: true,
    subscriptionPlan: 'Guided Flow Basic', createdAt: '2025-01-20', lastLoginAt: '2026-06-29',
  },
  {
    id: 'u6', displayName: 'Andrés Vega', email: 'avega@empresa.co',
    role: UserRole.User, status: 'active', avatarInitials: 'AV',
    avatarGradient: 'from-amber-400 to-orange-500',
    productsCount: 2, activationsCount: 1, hasActiveSubscription: true,
    subscriptionPlan: 'Guided Flow Pro', createdAt: '2025-02-05', lastLoginAt: '2026-06-27',
  },
  {
    id: 'u7', displayName: 'Valentina Cruz', email: 'vcruz@gmail.com',
    role: UserRole.User, status: 'active', avatarInitials: 'VC',
    avatarGradient: 'from-sky-400 to-cyan-600',
    productsCount: 1, activationsCount: 1, hasActiveSubscription: false,
    createdAt: '2025-03-12', lastLoginAt: '2026-06-20',
  },
  {
    id: 'u8', displayName: 'Javier Mora', email: 'jmora@outlook.com',
    role: UserRole.User, status: 'active', avatarInitials: 'JM',
    avatarGradient: 'from-slate-400 to-gray-600',
    productsCount: 0, activationsCount: 0, hasActiveSubscription: false,
    createdAt: '2025-04-18', lastLoginAt: '2026-05-30',
  },
];
