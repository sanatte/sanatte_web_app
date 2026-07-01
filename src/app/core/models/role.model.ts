/**
 * Roles soportados por la aplicación.
 * En fase Mock el rol se asigna manualmente; con NestJS vendrá del backend.
 */
export enum UserRole {
  User = 'USER',
  Admin = 'ADMIN',
}
