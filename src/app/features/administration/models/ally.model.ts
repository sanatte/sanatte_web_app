/**
 * Ally — aliado/especialista del ecosistema Sanatte. Ofrece un convenio
 * (beneficio) a los usuarios con producto activo. Su card se muestra en la app
 * y la landing (según isActive).
 */
export interface Ally {
  id: string;
  name: string;
  description?: string | null;
  pillar: string;
  logoUrl?: string | null;
  brandColor: string;
  whatsApp: string;
  website?: string | null;
  benefitTitle: string;
  benefitDescription?: string | null;
  isActive: boolean;
  discountCode?: string | null;
  discountPercentage?: number | null;
  discountExpiresAt?: string | null;
  discountUsageCount: number;
  createdAt: string;
}

export interface DiscountCodeValidation {
  isValid: boolean;
  allyName?: string | null;
  discountPercentage?: number | null;
  errorMessage?: string | null;
}

/** Pilares de bienestar (lista inicial, ampliable). */
export const WELLNESS_PILLARS = [
  'Salud',
  'Salud mental',
  'Finanzas',
  'Deporte',
  'Alimentación',
];
