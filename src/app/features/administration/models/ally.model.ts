/**
 * Ally — aliado/especialista del ecosistema Sanatte. Ofrece un convenio
 * (beneficio) a los usuarios con producto activo. Su card se muestra en la app
 * y la landing (según isActive).
 */
export interface Ally {
  id: string;
  name: string;                    // marca del aliado
  description?: string | null;
  pillar: string;                  // pilar de bienestar
  logoUrl?: string | null;
  brandColor: string;              // color de la card
  whatsApp: string;                // obligatorio → link wa.me
  website?: string | null;
  benefitTitle: string;            // convenio/beneficio
  benefitDescription?: string | null;
  isActive: boolean;               // controla visibilidad de la card
  createdAt: string;
}

/** Pilares de bienestar (lista inicial, ampliable). */
export const WELLNESS_PILLARS = [
  'Salud',
  'Salud mental',
  'Finanzas',
  'Deporte',
  'Alimentación',
];
