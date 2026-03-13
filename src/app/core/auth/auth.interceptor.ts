import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap, forkJoin } from 'rxjs';
import { AuthService } from './auth.service';
import { FirebaseService } from '../firebase/firebase.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const firebaseService = inject(FirebaseService);

  // Only intercept API requests
  if (!req.url.includes('/api/')) {
    return next(req);
  }

  // Obtener en paralelo el Token de Auth y el Token de AppCheck
  return forkJoin({
    token: from(authService.getIdToken()),
    appCheck: from(firebaseService.getAppCheckToken())
  }).pipe(
    switchMap(({ token, appCheck }) => {
      let headers = req.headers;

      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
      
      if (appCheck) {
        headers = headers.set('X-Firebase-AppCheck', appCheck);
      }

      const cloned = req.clone({ headers });
      return next(cloned);
    })
  );
};
