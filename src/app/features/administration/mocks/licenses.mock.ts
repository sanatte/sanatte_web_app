import { License, LicenseActivity, TrendPoint } from '../models/license.model';

export const MOCK_LICENSES: License[] = [
  {
    id: 'l1', code: 'SN-X4-9218', batchId: 'Lote #42-A',
    productId: 'p1', productName: 'Plena', orderId: '#SAN-9021',
    userId: 'u1', userName: 'Ana García', userInitials: 'AG',
    userAvatarGradient: 'from-violet-400 to-purple-600',
    status: 'active', generatedAt: '2026-05-24', activatedAt: '2026-05-25',
  },
  {
    id: 'l2', code: 'SN-B2-0051', batchId: 'Lote #42-A',
    productId: 'p1', productName: 'Plena', orderId: '#SAN-9019',
    status: 'available', generatedAt: '2026-05-23',
  },
  {
    id: 'l3', code: 'SN-Z9-1142', batchId: 'Lote #38-B',
    productId: 'p4', productName: 'Serenity Kit', orderId: '#SAN-9014',
    userId: 'u4', userName: 'Miguel Torres', userInitials: 'MT',
    userAvatarGradient: 'from-rose-400 to-red-600',
    status: 'revoked', generatedAt: '2026-04-10', activatedAt: '2026-04-12',
  },
  {
    id: 'l4', code: 'SN-R3-4401', batchId: 'Lote #42-A',
    productId: 'p1', productName: 'Plena', orderId: '#SAN-9017',
    userId: 'u5', userName: 'Sofía Reyes', userInitials: 'SR',
    userAvatarGradient: 'from-pink-400 to-rose-600',
    status: 'active', generatedAt: '2026-05-21', activatedAt: '2026-05-22',
  },
  {
    id: 'l5', code: 'SN-K7-7730', batchId: 'Lote #43-C',
    productId: 'p4', productName: 'Serenity Kit', orderId: '#SAN-9015',
    userId: 'u7', userName: 'Valentina Cruz', userInitials: 'VC',
    userAvatarGradient: 'from-sky-400 to-cyan-600',
    status: 'active', generatedAt: '2026-05-19', activatedAt: '2026-05-20',
  },
  {
    id: 'l6', code: 'SN-M1-2298', batchId: 'Lote #43-C',
    productId: 'p1', productName: 'Plena', orderId: '#SAN-9005',
    status: 'available', generatedAt: '2026-05-10',
  },
  {
    id: 'l7', code: 'SN-P9-0044', batchId: 'Lote #38-B',
    productId: 'p4', productName: 'Serenity Kit', orderId: '#SAN-9008',
    userId: 'u2', userName: 'Carlos Mendez', userInitials: 'CM',
    userAvatarGradient: 'from-indigo-400 to-blue-600',
    status: 'active', generatedAt: '2026-04-15', activatedAt: '2026-04-18',
  },
  {
    id: 'l8', code: 'SN-T5-8817', batchId: 'Lote #44-A',
    productId: 'p1', productName: 'Plena', orderId: '#SAN-9018',
    status: 'available', generatedAt: '2026-05-22',
  },
];

export const MOCK_LICENSE_ACTIVITY: LicenseActivity[] = [
  {
    id: 'a1', type: 'activation',
    message: 'Nueva activación: Plena activada por Ana García.',
    detail: 'Hace 2 minutos • Código: SN-X4-9218',
  timeAgo: '2 min',
  },
  {
    id: 'a2', type: 'batch',
    message: 'Lote #44-A (50 unidades) generado y exportado a PDF.',
    detail: 'Hace 45 minutos • Exportado por Admin',
    timeAgo: '45 min',
  },
  {
    id: 'a3', type: 'revocation',
    message: 'Alerta de revocación: SN-Z9-1142 marcado por actividad sospechosa.',
    detail: 'Hace 3 horas • IP: 192.168.1.44',
    timeAgo: '3h',
  },
];

export const MOCK_TREND_DATA: TrendPoint[] = [
  { day: 'Lun', value: 120, heightPercent: 40 },
  { day: 'Mar', value: 185, heightPercent: 62 },
  { day: 'Mié', value: 150, heightPercent: 50 },
  { day: 'Jue', value: 240, heightPercent: 80 },
  { day: 'Vie', value: 195, heightPercent: 65 },
  { day: 'Sáb', value: 294, heightPercent: 98 },
  { day: 'Dom', value: 225, heightPercent: 75 },
];
