import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp, getApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private app: FirebaseApp;
  private _auth: Auth;

  constructor() {
    this.app = initializeApp(environment.firebase);
    this._auth = getAuth(this.app);
  }

  get auth(): Auth {
    return this._auth;
  }
}
