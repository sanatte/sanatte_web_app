import { Routes } from '@angular/router';
import { guestGuard } from '../../core/guards/guest.guard';

export const authenticationRoutes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./register/register.component').then((m) => m.RegisterComponent),
  },
  {
    // Verifica tu correo (registro pendiente — aún sin sesión activa).
    path: 'verify-email',
    loadComponent: () => import('./verify-email/verify-email.component').then((m) => m.VerifyEmailComponent),
  },
  {
    // Destino del enlace del correo (Firebase: /auth/action?mode=verifyEmail&oobCode=…).
    path: 'verified',
    loadComponent: () => import('./verified/verified.component').then((m) => m.VerifiedComponent),
  },
  {
    path: 'forgot',
    loadComponent: () => import('./forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent),
  },
  {
    // Destino del enlace del correo (Firebase: /auth/action?mode=resetPassword&oobCode=…).
    path: 'reset',
    loadComponent: () => import('./reset-password/reset-password.component').then((m) => m.ResetPasswordComponent),
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
