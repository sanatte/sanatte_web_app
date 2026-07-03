import { Injectable } from '@angular/core';
import QRCode from 'qrcode';

/**
 * Genera códigos QR en el cliente (sin llamadas externas) y los descarga como PNG.
 * Se usa en el panel admin para imprimir los QR de los recursos de Plena.
 */
@Injectable({ providedIn: 'root' })
export class QrService {
  /** Descarga un PNG de alta resolución del QR que apunta a `url`. */
  async downloadPng(url: string, filename: string): Promise<void> {
    const dataUrl = await QRCode.toDataURL(url, {
      width: 1024,          // alta resolución para impresión
      margin: 2,
      errorCorrectionLevel: 'M',
      color: { dark: '#1e1b2e', light: '#ffffff' },
    });
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename.endsWith('.png') ? filename : `${filename}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}
