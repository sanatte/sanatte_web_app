import { Component, input } from '@angular/core';

/**
 * Contenedor de páginas legales (privacidad, eliminación de cuenta).
 * Estructura semántica: h1 + "última actualización" + prose proyectado.
 * Estas páginas son URLs públicas requeridas por App Store y Play Store.
 */
@Component({
  selector: 'app-legal-page',
  standalone: true,
  template: `
    <article class="max-w-3xl mx-auto px-6 md:px-8 py-12 md:py-16">
      <header class="mb-8 pb-6 border-b border-outline-variant/30">
        <h1 class="font-heading font-extrabold text-on-surface text-3xl md:text-4xl leading-tight">
          {{ title() }}
        </h1>
        <p class="mt-3 text-label-md font-heading text-on-surface-variant">
          Última actualización: {{ lastUpdated() }}
        </p>
      </header>

      <!-- Contenido legal: estilos aplicados a los tags proyectados -->
      <div class="legal-prose text-on-surface-variant leading-relaxed space-y-4">
        <ng-content />
      </div>
    </article>
  `,
  styles: [`
    .legal-prose ::ng-deep h2 {
      font-family: 'Manrope', sans-serif;
      font-weight: 700;
      font-size: 1.35rem;
      color: #121c2a;
      margin-top: 2rem;
      margin-bottom: 0.75rem;
    }
    .legal-prose ::ng-deep h3 {
      font-family: 'Manrope', sans-serif;
      font-weight: 600;
      font-size: 1.1rem;
      color: #121c2a;
      margin-top: 1.5rem;
      margin-bottom: 0.5rem;
    }
    .legal-prose ::ng-deep p { margin-bottom: 0.75rem; }
    .legal-prose ::ng-deep ul {
      list-style: disc;
      padding-left: 1.5rem;
      margin-bottom: 0.75rem;
    }
    .legal-prose ::ng-deep li { margin-bottom: 0.35rem; }
    .legal-prose ::ng-deep a { color: #6b38d4; text-decoration: underline; }
    .legal-prose ::ng-deep strong { color: #121c2a; font-weight: 600; }
  `],
})
export class LegalPageComponent {
  readonly title = input.required<string>();
  readonly lastUpdated = input.required<string>();
}
