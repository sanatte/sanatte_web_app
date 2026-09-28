import { Component, computed, inject, input, viewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TEXTS } from '../../../core/i18n/texts';

@Component({
  selector: 'app-pdf-viewer',
  template: `
    <div class="relative w-full rounded-2xl overflow-hidden border border-outline-variant/20 group">
      <iframe #frame
              [src]="safeUrl()"
              class="w-full"
              style="height: 75vh; border: none; display: block;"
              [title]="t.frameTitle">
      </iframe>
      <button (click)="openFullscreen()"
              [title]="t.fullscreen"
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

  protected readonly t = TEXTS.shared.resourceViewers.pdf;
  private readonly frame = viewChild.required<ElementRef<HTMLIFrameElement>>('frame');

  readonly url = input.required<string>();

  readonly safeUrl = computed(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(this.url())
  );

  openFullscreen(): void {
    this.frame().nativeElement.requestFullscreen?.();
  }
}
