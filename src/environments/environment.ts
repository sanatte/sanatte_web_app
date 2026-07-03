export const environment = {
  production: false,
  apiUrl: 'http://localhost:5129/api',
  /** Dominio público donde se publica la app — usado en los QR impresos (siempre producción). */
  publicBaseUrl: 'https://sanatte.com',
  /** Firebase Console → Project Settings → app web "sanatte-web". */
  firebase: {
    apiKey: 'AIzaSyCzAYUzoFH276GYf_BE1JBSaYFjUhwOTAs',
    authDomain: 'sanatte-d819d.firebaseapp.com',
    projectId: 'sanatte-d819d',
    storageBucket: 'sanatte-d819d.firebasestorage.app',
    messagingSenderId: '92787889028',
    appId: '1:92787889028:web:e66393d968b481f676c3d1',
    measurementId: 'G-N31WGYDRE8',
  },
};
