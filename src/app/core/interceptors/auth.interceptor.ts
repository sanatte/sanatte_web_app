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
  return from(auth.getIdToken()).pipe(
    switchMap((token) => {
      if (!token) return next(req);
      return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
    })
  );
};
