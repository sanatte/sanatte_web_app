import { Injectable } from '@angular/core';
import QRCode from 'qrcode';

@Injectable({ providedIn: 'root' })
export class QrService {
  async toDataUrl(url: string): Promise<string> {
    return QRCode.toDataURL(url, {
      width: 1024,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: { dark: '#1e1b2e', light: '#ffffff' },
    });
  }

  async downloadPng(url: string, filename: string): Promise<void> {
    const dataUrl = await this.toDataUrl(url);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename.endsWith('.png') ? filename : `${filename}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}
