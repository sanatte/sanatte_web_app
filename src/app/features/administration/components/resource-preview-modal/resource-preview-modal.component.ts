import { Component, input, output, computed, signal } from '@angular/core';
import { Resource } from '../../models/resource.model';

@Component({
  selector: 'app-resource-preview-modal',
  templateUrl: './resource-preview-modal.component.html',
  styles: [`
    /* Waveform animation */
    @keyframes wave {
      0%, 100% { transform: scaleY(1); }
      50%       { transform: scaleY(0.3); }
    }
    .waveform-bar { animation: wave 1.2s ease-in-out infinite; }
    .waveform-bar:nth-child(1)  { animation-delay: 0.0s; }
    .waveform-bar:nth-child(2)  { animation-delay: 0.1s; }
    .waveform-bar:nth-child(3)  { animation-delay: 0.2s; }
    .waveform-bar:nth-child(4)  { animation-delay: 0.3s; }
    .waveform-bar:nth-child(5)  { animation-delay: 0.4s; }
    .waveform-bar:nth-child(6)  { animation-delay: 0.3s; }
    .waveform-bar:nth-child(7)  { animation-delay: 0.2s; }
    .waveform-bar:nth-child(8)  { animation-delay: 0.1s; }
    .waveform-bar:nth-child(9)  { animation-delay: 0.0s; }
    .waveform-bar:nth-child(10) { animation-delay: 0.15s; }
    .waveform-bar:nth-child(11) { animation-delay: 0.25s; }
    .waveform-bar:nth-child(12) { animation-delay: 0.35s; }
    .waveform-bar:nth-child(13) { animation-delay: 0.25s; }
    .waveform-bar:nth-child(14) { animation-delay: 0.15s; }
    .waveform-bar:nth-child(15) { animation-delay: 0.05s; }
    .video-overlay {
      background: linear-gradient(0deg, rgba(18,28,42,0.9) 0%, rgba(18,28,42,0.2) 60%, transparent 100%);
    }
  `],
})
export class ResourcePreviewModalComponent {
  readonly isOpen             = input.required<boolean>();
  readonly linkedProductCount = input(0);
  readonly resource           = input<Resource | null>(null);

  readonly close = output<void>();
  readonly edit  = output<Resource>();

  readonly isPlaying = signal(false);

  togglePlay(): void { this.isPlaying.update((v) => !v); }

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
