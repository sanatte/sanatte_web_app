import { Component, input } from '@angular/core';

/**
 * ArticleReader — lectura tipográfica de un artículo. Renderiza el HTML del
 * editor (Angular lo sanitiza) con portada (imagen o gradiente). Recibe campos
 * sueltos para servir tanto al admin (Resource) como al usuario (MyResource).
 */
@Component({
  selector: 'app-article-reader',
  template: `
    <article class="w-full bg-white rounded-2xl shadow-lg overflow-hidden border border-outline-variant/20">
      <!-- Portada -->
      <div class="w-full aspect-[21/9] bg-gradient-to-br relative {{ coverGradient() }}">
        @if (coverUrl(); as c) {
          <img [src]="c" alt="" class="absolute inset-0 w-full h-full object-cover"/>
        }
      </div>

      <div class="p-6 md:p-10 max-w-3xl mx-auto space-y-5">
        <div class="flex items-center gap-3 text-label-sm font-heading text-on-surface-variant">
          <span class="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold uppercase tracking-widest">
            Artículo
          </span>
          @if (readTime()) {
            <span class="flex items-center gap-1">
              <span class="material-symbols-outlined text-[16px]">schedule</span>
              {{ readTime() }} de lectura
            </span>
          }
        </div>

        <h1 class="font-heading text-headline-lg text-on-surface leading-tight">{{ title() }}</h1>

        @if (content()) {
          <div class="article-content" [innerHTML]="content()"></div>
        } @else {
          <p class="font-heading italic text-on-surface-variant">
            Este artículo aún no tiene contenido.
          </p>
        }
      </div>
    </article>
  `,
})
export class ArticleReaderComponent {
  readonly title = input.required<string>();
  readonly readTime = input<string | null>(null);
  readonly content = input<string | null>(null);
  readonly coverUrl = input<string | null>(null);
  readonly coverGradient = input<string>('from-violet-400 to-purple-600');
}
