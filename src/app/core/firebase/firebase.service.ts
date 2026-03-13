import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { initializeAppCheck, ReCaptchaV3Provider, getToken, AppCheck } from 'firebase/app-check';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private app: FirebaseApp;
  private _auth: Auth;
  private _appCheck: AppCheck;

  constructor() {
    this.app = initializeApp(environment.firebase);
    this._auth = getAuth(this.app);
    
    // Si estamos en entorno de desarrollo/local, decirle a Firebase que genere un token de debug
    if (!environment.production) {
      (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    }

    // Inicializar App Check con ReCaptcha V3
    this._appCheck = initializeAppCheck(this.app, {
      provider: new ReCaptchaV3Provider(environment.recaptchaSiteKey || 'INSERTA_TU_CLAVE'),
      isTokenAutoRefreshEnabled: true
    });
  }

  get auth(): Auth {
    return this._auth;
  }

  /** Obtiene el token de AppCheck para enviarlo en las cabeceras HTTP */
  async getAppCheckToken(): Promise<string | null> {
    try {
      const result = await getToken(this._appCheck, false);
      return result.token;
    } catch (e) {
      console.warn('No se pudo obtener el token de App Check', e);
      return null;
    }
  }
}
