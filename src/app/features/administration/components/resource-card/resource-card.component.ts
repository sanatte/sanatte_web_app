import { Component, input, output, computed } from '@angular/core';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { Resource, RESOURCE_TYPE_META } from '../../models/resource.model';
import { TEXTS } from '../../../../core/i18n/texts';

@Component({
  selector: 'app-resource-card',
  imports: [StatusBadgeComponent],
  template: `
    <div class="group bg-white rounded-lg overflow-hidden border border-transparent
                hover:border-primary/20 transition-all flex flex-col h-full"
         style="box-shadow: 0px 10px 30px rgb(var(--color-shadow) / 0.05)">

      <div class="relative aspect-video overflow-hidden">

        @if (resource().thumbnailUrl) {
          <img [src]="resource().thumbnailUrl!" [alt]="resource().title"
               class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          <div class="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
        } @else if (resource().type === 'pdf') {
          <div class="w-full h-full bg-surface-container-low flex flex-col items-center
                      justify-center gap-2 text-primary/40 group-hover:text-primary
                      transition-colors">
            <span class="material-symbols-outlined text-[48px]">picture_as_pdf</span>
            <span class="text-label-sm font-heading font-bold uppercase tracking-tighter">{{ t.types.pdf }}</span>
          </div>
        } @else {
          <div class="w-full h-full bg-gradient-to-br group-hover:scale-105
                      transition-transform duration-500 flex items-center justify-center"
               [class]="resource().thumbnailGradient">
            <span class="material-symbols-outlined text-white/60 text-[40px]">
              {{ typeMeta().icon }}
            </span>
          </div>
          <div class="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
        }

        <span class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded
                     text-[10px] font-heading font-bold uppercase tracking-widest
                     flex items-center gap-1 text-on-surface">
          <span class="material-symbols-outlined text-[13px]">{{ typeMeta().icon }}</span>
          {{ typeMeta().label }}
        </span>

        @if (metaLabel()) {
          <span class="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1
                       rounded text-[10px] font-heading font-medium">
            {{ metaLabel() }}
          </span>
        }

        <button (click)="preview.emit(resource())"
                class="absolute inset-0 flex items-center justify-center
                       bg-black/0 hover:bg-black/30 transition-colors group/prev">
          <span class="material-symbols-outlined text-white text-[32px] opacity-0
                       group-hover/prev:opacity-100 transition-opacity drop-shadow-lg">
            play_circle
          </span>
        </button>
      </div>

      <div class="p-5 flex-1 flex flex-col justify-between">
        <div class="space-y-1">
          <h3 class="font-heading font-semibold text-on-surface truncate">
            {{ resource().title }}
          </h3>
          <p class="text-on-surface-variant text-label-md line-clamp-2 min-h-[2.5rem]">
            {{ resource().description }}
          </p>
        </div>

        <div class="mt-4 flex flex-wrap items-center justify-between gap-y-2 gap-x-2">
          <div class="flex items-center gap-2 min-w-0">
            <app-status-badge [status]="resource().status" />

            @if (linkedProductCount() > 0) {
              <div class="flex items-center gap-0.5 text-primary shrink-0"
                   [title]="t.card.linkedProducts(linkedProductCount())">
                <span class="material-symbols-outlined text-[15px]">link</span>
                <span class="text-label-sm font-heading font-semibold">{{ linkedProductCount() }}</span>
              </div>
            }
          </div>

          <div class="flex items-center gap-0.5 shrink-0">
            <label class="p-1.5 rounded-full text-on-surface-variant hover:text-primary
                          hover:bg-primary-fixed transition-colors cursor-pointer"
                   [title]="t.card.uploadThumbnail">
              <span class="material-symbols-outlined text-[18px]">add_photo_alternate</span>
              <input type="file" accept="image/jpeg,image/png,image/webp" class="hidden"
                     (change)="onThumbnailFileChange($event)">
            </label>
            <button (click)="downloadQr.emit(resource())"
                    class="p-1.5 rounded-full text-on-surface-variant hover:text-primary
                           hover:bg-primary-fixed transition-colors"
                    [title]="t.card.downloadQr">
              <span class="material-symbols-outlined text-[18px]">qr_code_2</span>
            </button>
            <button (click)="edit.emit(resource())"
                    class="p-1.5 rounded-full text-on-surface-variant hover:text-primary
                           hover:bg-primary-fixed transition-colors"
                    [title]="c.actions.edit">
              <span class="material-symbols-outlined text-[18px]">edit</span>
            </button>
            <button (click)="delete.emit(resource())"
                    class="p-1.5 rounded-full text-on-surface-variant hover:text-error
                           hover:bg-error-container transition-colors"
                    [title]="c.actions.delete">
              <span class="material-symbols-outlined text-[18px]">delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ResourceCardComponent {
  protected readonly t = TEXTS.admin.resources;
  protected readonly c = TEXTS.common;

  readonly resource           = input.required<Resource>();
  readonly linkedProductCount = input(0);
  readonly uploadingThumbnail = input(false);
  readonly edit            = output<Resource>();
  readonly delete          = output<Resource>();
  readonly preview         = output<Resource>();
  readonly downloadQr      = output<Resource>();
  readonly thumbnailSelected = output<{ resource: Resource; file: File }>();

  readonly typeMeta = computed(() => RESOURCE_TYPE_META[this.resource().type]);

  readonly metaLabel = computed(() => {
    const r = this.resource();
    return r.duration ?? r.fileSize ?? (r.readTime ? this.t.readTime(r.readTime) : null);
  });

  onThumbnailFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.thumbnailSelected.emit({ resource: this.resource(), file });
    (event.target as HTMLInputElement).value = '';
  }
}
