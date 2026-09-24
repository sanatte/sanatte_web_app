import { Component, input } from '@angular/core';
import { License } from '../../models/license.model';

@Component({
  selector: 'app-activation-card',
  standalone: true,
  template: `
    <div class="activation-card-root">

      <!-- Decorative botanical shape (left) -->
      <div class="leaf-decoration" aria-hidden="true">
        <svg width="140" height="180" viewBox="0 0 140 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M70 170 C70 170 5 125 5 60 C5 25 35 3 70 3 C105 3 135 25 135 60 C135 125 70 170 70 170Z"
                fill="#6b38d4" opacity="0.04"/>
          <path d="M15 140 C15 140 2 85 25 48 C40 25 62 20 70 42"
                stroke="#6b38d4" stroke-width="1.2" fill="none" opacity="0.10" stroke-dasharray="4 3"/>
        </svg>
      </div>

      <!-- Logo Sanatte — esquina superior derecha -->
      <img src="/images/sanatte_wellness.png"
           alt="Sanatte Wellness Ecosystem"
           class="brand-logo"
           crossorigin="anonymous" />

      <!-- Card body -->
      <div class="card-body">

        <!-- Headline -->
        <div class="headline-section">
          <h1 class="headline-title">¡Bienvenido a<br>{{ license().productName }}!</h1>
          <p class="headline-sub">Activa tu producto para acceder a todos tus recursos digitales.</p>
        </div>

        <!-- CTA + QR row -->
        <div class="cta-row">
          <div class="cta-box">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M3 3h7v7H3V3zm1 1v5h5V4H4zm1 1h3v3H5V5zm10-2h7v7h-7V3zm1 1v5h5V4h-5zm1 1h3v3h-3V5zM3 14h7v7H3v-7zm1 1v5h5v-5H4zm1 1h3v3H5v-3zm9.5-1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm2 0a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm2 0a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm-4 2a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm2 0a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm2 0a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm-4 2a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm2 0a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm2 0a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"
                    fill="#6b38d4" opacity="0.7"/>
            </svg>
            <p class="cta-text">Escanea el código QR<br>para comenzar.</p>
          </div>

          <div class="qr-wrapper">
            <img [src]="qrDataUrl()" alt="QR de activación" class="qr-image" crossorigin="anonymous"/>
            <p class="qr-code-label">{{ license().code }}</p>
          </div>
        </div>

      </div>

      <!-- Bottom band -->
      <div class="bottom-band">
        <div class="benefit-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm-1-11v5l4 2.4-.8 1.4L10 13V8h1z" opacity="0.9"/>
          </svg>
          <span>Audios guiados</span>
        </div>
        <div class="benefit-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z" opacity="0.9"/>
          </svg>
          <span>Ejercicios</span>
        </div>
        <div class="benefit-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" opacity="0.9"/>
          </svg>
          <span>Recursos</span>
        </div>
        <div class="benefit-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
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
      height: 469px;
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
      left: -25px;
      top: -10px;
      pointer-events: none;
      z-index: 0;
    }

    .brand-logo {
      position: absolute;
      top: 14px;
      right: 16px;
      width: 96px;
      height: auto;
      z-index: 2;
      mix-blend-mode: multiply;
    }

    .card-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 24px 28px 18px;
      gap: 14px;
      position: relative;
      z-index: 1;
    }

    .headline-section {
      padding-right: 100px;
    }

    .headline-title {
      font-size: 22px;
      font-weight: 800;
      color: #1e1b2e;
      margin: 0;
      line-height: 1.2;
    }

    .headline-sub {
      font-size: 11.5px;
      color: #5a556a;
      margin: 7px 0 0;
      line-height: 1.5;
    }

    .cta-row {
      display: flex;
      align-items: stretch;
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
      gap: 10px;
      justify-content: center;
    }

    .cta-text {
      font-size: 12.5px;
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
      justify-content: center;
    }

    .qr-image {
      width: 158px;
      height: 158px;
      border-radius: 10px;
      background: white;
      padding: 6px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.10);
      object-fit: contain;
      display: block;
    }

    .qr-code-label {
      font-size: 9.5px;
      color: #5a556a;
      font-weight: 700;
      letter-spacing: 0.08em;
      margin: 0;
      font-family: monospace;
    }

    .bottom-band {
      background: #1e1b2e;
      padding: 12px 28px;
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
