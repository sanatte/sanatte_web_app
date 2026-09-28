import { Component, input, output, computed } from '@angular/core';
import { Resource } from '../../models/resource.model';
import { MediaPlayerComponent } from '../../../../shared/components/resource-viewers/media-player.component';
import { ArticleReaderComponent } from '../../../../shared/components/resource-viewers/article-reader.component';
import { TEXTS } from '../../../../core/i18n/texts';

@Component({
  selector: 'app-resource-preview-modal',
  imports: [MediaPlayerComponent, ArticleReaderComponent],
  templateUrl: './resource-preview-modal.component.html',
})
export class ResourcePreviewModalComponent {
  protected readonly t = TEXTS.admin.resources;

  readonly isOpen             = input.required<boolean>();
  readonly linkedProductCount = input(0);
  readonly resource           = input<Resource | null>(null);

  readonly close = output<void>();
  readonly edit  = output<Resource>();

  readonly metaLabel = computed(() => {
    const r = this.resource();
    if (!r) return '';
    return r.duration ?? r.fileSize ?? (r.readTime ? this.t.readTime(r.readTime) : '');
  });

  readonly metaIcon = computed(() => {
    const r = this.resource();
    if (!r) return 'schedule';
    if (r.duration) return 'schedule';
    if (r.fileSize) return 'file_download';
    return 'menu_book';
  });

  readonly metaKey = computed(() => {
    const r = this.resource();
    const keys = this.t.preview.metaKeys;
    if (!r) return keys.duration;
    if (r.duration) return keys.duration;
    if (r.fileSize) return keys.size;
    return keys.reading;
  });

  readonly statusBg = computed(() =>
    this.resource()?.status === 'published'
      ? 'bg-primary/20 border-primary/30 text-primary-fixed'
      : 'bg-surface-variant border-outline-variant text-on-surface-variant'
  );

  onEdit(): void {
    const r = this.resource();
    if (r) this.edit.emit(r);
  }
}
