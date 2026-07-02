import { Component, input, output, computed } from '@angular/core';
import { Resource } from '../../models/resource.model';
import { VideoPlayerComponent } from '../../../../shared/components/resource-viewers/video-player.component';
import { AudioPlayerComponent } from '../../../../shared/components/resource-viewers/audio-player.component';
import { PdfViewerComponent } from '../../../../shared/components/resource-viewers/pdf-viewer.component';
import { ArticleReaderComponent } from '../../../../shared/components/resource-viewers/article-reader.component';

@Component({
  selector: 'app-resource-preview-modal',
  imports: [VideoPlayerComponent, AudioPlayerComponent, PdfViewerComponent, ArticleReaderComponent],
  templateUrl: './resource-preview-modal.component.html',
})
export class ResourcePreviewModalComponent {
  readonly isOpen             = input.required<boolean>();
  readonly linkedProductCount = input(0);
  readonly resource           = input<Resource | null>(null);

  readonly close = output<void>();
  readonly edit  = output<Resource>();

  readonly metaLabel = computed(() => {
    const r = this.resource();
    if (!r) return '';
    return r.duration ?? r.fileSize ?? (r.readTime ? `${r.readTime} lectura` : '');
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
    if (!r) return 'Duración';
    if (r.duration) return 'Duración';
    if (r.fileSize) return 'Tamaño';
    return 'Lectura';
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
