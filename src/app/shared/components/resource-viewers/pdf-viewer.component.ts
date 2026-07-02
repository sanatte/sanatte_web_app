import { Component, input } from '@angular/core';
import { Resource } from '../../../features/administration/models/resource.model';

/**
 * PdfViewer — visor de PDF con toolbar (zoom/fullscreen) y página mockup.
 */
@Component({
  selector: 'app-pdf-viewer',
  template: `
    <div class="w-full aspect-video bg-surface-container-low rounded-xl overflow-hidden
                shadow-2xl flex flex-col">
      <!-- Toolbar -->
      <div class="flex items-center gap-3 px-4 py-3 bg-white border-b border-outline-variant/30
                  text-label-sm font-heading text-on-surface-variant">
        <span class="material-symbols-outlined text-[18px] text-primary">picture_as_pdf</span>
        <span class="flex-1 truncate text-on-surface font-semibold">{{ resource().title }}.pdf</span>
        <div class="flex items-center gap-2">
          <button class="p-1 rounded hover:bg-surface-container transition-colors">
            <span class="material-symbols-outlined text-[18px]">zoom_out</span>
          </button>
          <span>100%</span>
          <button class="p-1 rounded hover:bg-surface-container transition-colors">
            <span class="material-symbols-outlined text-[18px]">zoom_in</span>
          </button>
          <button class="p-1 rounded hover:bg-surface-container transition-colors ml-1">
            <span class="material-symbols-outlined text-[18px]">fullscreen</span>
          </button>
        </div>
      </div>
      <!-- Página mockup -->
      <div class="flex-1 flex items-center justify-center p-6 overflow-auto">
        <div class="bg-white rounded shadow-md w-full max-w-[380px] p-8 space-y-4">
          <div class="flex justify-between items-center mb-6">
            <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span class="material-symbols-outlined text-primary text-[16px]">spa</span>
            </div>
            <div class="text-right">
              <p class="text-[10px] font-heading text-on-surface-variant uppercase tracking-widest">Página 04</p>
              <p class="text-label-sm font-heading font-bold text-primary">Sanatte</p>
            </div>
          </div>
          <h3 class="font-heading font-bold text-on-surface text-lg">{{ resource().title }}</h3>
          <div class="space-y-2">
            <div class="h-2 bg-surface-container rounded-full w-full"></div>
            <div class="h-2 bg-surface-container rounded-full w-5/6"></div>
            <div class="h-2 bg-surface-container rounded-full w-4/5"></div>
          </div>
          <div class="border-2 border-dashed border-primary/30 rounded-lg p-4 bg-primary/5">
            <p class="text-label-sm font-heading text-primary/70 italic">
              "¿Cuáles son tres cosas por las que estás agradecido hoy?"
            </p>
            <div class="mt-3 space-y-1.5">
              <div class="h-1.5 bg-primary/20 rounded-full w-full"></div>
              <div class="h-1.5 bg-primary/20 rounded-full w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class PdfViewerComponent {
  readonly resource = input.required<Resource>();
}
