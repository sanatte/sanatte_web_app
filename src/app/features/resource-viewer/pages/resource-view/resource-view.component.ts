import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { MediaPlayerComponent } from '../../../../shared/components/resource-viewers/media-player.component';
import { ArticleReaderComponent } from '../../../../shared/components/resource-viewers/article-reader.component';
import { RESOURCE_TYPE_META, ResourceType } from '../../../administration/models/resource.model';
import { TEXTS } from '../../../../core/i18n/texts';

type ViewState = 'loading' | 'ok' | 'no_access' | 'not_found' | 'error';

interface MyResource {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: number;
  duration?: string;
  readTime?: string | null;
  content?: string | null;
  thumbnailUrl?: string | null;
  thumbnailGradient: string;
}

const TYPE_BY_CODE: Record<number, ResourceType> = {
  0: 'audio',
  1: 'video',
  2: 'pdf',
  3: 'article',
};

@Component({
  selector: 'app-resource-view',
  imports: [RouterLink, MediaPlayerComponent, ArticleReaderComponent],
  template: `
    <div class="max-w-2xl mx-auto py-10 px-4">
      @switch (state()) {
        @case ('loading') {
          <div class="flex flex-col items-center justify-center py-24 text-center">
            <span class="material-symbols-outlined animate-spin text-primary text-[32px] mb-3">progress_activity</span>
            <p class="font-heading text-on-surface-variant">{{ t.opening }}</p>
          </div>
        }
        @case ('ok') {
          @if (mediaKind(); as kind) {
            <div class="glass-card rounded-lg overflow-hidden">
              <div class="h-40 bg-gradient-to-br {{ resource()!.thumbnailGradient }} flex items-center justify-center">
                <span class="material-symbols-outlined text-white text-[56px]">{{ meta().icon }}</span>
              </div>
              <div class="p-6 md:p-8">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed
                             text-on-primary-fixed-variant text-label-sm font-heading font-semibold mb-3">
                  {{ meta().label }}@if (resource()!.duration) { · {{ resource()!.duration }} }
                </span>
                <h1 class="font-heading text-headline-md text-on-surface mb-2">{{ resource()!.title }}</h1>
                <p class="text-body-md text-on-surface-variant">{{ resource()!.description }}</p>
                <div class="mt-6">
                  <app-media-player [slug]="resource()!.slug" [kind]="kind"
                                    [coverUrl]="resource()!.thumbnailUrl ?? null"
                                    [coverGradient]="resource()!.thumbnailGradient" />
                </div>
              </div>
            </div>
          } @else {
            <app-article-reader [title]="resource()!.title"
                                [readTime]="resource()!.readTime ?? null"
                                [content]="resource()!.content ?? null"
                                [coverUrl]="resource()!.thumbnailUrl ?? null"
                                [coverGradient]="resource()!.thumbnailGradient" />
          }
        }
        @case ('no_access') {
          <div class="glass-card rounded-lg p-8 text-center">
            <span class="material-symbols-outlined text-primary text-[48px] mb-3">lock</span>
            <h1 class="font-heading text-headline-md text-on-surface mb-2">{{ t.noAccess.title }}</h1>
            <p class="text-body-md text-on-surface-variant mb-6">
              {{ t.noAccess.description }}
            </p>
            <a routerLink="/app/activate"
               class="inline-flex items-center gap-2 gradient-primary text-white px-6 py-3 rounded-full
                      text-label-md font-heading font-bold hover:opacity-90 active:scale-95 transition-all"
               style="box-shadow: 0 4px 14px 0 rgb(var(--color-primary) / 0.39)">
              <span class="material-symbols-outlined text-[18px]">bolt</span>
              {{ t.noAccess.cta }}
            </a>
          </div>
        }
        @case ('not_found') {
          <div class="glass-card rounded-lg p-8 text-center">
            <span class="material-symbols-outlined text-on-surface-variant text-[48px] mb-3">search_off</span>
            <h1 class="font-heading text-headline-md text-on-surface mb-2">{{ t.notFound.title }}</h1>
            <p class="text-body-md text-on-surface-variant">{{ t.notFound.description }}</p>
          </div>
        }
        @default {
          <div class="glass-card rounded-lg p-8 text-center">
            <span class="material-symbols-outlined text-error text-[48px] mb-3">error</span>
            <h1 class="font-heading text-headline-md text-on-surface mb-2">{{ t.error.title }}</h1>
            <p class="text-body-md text-on-surface-variant">{{ t.error.description }}</p>
          </div>
        }
      }
    </div>
  `,
})
export class ResourceViewComponent {
  protected readonly t = TEXTS.app.resourceViewer;

  private readonly route = inject(ActivatedRoute);
  private readonly http  = inject(HttpClient);

  readonly state    = signal<ViewState>('loading');
  readonly resource = signal<MyResource | null>(null);
  readonly meta     = signal(RESOURCE_TYPE_META.audio);

  readonly mediaKind = computed<'audio' | 'video' | 'pdf' | null>(() => {
    switch (this.resource()?.type) {
      case 0:  return 'audio';
      case 1:  return 'video';
      case 2:  return 'pdf';
      default: return null;
    }
  });

  constructor() {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.load(slug);
  }

  private async load(slug: string): Promise<void> {
    if (!slug) { this.state.set('not_found'); return; }
    try {
      const r = await firstValueFrom(
        this.http.get<MyResource>(`${environment.apiUrl}/me/resources/${slug}`)
      );
      this.resource.set(r);
      this.meta.set(RESOURCE_TYPE_META[TYPE_BY_CODE[r.type] ?? 'audio']);
      this.state.set('ok');
    } catch (e) {
      const status = e instanceof HttpErrorResponse ? e.status : 0;
      this.state.set(status === 403 ? 'no_access' : status === 404 ? 'not_found' : 'error');
    }
  }
}
