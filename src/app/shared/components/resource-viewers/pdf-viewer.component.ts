import {
  Component, ElementRef, AfterViewInit, OnDestroy, input, signal, viewChild,
} from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';

// Worker de pdf.js (esbuild lo empaqueta desde el paquete).
pdfjsLib.GlobalWorkerOptions.workerSrc =
  new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

/**
 * Visor de PDF con pdf.js: renderiza cada página en un <canvas> dentro de la app
 * (scroll vertical), sin exponer el archivo en un iframe del navegador. La URL
 * firmada la consume internamente. Base lista para restringir descarga/impresión.
 */
@Component({
  selector: 'app-pdf-viewer',
  template: `
    <div class="w-full rounded-2xl overflow-hidden bg-surface-container-low border border-outline-variant/20">
      <div #container
           class="w-full max-h-[75vh] overflow-y-auto p-3 md:p-4 flex flex-col items-center gap-4"
           (contextmenu)="$event.preventDefault()">
        @if (state() === 'loading') {
          <div class="flex flex-col items-center justify-center gap-3 py-24 text-on-surface-variant">
            <span class="material-symbols-outlined animate-spin text-primary text-[32px]">progress_activity</span>
            <span class="text-label-md font-heading">Cargando documento…</span>
          </div>
        }
        @if (state() === 'error') {
          <div class="flex flex-col items-center justify-center gap-3 py-24 text-error">
            <span class="material-symbols-outlined text-[32px]">error</span>
            <span class="text-label-md font-heading">No se pudo cargar el documento.</span>
          </div>
        }
      </div>
    </div>
  `,
})
export class PdfViewerComponent implements AfterViewInit, OnDestroy {
  readonly url = input.required<string>();
  private readonly container = viewChild.required<ElementRef<HTMLDivElement>>('container');

  readonly state = signal<'loading' | 'ready' | 'error'>('loading');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private task?: any;

  ngAfterViewInit(): void {
    this.render();
  }

  private async render(): Promise<void> {
    try {
      const host = this.container().nativeElement;
      const width = host.clientWidth - 24; // menos el padding
      const dpr = window.devicePixelRatio || 1;

      this.task = pdfjsLib.getDocument({ url: this.url() });
      const pdf = await this.task.promise;
      this.state.set('ready');

      for (let n = 1; n <= pdf.numPages; n++) {
        const page = await pdf.getPage(n);
        const base = page.getViewport({ scale: 1 });
        const scale = width / base.width;
        const viewport = page.getViewport({ scale: scale * dpr });

        const canvas = document.createElement('canvas');
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.width = '100%';
        canvas.style.borderRadius = '8px';
        canvas.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
        host.appendChild(canvas);

        const ctx = canvas.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport }).promise;
      }
    } catch {
      this.state.set('error');
    }
  }

  ngOnDestroy(): void {
    this.task?.destroy?.();
  }
}
