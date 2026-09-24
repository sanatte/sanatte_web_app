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
    label: 'Me Recojo',
    svgPath: 'M12 2C12 2 7.5 5.5 7.5 10C7.5 12.76 9.53 14.63 12 15C14.47 14.63 16.5 12.76 16.5 10C16.5 5.5 12 2 12 2Z M4.5 9C4.5 9 2 12 3 15C3.79 17.24 6.48 18.5 9 17.5C8.1 14.9 8 12 9.5 9.5C7 8.5 4.5 9 4.5 9Z M19.5 9C19.5 9 17 8.5 14.5 9.5C16 12 15.9 14.9 15 17.5C17.52 18.5 20.21 17.24 21 15C22 12 19.5 9 19.5 9Z',
  },
  {
    label: 'Me Reconozco',
    svgPath: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
  },
  {
    label: 'Me Cuido',
    svgPath: 'M12 2L13.09 8.26L19 7L14.74 11.26L17 17L12 14L7 17L9.26 11.26L5 7L10.91 8.26L12 2Z',
  },
  {
    label: 'Me Celebro',
    svgPath: 'M18 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V4C20 2.9 19.1 2 18 2ZM17 13H7V11H17V13ZM17 9H7V7H17V9Z',
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

    .header-text { flex: 1; padding-right: 8px; }

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
