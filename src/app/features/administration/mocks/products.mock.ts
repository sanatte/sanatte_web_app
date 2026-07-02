import { Product } from '../models/product.model';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1', sku: 'WLN-001', name: 'Plena', type: 'physical', price: 89900,
    status: 'active', accessType: 'qr_activation', requiresActivation: true,
    description: 'Un planeador emocional en papel diseñado para acompañarte a escucharte, organizarte y cuidarte con amor. A través de un ciclo de 4 fases —Me Recojo, Me Reconozco, Me Expreso y Me Cuido— y códigos QR que desbloquean meditaciones y recursos digitales, Plena transforma la prisa en presencia y la culpa en poder. Tu mejor amiga en papel.',
    images: [
      { id: 'img-p1-1', gradient: 'from-indigo-500 to-violet-800', altText: 'Plena — portada planeador emocional', isPrimary: true },
      { id: 'img-p1-2', gradient: 'from-purple-300 to-indigo-500', altText: 'Página diaria: sentir, sanar y florecer', isPrimary: false },
      { id: 'img-p1-3', gradient: 'from-indigo-400 to-violet-700', altText: 'QR de fase que desbloquea recursos digitales', isPrimary: false },
      { id: 'img-p1-4', gradient: 'from-violet-500 to-purple-800', altText: 'Las 4 fases del viaje interior', isPrimary: false },
    ],
    entitlements: [
      { id: 'ent-p1-1', type: 'content_item', referenceId: 'res-plena-1', label: 'Fase 1 · Me Recojo' },
      { id: 'ent-p1-2', type: 'content_item', referenceId: 'res-plena-2', label: 'Fase 2 · Me Reconozco' },
      { id: 'ent-p1-3', type: 'content_item', referenceId: 'res-plena-3', label: 'Fase 3 · Me Expreso' },
      { id: 'ent-p1-4', type: 'content_item', referenceId: 'res-plena-4', label: 'Fase 4 · Me Cuido' },
    ],
    salesCount: 142, stock: 500,
    tags: ['Planeador emocional', 'Journaling', '4 fases', 'QR + recursos digitales', 'Amor propio'],
    specs: [
      { label: 'Formato', value: 'Planeador emocional en papel' },
      { label: 'Estructura', value: 'Ciclo de 4 fases: Me Recojo · Me Reconozco · Me Expreso · Me Cuido' },
      { label: 'Página diaria', value: 'Termómetro emocional, intención, hidratación, ritual y gratitud' },
      { label: 'Recursos digitales', value: 'Un QR por fase que desbloquea meditaciones y audios' },
      { label: 'Activación', value: 'Escanea el QR e ingresa con tu cuenta Sanatte' },
    ],
    createdAt: '2024-11-01',
  },
  {
    id: 'p2', sku: 'DIG-082', name: 'Guided Flow Pro', type: 'subscription', price: 39900,
    billingPeriod: 'monthly', status: 'active', accessType: 'subscription', requiresActivation: false,
    description: 'Suscripción premium a la biblioteca completa de recursos de bienestar.',
    images: [
      { id: 'img-p2-1', gradient: 'from-indigo-400 to-violet-600', altText: 'Guided Flow Pro', isPrimary: true },
      { id: 'img-p2-2', gradient: 'from-violet-400 to-indigo-600', altText: 'App', isPrimary: false },
    ],
    entitlements: [
      { id: 'ent-p2-1', type: 'content_item', referenceId: 'res-2', label: 'Deep Sleep Echoes' },
      { id: 'ent-p2-2', type: 'content_item', referenceId: 'res-1', label: 'Morning Flow Yoga' },
      { id: 'ent-p2-3', type: 'content_item', referenceId: 'res-5', label: 'Anxiety Release Alpha' },
      { id: 'ent-p2-4', type: 'content_item', referenceId: 'res-7', label: 'Mindful Breathing' },
      { id: 'ent-p2-5', type: 'content_item', referenceId: 'res-3', label: 'Manual de meditación' },
    ],
    salesCount: 320,
    tags: ['Suscripción mensual', 'Acceso ilimitado'],
    specs: [
      { label: 'Facturación', value: 'Mensual / Anual' },
      { label: 'Dispositivos', value: 'Hasta 3 simultáneos' },
    ],
    createdAt: '2024-09-15',
  },
  {
    id: 'p3', sku: 'DIG-115', name: 'The Silent Mind (eBook)', type: 'digital', price: 34900,
    status: 'inactive', accessType: 'direct_purchase', requiresActivation: false,
    description: 'Guía completa para reducir la ansiedad. 200 páginas en PDF.',
    images: [
      { id: 'img-p3-1', gradient: 'from-purple-300 to-indigo-500', altText: 'Portada eBook', isPrimary: true },
    ],
    entitlements: [
      { id: 'ent-p3-1', type: 'content_item', referenceId: 'res-3', label: 'The Silent Mind PDF' },
    ],
    salesCount: 89,
    tags: ['eBook', 'PDF descargable', 'Ansiedad'],
    specs: [
      { label: 'Formato', value: 'PDF (descargable)' },
      { label: 'Páginas', value: '200 páginas' },
    ],
    createdAt: '2024-10-20',
  },
  {
    id: 'p4', sku: 'WLN-002', name: 'Serenity Kit', type: 'physical', price: 149900,
    status: 'active', accessType: 'qr_activation', requiresActivation: true,
    description: 'Kit físico de bienestar con vela aromática, difusor y tarjeta de activación.',
    images: [
      { id: 'img-p4-1', gradient: 'from-rose-300 to-purple-500', altText: 'Serenity Kit', isPrimary: true },
      { id: 'img-p4-2', gradient: 'from-pink-300 to-rose-500', altText: 'Vela', isPrimary: false },
    ],
    entitlements: [
      { id: 'ent-p4-1', type: 'content_item', referenceId: 'res-7', label: 'Ritual nocturno' },
      { id: 'ent-p4-2', type: 'content_item', referenceId: 'res-2', label: 'Respiración 4-7-8' },
    ],
    salesCount: 57, stock: 200,
    tags: ['Kit físico', 'Aromaterapia', 'QR Sync'],
    specs: [
      { label: 'Contenido', value: 'Vela 150g + Difusor cerámica + Tarjeta QR' },
      { label: 'Fragancia', value: 'Lavanda & Eucalipto' },
    ],
    createdAt: '2025-01-10',
  },
  {
    id: 'p5', sku: 'DIG-200', name: 'Guided Flow Basic', type: 'subscription', price: 19900,
    billingPeriod: 'monthly', status: 'active', accessType: 'subscription', requiresActivation: false,
    description: 'Plan de suscripción básico con acceso a 10 recursos curados.',
    images: [
      { id: 'img-p5-1', gradient: 'from-sky-400 to-indigo-500', altText: 'Guided Flow Basic', isPrimary: true },
    ],
    entitlements: [
      { id: 'ent-p5-1', type: 'content_item', referenceId: 'res-7', label: 'Inicio consciente' },
      { id: 'ent-p5-2', type: 'content_item', referenceId: 'res-1', label: 'Yoga suave' },
    ],
    salesCount: 210,
    tags: ['Suscripción mensual', 'Plan básico'],
    specs: [{ label: 'Dispositivos', value: '1 dispositivo' }],
    createdAt: '2025-02-01',
  },
  {
    id: 'p6', sku: 'DIG-310', name: 'Curso: Mindfulness 30 días', type: 'digital', price: 129900,
    status: 'active', accessType: 'direct_purchase', requiresActivation: false,
    description: 'Programa digital de 30 días con videos, audios y guía PDF.',
    images: [
      { id: 'img-p6-1', gradient: 'from-emerald-400 to-teal-600', altText: 'Mindfulness 30 días', isPrimary: true },
      { id: 'img-p6-2', gradient: 'from-teal-400 to-emerald-600', altText: 'Semana 1', isPrimary: false },
    ],
    entitlements: [
      { id: 'ent-p6-1', type: 'content_item', referenceId: 'res-1', label: 'Semana 1 — Fundamentos' },
      { id: 'ent-p6-2', type: 'content_item', referenceId: 'res-5', label: 'Semana 2 — Respiración' },
      { id: 'ent-p6-3', type: 'content_item', referenceId: 'res-2', label: 'Audios diarios pack' },
      { id: 'ent-p6-4', type: 'content_item', referenceId: 'res-3', label: 'Guía del programa' },
    ],
    salesCount: 174,
    tags: ['Curso 30 días', 'Video + Audio + PDF', 'Mindfulness'],
    specs: [
      { label: 'Duración', value: '30 días' },
      { label: 'Nivel', value: 'Principiante a intermedio' },
    ],
    createdAt: '2025-03-05',
  },
];
