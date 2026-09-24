import { Component, input } from '@angular/core';
import { NgFor } from '@angular/common';
import { License } from '../../models/license.model';

export interface CardTab {
  label: string;
  /** SVG path(s) dentro de viewBox "0 0 24 24" */
  svgPath: string;
}

const DEFAULT_TABS: CardTab[] = [
  {
    label: 'Audios guiados',
    svgPath: 'M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6zm-2 16a2 2 0 1 1 0-4 2 2 0 0 1 0 4z',
  },
  {
    label: 'Ejercicios',
    svgPath: 'M13.49 5.48a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z',
  },
  {
    label: 'Recursos digitales',
    svgPath: 'M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z',
  },
  {
    label: 'Bienestar diario',
    svgPath: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  },
];

@Component({
  selector: 'app-activation-card',
  standalone: true,
  imports: [NgFor],
  template: `
    <div class="card-root">

      <!-- ───── HEADER ───── -->
      <header class="card-header">
        <div class="header-text">
          <h1 class="product-title">¡Bienvenida a<br>{{ license().productName }}!</h1>
          <p class="product-sub">Tu viaje comienza aquí.</p>
        </div>
        <img src="/images/sanatte_wellness.png"
             alt="Sanatte Wellness Ecosystem"
             class="header-logo"
             crossorigin="anonymous" />
      </header>

      <div class="header-rule"></div>

      <!-- ───── BODY ───── -->
      <main class="card-body">

        <!-- Left: isotipo + mantra -->
        <div class="body-left">
          <div class="isotipo-wrap">
            <img src="/images/flor_isotipo.png"
                 alt="Flor Sanatte"
                 class="isotipo-img"
                 crossorigin="anonymous" />
          </div>
          <blockquote class="mantra">{{ fraseInspiracional() }}</blockquote>
        </div>

        <!-- Divider -->
        <div class="body-divider"></div>

        <!-- Right: QR limpio -->
        <div class="body-right">
          <img [src]="qrDataUrl()" alt="QR de activación" class="qr-img" crossorigin="anonymous"/>
          <p class="serial">{{ license().code }}</p>
        </div>

      </main>

      <!-- ───── FOOTER ───── -->
      <footer class="card-footer">
        <div *ngFor="let tab of tabs()" class="footer-tab">
          <svg viewBox="0 0 24 24" class="footer-icon" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path [attr.d]="tab.svgPath"/>
          </svg>
          <span class="footer-label">{{ tab.label }}</span>
        </div>
      </footer>

    </div>
  `,
  styles: [`
    :host { display: block; font-family: 'Manrope', 'Be Vietnam Pro', system-ui, sans-serif; }

    .card-root {
      width: 560px;
      height: 469px;
      background: #faf7f2;
      border-radius: 14px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 6px 28px rgba(30,27,46,0.13);
    }

    /* ── Header ── */
    .card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 20px 22px 12px;
      flex-shrink: 0;
    }

    .header-text { flex: 1; padding-right: 8px; text-align: center; }

    .product-title {
      font-size: 22px;
      font-weight: 800;
      color: #1e1b2e;
      margin: 0;
      line-height: 1.2;
      letter-spacing: -0.02em;
    }

    .product-sub {
      font-size: 12px;
      color: #6b38d4;
      margin: 6px 0 0;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .header-logo {
      width: 88px;
      height: auto;
      flex-shrink: 0;
      mix-blend-mode: multiply;
    }

    .header-rule {
      height: 1px;
      background: linear-gradient(to right, transparent, #d8d0e8 30%, #d8d0e8 70%, transparent);
      margin: 0 22px;
      flex-shrink: 0;
    }

    /* ── Body ── */
    .card-body {
      flex: 1;
      display: flex;
      align-items: stretch;
      padding: 14px 22px;
      gap: 0;
      min-height: 0;
    }

    .body-left {
      flex: 0 0 200px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding-right: 14px;
    }

    .isotipo-wrap {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .isotipo-img {
      width: 130px;
      height: auto;
      mix-blend-mode: multiply;
    }

    .mantra {
      font-size: 13px;
      font-style: italic;
      color: #2e2a45;
      text-align: center;
      margin: 12px 0 0;
      line-height: 1.65;
      letter-spacing: 0.01em;
      font-weight: 600;
      border: none;
      padding: 0;
    }

    .body-divider {
      width: 1px;
      background: linear-gradient(to bottom, transparent, #d8d0e8 20%, #d8d0e8 80%, transparent);
      flex-shrink: 0;
      align-self: stretch;
    }

    .body-right {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding-left: 14px;
    }

    .qr-img {
      width: 170px;
      height: 170px;
      object-fit: contain;
      display: block;
      border-radius: 8px;
      filter: drop-shadow(0 2px 8px rgba(30,27,46,0.15));
    }

    .serial {
      font-size: 11px;
      font-family: 'Courier New', monospace;
      color: #3a3660;
      letter-spacing: 0.12em;
      margin: 0;
      font-weight: 700;
    }

    /* ── Footer ── */
    .card-footer {
      background: #1a1a3a;
      padding: 10px 24px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex-shrink: 0;
      border-radius: 0 0 14px 14px;
    }

    .footer-tab {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
    }

    .footer-icon { width: 18px; height: 18px; opacity: 0.85; }

    .footer-label {
      font-size: 9.5px;
      color: rgba(255,255,255,0.85);
      letter-spacing: 0.03em;
      text-align: center;
      font-weight: 600;
    }
  `],
})
export class ActivationCardComponent {
  readonly license            = input.required<License>();
  readonly qrDataUrl          = input.required<string>();
  readonly fraseInspiracional = input<string>('Cada paso hacia\ntu bienestar\ncuenta.');
  readonly tabs               = input<CardTab[]>(DEFAULT_TABS);
}
