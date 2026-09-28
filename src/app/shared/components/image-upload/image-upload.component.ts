import {
  Component, input, output, signal, computed, ViewChild, ElementRef
} from '@angular/core';
import { TEXTS } from '../../../core/i18n/texts';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

@Component({
  selector: 'app-image-upload',
  template: `
    <div class="relative group">
      <div class="w-full rounded-lg overflow-hidden border-2 transition-all cursor-pointer"
           [class]="dragOver()
             ? 'border-primary bg-primary-fixed/30 scale-[1.01]'
             : 'border-dashed border-outline-variant hover:border-primary/50 hover:bg-surface-variant/30'"
           [style.aspect-ratio]="aspectRatio()"
           (click)="fileInput.click()"
           (dragover)="onDragOver($event)"
           (dragleave)="dragOver.set(false)"
           (drop)="onDrop($event)">

        @if (previewSrc()) {
          <img [src]="previewSrc()" [alt]="altText()"
               class="w-full h-full object-cover">
          <div class="absolute inset-0 bg-black/40 flex flex-col items-center justify-center
                      gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span class="material-symbols-outlined text-white text-[32px]">upload</span>
            <span class="text-white text-label-sm font-heading font-semibold">
              {{ t.change }}
            </span>
          </div>
        } @else if (gradient()) {
          <div class="w-full h-full bg-gradient-to-br flex flex-col items-center
                      justify-center gap-2" [class]="gradient()!">
            <span class="material-symbols-outlined text-white/60 text-[40px]">{{ icon() }}</span>
            <span class="text-white/60 text-label-sm font-heading">{{ t.upload }}</span>
          </div>
        } @else {
          <div class="w-full h-full flex flex-col items-center justify-center gap-3
                      bg-surface-container-low p-4">
            <div class="w-12 h-12 rounded-full bg-primary-fixed flex items-center
                        justify-center">
              <span class="material-symbols-outlined text-primary text-2xl">add_photo_alternate</span>
            </div>
            <div class="text-center">
              <p class="text-label-md font-heading font-bold text-on-surface">
                {{ t.dropOr }} <span class="text-primary underline">{{ t.select }}</span>
              </p>
              <p class="text-label-sm font-heading text-outline mt-0.5">
                {{ t.formats(maxMb()) }}
              </p>
            </div>
          </div>
        }

        @if (uploading()) {
          <div class="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div class="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        }
      </div>

      @if (errorMsg()) {
        <p class="mt-1.5 text-label-sm text-error flex items-center gap-1">
          <span class="material-symbols-outlined text-[14px]">error</span>
          {{ errorMsg() }}
        </p>
      }

      <input #fileInput type="file" class="hidden"
             [accept]="accept()"
             (change)="onFileChange($event)">
    </div>
  `,
})
export class ImageUploadComponent {
  protected readonly t = TEXTS.common.imageUpload;

  @ViewChild('fileInput') private fileInputRef!: ElementRef<HTMLInputElement>;

  readonly currentUrl  = input<string | null>(null);
  readonly gradient    = input<string | null>(null);
  readonly altText     = input<string>(TEXTS.common.imageUpload.alt);
  readonly icon        = input('image');
  readonly aspectRatio = input('1 / 1');
  readonly maxMb       = input(10);
  readonly uploading   = input(false);
  readonly accept      = input('image/jpeg,image/png,image/webp');

  readonly fileSelected = output<File>();
  readonly uploadError  = output<string>();

  readonly dragOver  = signal(false);
  readonly errorMsg  = signal('');
  readonly localPreview = signal<string | null>(null);

  readonly previewSrc = computed(() => this.localPreview() ?? this.currentUrl());

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.processFile(file);
    (event.target as HTMLInputElement).value = '';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragOver.set(true);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOver.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) this.processFile(file);
  }

  private processFile(file: File): void {
    this.errorMsg.set('');

    if (!ALLOWED_TYPES.includes(file.type)) {
      const msg = this.t.invalidType;
      this.errorMsg.set(msg);
      this.uploadError.emit(msg);
      return;
    }

    if (file.size > this.maxMb() * 1024 * 1024) {
      const msg = this.t.tooLarge(this.maxMb());
      this.errorMsg.set(msg);
      this.uploadError.emit(msg);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => this.localPreview.set(e.target?.result as string);
    reader.readAsDataURL(file);

    this.fileSelected.emit(file);
  }
}
