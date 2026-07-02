import { Component, input } from '@angular/core';
import { Resource } from '../../../features/administration/models/resource.model';

/**
 * ArticleReader — lectura tipográfica de un artículo a página completa.
 */
@Component({
  selector: 'app-article-reader',
  template: `
    <article class="w-full bg-white rounded-xl shadow-2xl overflow-hidden">
      <!-- Hero -->
      <div class="w-full aspect-[21/9] bg-gradient-to-br" [class]="resource().thumbnailGradient"></div>

      <div class="p-6 md:p-10 max-w-3xl mx-auto space-y-5">
        <div class="flex items-center gap-3 text-label-sm font-heading text-on-surface-variant">
          <span class="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold uppercase tracking-widest">
            Artículo
          </span>
          @if (resource().readTime) {
            <span class="flex items-center gap-1">
              <span class="material-symbols-outlined text-[16px]">schedule</span>
              {{ resource().readTime }} de lectura
            </span>
          }
        </div>

        <h1 class="font-heading text-headline-lg text-on-surface leading-tight">
          {{ resource().title }}
        </h1>

        <p class="font-sans text-body-lg text-on-surface-variant leading-relaxed">
          {{ resource().description }}
        </p>

        <blockquote class="border-l-4 border-primary pl-5 py-1 italic font-sans text-body-lg
                            text-on-surface-variant">
          "El bienestar no es un destino, es una práctica diaria."
        </blockquote>

        <p class="font-sans text-body-md text-on-surface-variant leading-relaxed">
          Este contenido forma parte de tu biblioteca Sanatte. Continúa explorando los recursos
          vinculados a tu producto para profundizar en tu práctica de bienestar.
        </p>

        @if (resource().tags.length) {
          <div class="flex flex-wrap gap-2 pt-2">
            @for (tag of resource().tags; track tag) {
              <span class="px-3 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed
                           text-label-sm font-heading">#{{ tag }}</span>
            }
          </div>
        }
      </div>
    </article>
  `,
})
export class ArticleReaderComponent {
  readonly resource = input.required<Resource>();
}
