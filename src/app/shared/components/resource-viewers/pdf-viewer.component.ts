import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Visor de PDF usando <iframe> nativo.
 * pdf.js requería XHR cross-origin a R2 (CORS), mientras que el iframe hace
 * una petición de navegación que el browser resuelve sin restricción CORS.
 */
@Component({
  selector: 'app-pdf-viewer',
  template: `
    <div class="w-full rounded-2xl overflow-hidden border border-outline-variant/20">
      <iframe [src]="safeUrl()"
              class="w-full"
              style="height: 75vh; border: none; display: block;"
              title="Vista previa del documento">
      </iframe>
    </div>
  `,
})
export class PdfViewerComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly url = input.required<string>();

  readonly safeUrl = computed(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(this.url())
  );
}
