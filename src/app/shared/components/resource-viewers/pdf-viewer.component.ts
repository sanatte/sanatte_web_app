import { Component, computed, inject, input, viewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Visor de PDF usando <iframe> nativo.
 * pdf.js requería XHR cross-origin a R2 (CORS), mientras que el iframe hace
 * una petición de navegación que el browser resuelve sin restricción CORS.
 */
@Component({
  selector: 'app-pdf-viewer',
  template: `
    <div class="relative w-full rounded-2xl overflow-hidden border border-outline-variant/20 group">
      <iframe #frame
              [src]="safeUrl()"
              class="w-full"
              style="height: 75vh; border: none; display: block;"
              title="Vista previa del documento">
      </iframe>
      <button (click)="openFullscreen()"
              title="Pantalla completa"
              class="absolute top-3 right-3 p-2 rounded-lg bg-black/50 text-white
                     opacity-0 group-hover:opacity-100 transition-opacity
                     hover:bg-black/70">
        <span class="material-symbols-outlined text-[18px]">fullscreen</span>
      </button>
    </div>
  `,
})
export class PdfViewerComponent {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly frame = viewChild.required<ElementRef<HTMLIFrameElement>>('frame');

  readonly url = input.required<string>();

  readonly safeUrl = computed(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(this.url())
  );

  openFullscreen(): void {
    this.frame().nativeElement.requestFullscreen?.();
  }
}
