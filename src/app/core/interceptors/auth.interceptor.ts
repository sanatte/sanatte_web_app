import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

/** Adjunta el ID token de Firebase como Bearer a todas las peticiones a /api/.
 *  El backend solo valida el token (no lo emite). El header X-Dev-User se
 *  mantiene por compatibilidad con el DevAuthBypass del backend (ignorado
 *  cuando el bypass está desactivado, que es el modo con Firebase real). */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  if (!req.url.includes('/api/')) return next(req);
  const devUser = auth.currentUser()?.email;
  return from(auth.getIdToken()).pipe(
    switchMap((token) => {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      if (devUser) headers['X-Dev-User'] = devUser;
      return Object.keys(headers).length
        ? next(req.clone({ setHeaders: headers }))
        : next(req);
    })
  );
};
