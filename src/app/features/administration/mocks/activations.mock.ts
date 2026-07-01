import { Activation, DeviceStat, SecurityAlert } from '../models/activation.model';

export const MOCK_ACTIVATIONS: Activation[] = [
  {
    id: 'act-1', licenseCode: 'SN-X4-9218', orderId: '#SAN-9021',
    productId: 'p1', productName: 'Plena',
    userId: 'u1', userName: 'Ana García', userEmail: 'ana.garcia@gmail.com',
    userInitials: 'AG', userAvatarGradient: 'from-violet-400 to-purple-600',
    status: 'success', date: '25 May, 2026', time: '14:32',
    ipAddress: '192.168.1.45', device: 'iPhone 14 Pro · iOS 17',
    resourcesUnlocked: 4, createdAt: '2026-05-25',
  },
  {
    id: 'act-2', licenseCode: 'SN-K9-0112', orderId: '#SAN-9019',
    productId: 'p4', productName: 'Serenity Kit',
    userId: 'u3', userName: 'Laura Ríos', userEmail: 'laurarios@sanatte.com',
    userInitials: 'LR', userAvatarGradient: 'from-emerald-400 to-teal-600',
    status: 'pending', date: '24 May, 2026', time: '09:10',
    ipAddress: '85.23.11.102', device: 'Desktop · Chrome 118',
    resourcesUnlocked: 0, createdAt: '2026-05-24',
  },
  {
    id: 'act-3', licenseCode: 'SN-Z1-4470', orderId: '#SAN-9005',
    productId: 'p1', productName: 'Plena',
    userId: 'u6', userName: 'Andrés Vega', userEmail: 'avega@empresa.co',
    userInitials: 'AV', userAvatarGradient: 'from-amber-400 to-orange-500',
    status: 'failed', date: '23 May, 2026', time: '18:45',
    ipAddress: '102.44.5.11', device: 'Pixel 7 · Android 14',
    resourcesUnlocked: 0, createdAt: '2026-05-23',
  },
  {
    id: 'act-4', licenseCode: 'SN-R3-4401', orderId: '#SAN-9017',
    productId: 'p1', productName: 'Plena',
    userId: 'u5', userName: 'Sofía Reyes', userEmail: 'sofia.reyes@hotmail.com',
    userInitials: 'SR', userAvatarGradient: 'from-pink-400 to-rose-600',
    status: 'success', date: '22 May, 2026', time: '11:05',
    ipAddress: '181.12.90.33', device: 'iPhone 15 · iOS 17',
    resourcesUnlocked: 4, createdAt: '2026-05-22',
  },
  {
    id: 'act-5', licenseCode: 'SN-K7-7730', orderId: '#SAN-9015',
    productId: 'p4', productName: 'Serenity Kit',
    userId: 'u7', userName: 'Valentina Cruz', userEmail: 'vcruz@gmail.com',
    userInitials: 'VC', userAvatarGradient: 'from-sky-400 to-cyan-600',
    status: 'success', date: '20 May, 2026', time: '16:22',
    ipAddress: '190.5.14.77', device: 'Samsung S23 · Android 14',
    resourcesUnlocked: 2, createdAt: '2026-05-20',
  },
  {
    id: 'act-6', licenseCode: 'SN-P9-0044', orderId: '#SAN-9008',
    productId: 'p4', productName: 'Serenity Kit',
    userId: 'u2', userName: 'Carlos Mendez', userEmail: 'cmendez@outlook.com',
    userInitials: 'CM', userAvatarGradient: 'from-indigo-400 to-blue-600',
    status: 'success', date: '18 Apr, 2026', time: '08:30',
    ipAddress: '200.40.8.99', device: 'iPad Pro · iPadOS 17',
    resourcesUnlocked: 2, createdAt: '2026-04-18',
  },
  {
    id: 'act-7', licenseCode: 'SN-Z9-1142', orderId: '#SAN-9014',
    productId: 'p4', productName: 'Serenity Kit',
    userId: 'u4', userName: 'Miguel Torres', userEmail: 'miguel.t@gmail.com',
    userInitials: 'MT', userAvatarGradient: 'from-rose-400 to-red-600',
    status: 'failed', date: '12 Sep, 2026', time: '22:15',
    ipAddress: '181.12.90.33', device: 'iPhone 12 · iOS 16',
    resourcesUnlocked: 0, createdAt: '2026-09-12',
  },
];

export const MOCK_DEVICE_STATS: DeviceStat[] = [
  { label: 'iOS',     percentage: 70, heightPercent: 70, colorClass: 'bg-primary',          dotClass: 'bg-primary' },
  { label: 'Android', percentage: 25, heightPercent: 45, colorClass: 'bg-secondary',         dotClass: 'bg-secondary' },
  { label: 'Web',     percentage: 4,  heightPercent: 25, colorClass: 'bg-tertiary',           dotClass: 'bg-tertiary' },
  { label: 'Tablet',  percentage: 1,  heightPercent: 15, colorClass: 'bg-primary-fixed-dim',  dotClass: 'bg-primary-fixed-dim' },
];

export const MOCK_SECURITY_ALERTS: SecurityAlert[] = [
  {
    id: 'sa-1', type: 'error',
    title: 'Múltiples fallos IP: 181.x.x.x',
    detail: 'Hace 5 min · 12 intentos fallidos',
  },
  {
    id: 'sa-2', type: 'warning',
    title: 'Intento de licencia duplicada SN-Z9-1142',
    detail: 'Hace 2 horas · Bloqueo automático aplicado',
  },
];
