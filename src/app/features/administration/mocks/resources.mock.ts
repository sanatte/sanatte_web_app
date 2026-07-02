import { Resource } from '../models/resource.model';

export const MOCK_RESOURCES: Resource[] = [
  // ── Recursos digitales de Plena (uno por fase — se desbloquean vía QR) ──────
  {
    id: 'res-plena-1', title: 'Me Recojo · Meditación para soltar',
    description: 'Un refugio para respirar y descansar. Suelta lo que ya no te sostiene y regresa a ti con una meditación guiada de la Fase 1.',
    type: 'audio', status: 'published',
    tags: ['plena', 'fase-1', 'meditación', 'soltar'], duration: '10:00',
    thumbnailGradient: 'from-indigo-500 to-violet-800', createdAt: '2024-11-01',
  },
  {
    id: 'res-plena-2', title: 'Me Reconozco · Reencuentro en el espejo',
    description: 'Audio guiado para mirarte con honestidad y ternura, reconectar con tu niña interior y honrar tus fortalezas.',
    type: 'audio', status: 'published',
    tags: ['plena', 'fase-2', 'autoconocimiento'], duration: '12:30',
    thumbnailGradient: 'from-purple-400 to-indigo-600', createdAt: '2024-11-01',
  },
  {
    id: 'res-plena-3', title: 'Me Expreso · El eco de mi verdad',
    description: 'Activa tu voz creadora: afirmaciones y práctica sonora para transformar lo interno en expresión viva.',
    type: 'video', status: 'published',
    tags: ['plena', 'fase-3', 'expresión', 'manifiesto'], duration: '09:15',
    thumbnailGradient: 'from-violet-500 to-fuchsia-700', createdAt: '2024-11-01',
  },
  {
    id: 'res-plena-4', title: 'Me Cuido · El templo de mi esencia',
    description: 'Ritual de cierre para habitar tu cuerpo con gratitud y sostener tu bienestar con límites amorosos.',
    type: 'audio', status: 'published',
    tags: ['plena', 'fase-4', 'autocuidado', 'ritual'], duration: '11:45',
    thumbnailGradient: 'from-blue-500 to-indigo-700', createdAt: '2024-11-01',
  },
  {
    id: 'res-1', title: 'Morning Mindfulness Flow',
    description: 'Secuencia guiada para claridad matutina y despertar físico.',
    type: 'video', status: 'published',
    tags: ['exercise', 'morning', 'mindfulness'], duration: '12:45',
    thumbnailGradient: 'from-emerald-400 to-teal-600', createdAt: '2024-10-01',
  },
  {
    id: 'res-2', title: 'Deep Sleep Frequency',
    description: 'Beats binaurales ambientales para mejorar el ciclo REM profundo.',
    type: 'audio', status: 'published',
    tags: ['sleep', 'meditation', 'relaxation'], duration: '25:00',
    thumbnailGradient: 'from-indigo-400 to-purple-700', createdAt: '2024-10-05',
  },
  {
    id: 'res-3', title: 'Guía de 30 días de gratitud',
    description: 'Cuaderno de trabajo con ejercicios diarios para inteligencia emocional.',
    type: 'pdf', status: 'draft',
    tags: ['journaling', 'gratitude', 'exercise'], fileSize: '4.2 MB',
    thumbnailGradient: 'from-amber-400 to-orange-500', createdAt: '2024-10-12',
  },
  {
    id: 'res-4', title: 'Neuroscience of Habit',
    description: 'Explorando los ganglios basales y cómo reprogramar tu cerebro.',
    type: 'article', status: 'published',
    tags: ['neuroscience', 'habits', 'education'], readTime: '8 min',
    thumbnailGradient: 'from-slate-400 to-gray-600', createdAt: '2024-10-18',
  },
  {
    id: 'res-5', title: 'Spine Alignment Drills',
    description: 'Movimientos correctivos para trabajadores remotos.',
    type: 'video', status: 'published',
    tags: ['exercise', 'posture', 'wellness'], duration: '18:30',
    thumbnailGradient: 'from-rose-400 to-pink-600', createdAt: '2024-11-01',
  },
  {
    id: 'res-6', title: 'Evening Restoration Tai Chi',
    description: 'Movimientos de flujo lento para liberar el cortisol.',
    type: 'video', status: 'draft',
    tags: ['exercise', 'evening', 'relaxation'], duration: '42:15',
    thumbnailGradient: 'from-violet-500 to-purple-800', createdAt: '2024-11-10',
  },
  {
    id: 'res-7', title: 'Meditación guiada de inicio',
    description: 'Introducción a la meditación para usuarios nuevos de la agenda Plena.',
    type: 'audio', status: 'published',
    tags: ['meditation', 'beginners', 'plena'], duration: '10:00',
    thumbnailGradient: 'from-purple-400 to-violet-600', createdAt: '2024-11-15',
  },
  {
    id: 'res-8', title: 'El arte de la presencia',
    description: 'Mindfulness aplicado a la vida cotidiana con ejercicios prácticos.',
    type: 'article', status: 'published',
    tags: ['mindfulness', 'presence', 'plena'], readTime: '5 min',
    thumbnailGradient: 'from-sky-400 to-blue-600', createdAt: '2024-11-20',
  },
];
