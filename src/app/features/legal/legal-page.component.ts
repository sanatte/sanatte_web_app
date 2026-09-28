import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TEXTS } from '../../core/i18n/texts';
import type { LegalDocument } from '../../core/i18n/es/public/legal.texts';

@Component({
  selector: 'app-legal-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <article class="max-w-3xl mx-auto px-6 md:px-8 py-12 md:py-16">
      <header class="mb-8 pb-6 border-b border-outline-variant/30">
        <h1 class="font-heading font-extrabold text-on-surface text-3xl md:text-4xl leading-tight">
          {{ document().title }}
        </h1>
        <p class="mt-3 text-label-md font-heading text-on-surface-variant">
          {{ t.lastUpdated(document().lastUpdated) }}
        </p>
      </header>

      <div class="legal-prose text-on-surface-variant leading-relaxed space-y-4">
        @for (block of document().blocks; track $index) {
          @switch (block.kind) {
            @case ('h2') {
              <h2>{{ block.text }}</h2>
            }
            @case ('p') {
              <p>
                @for (seg of block.content; track $index) {
                  @switch (seg.kind) {
                    @case ('strong') { <strong>{{ seg.text }}</strong> }
                    @case ('mail') { <a [href]="seg.href">{{ seg.text }}</a> }
                    @case ('route') { <a [routerLink]="seg.route">{{ seg.text }}</a> }
                    @default { <ng-container>{{ seg.text }}</ng-container> }
                  }
                }
              </p>
            }
            @case ('ul') {
              <ul>
                @for (item of block.items; track $index) {
                  <li>
                    @for (seg of item; track $index) {
                      @switch (seg.kind) {
                        @case ('strong') { <strong>{{ seg.text }}</strong> }
                        @case ('mail') { <a [href]="seg.href">{{ seg.text }}</a> }
                        @case ('route') { <a [routerLink]="seg.route">{{ seg.text }}</a> }
                        @default { <ng-container>{{ seg.text }}</ng-container> }
                      }
                    }
                  </li>
                }
              </ul>
            }
          }
        }
      </div>
    </article>
  `,
  styles: [`
    .legal-prose ::ng-deep h2 {
      font-family: var(--font-heading), sans-serif;
      font-weight: 700;
      font-size: 1.35rem;
      color: rgb(var(--color-on-surface));
      margin-top: 2rem;
      margin-bottom: 0.75rem;
    }
    .legal-prose ::ng-deep h3 {
      font-family: var(--font-heading), sans-serif;
      font-weight: 600;
      font-size: 1.1rem;
      color: rgb(var(--color-on-surface));
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
    .legal-prose ::ng-deep a { color: rgb(var(--color-primary)); text-decoration: underline; }
    .legal-prose ::ng-deep strong { color: rgb(var(--color-on-surface)); font-weight: 600; }
  `],
})
export class LegalPageComponent {
  protected readonly t = TEXTS.public.legal.page;
  readonly document = input.required<LegalDocument>();
}
