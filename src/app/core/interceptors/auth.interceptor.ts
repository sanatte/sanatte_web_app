import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { MockAuthService } from '../services/mock-auth.service';

/** Adjunta el Bearer token a todas las peticiones a /api/.
 *  En fase Mock devuelve un token simulado.
 *  Cuando se integre Firebase, MockAuthService.getIdToken() será reemplazado
 *  por firebase.auth().currentUser?.getIdToken() sin cambiar este interceptor. */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(MockAuthService);
  if (!req.url.includes('/api/')) return next(req);
  // DEV: el backend corre con DevAuthBypass y resuelve la identidad por este
  // header (email del usuario mock). Con Firebase real el header desaparece y la
  // identidad viaja dentro del JWT. Ver DevAuthHandler en el backend.
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
