import { Order } from '../models/order.model';

export const MOCK_ORDERS: Order[] = [
  {
    id: 'o1', orderNumber: '#SAN-9021',
    buyerName: 'Lucas Martínez', buyerEmail: 'lucas.m@email.com', buyerInitials: 'LM',
    buyerAvatarGradient: 'from-violet-400 to-purple-600',
    products: [
      { id: 'p1', name: 'Plena', type: 'physical' },
      { id: 'p2', name: 'Guided Flow Pro', type: 'subscription' },
      { id: 'p6', name: 'Mindfulness 30 días', type: 'digital' },
    ],
    date: '24 May, 2026', time: '14:32h', total: 142000,
    paymentStatus: 'paid', deliveryStatus: 'shipped', createdAt: '2026-05-24',
  },
  {
    id: 'o2', orderNumber: '#SAN-9020',
    buyerName: 'Sara Velasco', buyerEmail: 'sara.v@domain.es', buyerInitials: 'SV',
    buyerAvatarGradient: 'from-indigo-400 to-blue-600',
    products: [{ id: 'p2', name: 'Guided Flow Pro', type: 'subscription' }],
    date: '23 May, 2026', time: '18:05h', total: 299900,
    paymentStatus: 'paid', deliveryStatus: 'subscription_active', createdAt: '2026-05-23',
  },
  {
    id: 'o3', orderNumber: '#SAN-9019',
    buyerName: 'Jordi Ferrán', buyerEmail: 'jordi.f@gmail.com', buyerInitials: 'JF',
    buyerAvatarGradient: 'from-emerald-400 to-teal-600',
    products: [{ id: 'p4', name: 'Serenity Kit', type: 'physical' }],
    date: '23 May, 2026', time: '10:15h', total: 89000,
    paymentStatus: 'pending', deliveryStatus: 'preparing', createdAt: '2026-05-23',
  },
  {
    id: 'o4', orderNumber: '#SAN-9018',
    buyerName: 'María Castro', buyerEmail: 'maria.c@gmail.com', buyerInitials: 'MC',
    buyerAvatarGradient: 'from-rose-400 to-red-500',
    products: [{ id: 'p5', name: 'Guided Flow Basic', type: 'subscription' }],
    date: '22 May, 2026', time: '09:48h', total: 55000,
    paymentStatus: 'cancelled', deliveryStatus: 'cancelled', createdAt: '2026-05-22',
  },
  {
    id: 'o5', orderNumber: '#SAN-9017',
    buyerName: 'Ana García', buyerEmail: 'ana.garcia@gmail.com', buyerInitials: 'AG',
    buyerAvatarGradient: 'from-pink-400 to-rose-600',
    products: [
      { id: 'p1', name: 'Plena', type: 'physical' },
      { id: 'p3', name: 'The Silent Mind', type: 'digital' },
    ],
    date: '21 May, 2026', time: '16:20h', total: 69000,
    paymentStatus: 'paid', deliveryStatus: 'pending_activation', createdAt: '2026-05-21',
  },
  {
    id: 'o6', orderNumber: '#SAN-9016',
    buyerName: 'Carlos Mendez', buyerEmail: 'cmendez@outlook.com', buyerInitials: 'CM',
    buyerAvatarGradient: 'from-sky-400 to-cyan-600',
    products: [{ id: 'p3', name: 'The Silent Mind', type: 'digital' }],
    date: '20 May, 2026', time: '11:30h', total: 45000,
    paymentStatus: 'paid', deliveryStatus: 'digital_active', createdAt: '2026-05-20',
  },
  {
    id: 'o7', orderNumber: '#SAN-9015',
    buyerName: 'Sofía Reyes', buyerEmail: 'sofia.reyes@hotmail.com', buyerInitials: 'SR',
    buyerAvatarGradient: 'from-amber-400 to-orange-500',
    products: [{ id: 'p4', name: 'Serenity Kit', type: 'physical' }],
    date: '19 May, 2026', time: '08:55h', total: 68000,
    paymentStatus: 'paid', deliveryStatus: 'delivered', createdAt: '2026-05-19',
  },
  {
    id: 'o8', orderNumber: '#SAN-9014',
    buyerName: 'Andrés Vega', buyerEmail: 'avega@empresa.co', buyerInitials: 'AV',
    buyerAvatarGradient: 'from-slate-400 to-gray-600',
    products: [
      { id: 'p1', name: 'Plena', type: 'physical' },
      { id: 'p2', name: 'Guided Flow Pro', type: 'subscription' },
    ],
    date: '18 May, 2026', time: '20:10h', total: 190000,
    paymentStatus: 'paid', deliveryStatus: 'shipped', createdAt: '2026-05-18',
  },
];
