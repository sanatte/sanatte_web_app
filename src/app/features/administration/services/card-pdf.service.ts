import { ApplicationRef, createComponent, EnvironmentInjector, inject, Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ActivationCardComponent } from '../components/activation-card/activation-card.component';
import { License } from '../models/license.model';
import { QrService } from '../../../shared/services/qr.service';
import { environment } from '../../../../environments/environment';

// A4 landscape: 297mm × 210mm — two A6 cards (148mm × 105mm) side by side
const PDF_W  = 297;
const PDF_H  = 210;
const CARD_W = 148;
const CARD_H = 105;
const MARGIN = 3;
const COL_X  = [MARGIN, MARGIN + CARD_W + MARGIN * 2] as const;
const ROW_Y  = (PDF_H - CARD_H) / 2; // vertically centered

@Injectable({ providedIn: 'root' })
export class CardPdfService {
  private readonly qr      = inject(QrService);
  private readonly appRef  = inject(ApplicationRef);
  private readonly envInj  = inject(EnvironmentInjector);

  async generate(licenses: License[]): Promise<void> {
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    let firstPage = true;

    for (let i = 0; i < licenses.length; i++) {
      const license = licenses[i];
      const col = i % 2;

      if (col === 0 && !firstPage) pdf.addPage();
      firstPage = false;

      const qrUrl    = `${environment.publicBaseUrl}/activate?code=${encodeURIComponent(license.code)}`;
      const qrDataUrl = await this.qr.toDataUrl(qrUrl);

      const imgDataUrl = await this.renderCard(license, qrDataUrl);

      const x = COL_X[col];
      pdf.addImage(imgDataUrl, 'PNG', x, ROW_Y, CARD_W, CARD_H);

      this.addCropMarks(pdf, x, ROW_Y, CARD_W, CARD_H);
    }

    const ts = new Date().toISOString().slice(0, 10);
    pdf.save(`tarjetas-activacion-${ts}.pdf`);
  }

  private async renderCard(license: License, qrDataUrl: string): Promise<string> {
    const host = document.createElement('div');
    host.style.cssText = 'position:fixed;left:-9999px;top:0;z-index:-1;';
    document.body.appendChild(host);

    const ref = createComponent(ActivationCardComponent, {
      environmentInjector: this.envInj,
      hostElement: host,
    });
    ref.setInput('license', license);
    ref.setInput('qrDataUrl', qrDataUrl);
    this.appRef.attachView(ref.hostView);
    ref.changeDetectorRef.detectChanges();

    // Small delay to allow font rendering
    await new Promise(r => setTimeout(r, 80));

    const card = host.querySelector('.activation-card-root') as HTMLElement;
    const canvas = await html2canvas(card, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
      logging: false,
    });

    this.appRef.detachView(ref.hostView);
    ref.destroy();
    host.remove();

    return canvas.toDataURL('image/png');
  }

  private addCropMarks(pdf: jsPDF, x: number, y: number, w: number, h: number): void {
    const len = 3;
    const gap = 1;
    pdf.setDrawColor(180, 180, 180);
    pdf.setLineWidth(0.2);

    const corners: [number, number][] = [
      [x, y], [x + w, y], [x, y + h], [x + w, y + h],
    ];

    corners.forEach(([cx, cy]) => {
      const dx = cx === x ? -1 : 1;
      const dy = cy === y ? -1 : 1;
      pdf.line(cx + dx * gap, cy, cx + dx * (gap + len), cy);
      pdf.line(cx, cy + dy * gap, cx, cy + dy * (gap + len));
    });
  }
}
