import { ApplicationRef, createComponent, EnvironmentInjector, inject, Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ActivationCardComponent } from '../components/activation-card/activation-card.component';
import { License } from '../models/license.model';
import { QrService } from '../../../shared/services/qr.service';
import { environment } from '../../../../environments/environment';

// Oficio portrait: 216mm × 356mm — 2 columnas × 4 filas = 8 tarjetas por hoja
const PAGE_W  = 216;
const PAGE_H  = 356;
const MARGIN  = 8;
const GAP     = 4;
const COLS    = 2;
const ROWS    = 4;
const CARD_W  = (PAGE_W - MARGIN * 2 - GAP * (COLS - 1)) / COLS;   // 98mm
const CARD_H  = (PAGE_H - MARGIN * 2 - GAP * (ROWS - 1)) / ROWS;   // 82mm
const CARDS_PER_PAGE = COLS * ROWS;

function cardPosition(index: number): { x: number; y: number } {
  const posInPage = index % CARDS_PER_PAGE;
  const col = posInPage % COLS;
  const row = Math.floor(posInPage / COLS);
  return {
    x: MARGIN + col * (CARD_W + GAP),
    y: MARGIN + row * (CARD_H + GAP),
  };
}

@Injectable({ providedIn: 'root' })
export class CardPdfService {
  private readonly qr      = inject(QrService);
  private readonly appRef  = inject(ApplicationRef);
  private readonly envInj  = inject(EnvironmentInjector);

  async generate(licenses: License[]): Promise<void> {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [PAGE_W, PAGE_H],
    });

    for (let i = 0; i < licenses.length; i++) {
      const license = licenses[i];

      if (i > 0 && i % CARDS_PER_PAGE === 0) pdf.addPage();

      const qrUrl     = `${environment.publicBaseUrl}/activate?code=${encodeURIComponent(license.code)}`;
      const qrDataUrl = await this.qr.toDataUrl(qrUrl);
      const imgDataUrl = await this.renderCard(license, qrDataUrl);

      const { x, y } = cardPosition(i);
      pdf.addImage(imgDataUrl, 'PNG', x, y, CARD_W, CARD_H);
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

}
