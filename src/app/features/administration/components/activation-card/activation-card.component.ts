import { Component, input } from '@angular/core';
import { License } from '../../models/license.model';

@Component({
  selector: 'app-activation-card',
  standalone: true,
  template: `
    <div class="activation-card-root">

      <!-- Decorative botanical leaf -->
      <div class="leaf-decoration" aria-hidden="true">
        <svg width="160" height="200" viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M80 190 C80 190 10 140 10 70 C10 30 40 5 80 5 C120 5 150 30 150 70 C150 140 80 190 80 190Z"
                fill="#6b38d4" opacity="0.04"/>
          <path d="M20 160 C20 160 5 100 30 60 C45 35 70 30 80 50"
                stroke="#6b38d4" stroke-width="1.5" fill="none" opacity="0.12" stroke-dasharray="4 3"/>
          <path d="M140 160 C140 160 155 100 130 60 C115 35 90 30 80 50"
                stroke="#6b38d4" stroke-width="1.5" fill="none" opacity="0.12" stroke-dasharray="4 3"/>
          <circle cx="80" cy="50" r="4" fill="#6b38d4" opacity="0.15"/>
        </svg>
      </div>

      <!-- Card body -->
      <div class="card-body">

        <!-- Logo section -->
        <div class="logo-section">
          <div class="lotus-icon" aria-hidden="true">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 3 C18 3 13 8 13 15 C13 18.5 15.5 21 18 22 C20.5 21 23 18.5 23 15 C23 8 18 3 18 3Z"
                    fill="#6b38d4"/>
              <path d="M9 11 C9 11 5 16 6.5 21 C7.5 23.5 11 24.5 13.5 23 C12 20 12 16.5 14.5 13 C11.5 11.5 9 11 9 11Z"
                    fill="#6b38d4" opacity="0.65"/>
              <path d="M27 11 C27 11 24.5 11.5 21.5 13 C24 16.5 24 20 22.5 23 C25 24.5 28.5 23.5 29.5 21 C31 16 27 11 27 11Z"
                    fill="#6b38d4" opacity="0.65"/>
              <path d="M5 25 C5 25 11.5 22 18 22 C24.5 22 31 25 31 25"
                    stroke="#6b38d4" stroke-width="1.2" stroke-linecap="round" opacity="0.3"/>
              <path d="M16 22 C15.5 25 16 28 18 31 C20 28 20.5 25 20 22"
                    fill="#6b38d4" opacity="0.4"/>
            </svg>
          </div>
          <div class="brand-name">SANATTE</div>
          <div class="brand-tagline">Agencia de Bienestar</div>
        </div>

        <!-- Headline -->
        <div class="headline-section">
          <h1 class="headline-title">¡Bienvenido a<br>{{ license().productName }}!</h1>
          <p class="headline-sub">Activa tu producto para acceder a todos tus recursos digitales.</p>
        </div>

        <!-- CTA + QR row -->
        <div class="cta-row">
          <div class="cta-box">
            <div class="cta-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3h7v7H3V3zm1 1v5h5V4H4zm1 1h3v3H5V5zm10-2h7v7h-7V3zm1 1v5h5V4h-5zm1 1h3v3h-3V5zM3 14h7v7H3v-7zm1 1v5h5v-5H4zm1 1h3v3H5v-3zm9.5-1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm2 0a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm2 0a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm-4 2a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm2 0a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm2 0a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm-4 2a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm2 0a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm2 0a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"
                      fill="#6b38d4"/>
              </svg>
            </div>
            <p class="cta-text">Escanea el código QR<br>para comenzar.</p>
          </div>

          <div class="qr-wrapper">
            <img [src]="qrDataUrl()" alt="QR de activación" class="qr-image"/>
            <p class="qr-code-label">{{ license().code }}</p>
          </div>
        </div>

      </div>

      <!-- Bottom band -->
      <div class="bottom-band">
        <div class="benefit-item">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm-1-11v5l4 2.4-.8 1.4L10 13V8h1z" opacity="0.9"/>
          </svg>
          <span>Audios guiados</span>
        </div>
        <div class="benefit-item">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" opacity="0.9"/>
          </svg>
          <span>Ejercicios</span>
        </div>
        <div class="benefit-item">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" opacity="0.9"/>
          </svg>
          <span>Recursos</span>
        </div>
        <div class="benefit-item">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" opacity="0.9"/>
          </svg>
          <span>Bienestar diario</span>
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host {
      display: block;
      font-family: 'Manrope', 'Be Vietnam Pro', system-ui, sans-serif;
    }

    .activation-card-root {
      width: 560px;
      height: 396px;
      background: #faf7f2;
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(107, 56, 212, 0.12);
    }

    .leaf-decoration {
      position: absolute;
      left: -30px;
      top: -10px;
      pointer-events: none;
      z-index: 0;
    }

    .card-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 22px 28px 16px;
      gap: 10px;
      position: relative;
      z-index: 1;
    }

    .logo-section {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .lotus-icon {
      flex-shrink: 0;
    }

    .brand-name {
      font-size: 17px;
      font-weight: 800;
      color: #1e1b2e;
      letter-spacing: 0.15em;
    }

    .brand-tagline {
      font-size: 9px;
      color: #6b38d4;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      font-weight: 600;
      margin-left: -4px;
    }

    .headline-section {
      text-align: center;
    }

    .headline-title {
      font-size: 20px;
      font-weight: 800;
      color: #1e1b2e;
      margin: 0;
      line-height: 1.2;
    }

    .headline-sub {
      font-size: 11px;
      color: #5a556a;
      margin: 6px 0 0;
      line-height: 1.5;
    }

    .cta-row {
      display: flex;
      align-items: center;
      gap: 16px;
      flex: 1;
    }

    .cta-box {
      flex: 1;
      background: #ede8df;
      border-radius: 12px;
      padding: 16px 18px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      height: 100%;
      justify-content: center;
    }

    .cta-icon {
      opacity: 0.8;
    }

    .cta-text {
      font-size: 12px;
      color: #1e1b2e;
      font-weight: 600;
      margin: 0;
      text-align: center;
      line-height: 1.5;
    }

    .qr-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }

    .qr-image {
      width: 136px;
      height: 136px;
      border-radius: 10px;
      background: white;
      padding: 6px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.10);
      object-fit: contain;
      display: block;
    }

    .qr-code-label {
      font-size: 9px;
      color: #5a556a;
      font-weight: 700;
      letter-spacing: 0.08em;
      margin: 0;
      font-family: monospace;
    }

    .bottom-band {
      background: #1e1b2e;
      padding: 10px 28px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      border-radius: 0 0 16px 16px;
      flex-shrink: 0;
    }

    .benefit-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      color: white;
    }

    .benefit-item span {
      font-size: 9px;
      opacity: 0.75;
      letter-spacing: 0.03em;
      text-align: center;
      font-weight: 500;
    }
  `],
})
export class ActivationCardComponent {
  readonly license   = input.required<License>();
  readonly qrDataUrl = input.required<string>();
}
