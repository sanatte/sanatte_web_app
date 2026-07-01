import { UserRole } from './role.model';

/**
 * Usuario autenticado. Estructura preparada para mapear 1:1 con el DTO
 * que entregará NestJS / Firebase Auth más adelante.
 */
export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  avatarUrl?: string;
}
