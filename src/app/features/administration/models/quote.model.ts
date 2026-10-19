export interface Quote {
  id: string;
  textEs: string;
  textEn?: string | null;
  author: string;
  /** Fecha `yyyy-MM-dd` en que esta frase es "la del día"; null = rotación automática. */
  scheduledFor?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string | null;
}
