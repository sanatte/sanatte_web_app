import { Component, input, output, effect, inject, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Resource, ResourceType } from '../../models/resource.model';
import { ResourceService } from '../../services/resource.service';
import { RichTextEditorComponent } from '../../../../shared/components/rich-text-editor/rich-text-editor.component';

// Tipos MIME aceptados por tipo de recurso (deben coincidir con los que valida la API).
const ACCEPT_BY_TYPE: Record<ResourceType, string> = {
  audio:   'audio/mpeg,audio/mp4,audio/aac,audio/wav',
  video:   'video/mp4,video/webm',
  pdf:     'application/pdf',
  article: '',
};

@Component({
  selector: 'app-resource-form-dialog',
  imports: [ReactiveFormsModule, RichTextEditorComponent],
  templateUrl: './resource-form-dialog.component.html',
})
export class ResourceFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly resourceService = inject(ResourceService);

  readonly isOpen   = input.required<boolean>();
  readonly resource = input<Resource | null>(null);

  /** Se emite cuando el recurso (y su archivo, si hay) quedó guardado. */
  readonly saved  = output<void>();
  readonly cancel = output<void>();

  readonly form = this.fb.nonNullable.group({
    title:       ['', Validators.required],
    slug:        [''],
    type:        ['audio' as ResourceType, Validators.required],
    description: [''],
    status:      ['draft'],
    duration:    [{ value: '', disabled: true }],
    fileSize:    [{ value: '', disabled: true }],
    readTime:    [''],
    tags:        [''],
  });

  readonly isEditMode   = computed(() => this.resource() !== null);
  readonly selectedType = signal<ResourceType>('audio');

  // Estado de subida de archivo
  readonly selectedFile   = signal<File | null>(null);
  readonly uploadProgress = signal<number | null>(null); // 0-100 durante el PUT a R2
  readonly isSaving       = signal(false);
  readonly errorMsg       = signal<string | null>(null);

  // Cuerpo del artículo (HTML del editor WYSIWYG)
  readonly articleContent = signal<string>('');

  // Portada (imagen)
  readonly selectedCover = signal<File | null>(null);
  readonly coverPreview  = signal<string | null>(null); // object URL para vista previa

  /** Tipos MIME que acepta el input según el tipo de recurso elegido. */
  readonly acceptAttr = computed(() => ACCEPT_BY_TYPE[this.selectedType()]);
  /** Los artículos no tienen archivo subible. */
  readonly needsFile  = computed(() => this.selectedType() !== 'article');
  /** El recurso en edición ya tiene un archivo cargado. */
  readonly hasExistingMedia = computed(() => !!this.resource()?.mediaContentType);

  /** Etiqueta legible del archivo ya subido, ej. "MP3 · 7.8 MB". */
  readonly existingFileLabel = computed(() => {
    const r = this.resource();
    if (!r?.mediaContentType) return '';
    const typeMap: Record<string, string> = {
      'audio/mpeg': 'MP3', 'audio/mp4': 'M4A', 'audio/aac': 'AAC', 'audio/wav': 'WAV',
      'video/mp4': 'MP4', 'video/webm': 'WebM', 'application/pdf': 'PDF',
    };
    const label = typeMap[r.mediaContentType] ?? r.mediaContentType;
    const size  = r.mediaSizeBytes ? ` · ${this.formatBytes(r.mediaSizeBytes)}` : '';
    return `${label}${size}`;
  });

  constructor() {
    effect(() => {
      const r = this.resource();
      this.selectedFile.set(null);
      this.uploadProgress.set(null);
      this.errorMsg.set(null);
      if (r) {
        this.form.patchValue({
          title:       r.title,
          slug:        r.slug ?? '',
          type:        r.type,
          description: r.description,
          status:      r.status,
          duration:    r.duration ?? '',
          fileSize:    r.fileSize ?? '',
          readTime:    r.readTime ?? '',
          tags:        r.tags.join(', '),
        });
        this.selectedType.set(r.type);
        this.articleContent.set(r.content ?? '');
      } else {
        this.form.reset({ title: '', slug: '', type: 'audio', description: '',
                          status: 'draft', duration: '', fileSize: '',
                          readTime: '', tags: '' });
        this.selectedType.set('audio');
        this.articleContent.set('');
      }
      // La portada se reinicia siempre (nuevo o editar).
      this.selectedCover.set(null);
      this.coverPreview.set(null);
    });
  }

  onTypeChange(event: Event): void {
    this.selectedType.set((event.target as HTMLSelectElement).value as ResourceType);
    this.selectedFile.set(null); // el tipo cambió → el archivo previo ya no aplica
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.errorMsg.set(null);
    if (file && this.acceptAttr() && !this.acceptAttr().split(',').includes(file.type)) {
      this.errorMsg.set('Formato no válido para este tipo de recurso.');
      this.selectedFile.set(null);
      input.value = '';
      return;
    }
    this.selectedFile.set(file);
    if (file) this.autofillMeta(file);
  }

  clearFile(): void { this.selectedFile.set(null); }

  onCoverSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      this.errorMsg.set('La portada debe ser JPEG, PNG o WebP.');
      input.value = '';
      return;
    }
    this.errorMsg.set(null);
    this.selectedCover.set(file);
    this.coverPreview.set(URL.createObjectURL(file));
  }

  formatBytes(bytes: number): string {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  /** Autocompleta peso (todos) y duración (audio/video) desde el archivo elegido. */
  private autofillMeta(file: File): void {
    this.form.patchValue({ fileSize: this.formatBytes(file.size) });

    const type = this.selectedType();
    if (type === 'audio' || type === 'video') {
      const el = document.createElement(type === 'video' ? 'video' : 'audio');
      el.preload = 'metadata';
      const url = URL.createObjectURL(file);
      el.onloadedmetadata = () => {
        const secs = el.duration;
        if (isFinite(secs) && secs > 0) {
          const m = Math.floor(secs / 60).toString().padStart(2, '0');
          const s = Math.floor(secs % 60).toString().padStart(2, '0');
          this.form.patchValue({ duration: `${m}:${s}` });
        }
        URL.revokeObjectURL(url);
      };
      el.src = url;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (this.isSaving()) return;

    const rawStatus = this.form.getRawValue().status;
    if (rawStatus === 'published' && this.needsFile() && !this.hasExistingMedia() && !this.selectedFile()) {
      this.errorMsg.set('Para publicar un recurso debe tener un archivo cargado.');
      return;
    }

    const raw = this.form.getRawValue();
    const type = raw.type as ResourceType;
    const data: Partial<Resource> = {
      title:       raw.title,
      slug:        raw.slug?.trim() || undefined,
      type,
      description: raw.description,
      status:      raw.status as Resource['status'],
      tags:        raw.tags ? raw.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      duration:    type === 'audio' || type === 'video' ? raw.duration || undefined : undefined,
      fileSize:    type === 'pdf'     ? raw.fileSize || undefined : undefined,
      readTime:    type === 'article' ? raw.readTime || undefined : undefined,
      content:     type === 'article' ? (this.articleContent() || undefined) : undefined,
      thumbnailGradient: this.resource()?.thumbnailGradient ?? 'from-violet-400 to-purple-600',
    };

    this.isSaving.set(true);
    this.errorMsg.set(null);
    try {
      const editing = this.resource();
      const saved = editing
        ? await this.resourceService.update(editing.id, data)
        : await this.resourceService.create(data as Omit<Resource, 'id' | 'createdAt'>);

      const file = this.selectedFile();
      if (file) {
        this.uploadProgress.set(0);
        try {
          await this.resourceService.uploadMedia(saved.id, file, {
            duration: data.duration,
            onProgress: (p) => this.uploadProgress.set(p),
          });
        } catch (uploadErr) {
          // Si el recurso es NUEVO y la subida falla, se deshace la creación
          // para no dejar un recurso huérfano (sin archivo) en la BD.
          if (!editing) await this.resourceService.delete(saved.id).catch(() => {});
          throw uploadErr;
        }
      }

      // Portada (opcional): best-effort — el recurso ya quedó guardado.
      const cover = this.selectedCover();
      if (cover) {
        try { await this.resourceService.uploadThumbnail(saved.id, cover); }
        catch { this.errorMsg.set('El recurso se guardó, pero no se pudo subir la portada. Inténtalo desde la tarjeta.'); }
      }

      this.saved.emit();
    } catch (e: unknown) {
      const msg = (e as { error?: { detail?: string } })?.error?.detail
        ?? (e as Error)?.message
        ?? 'No se pudo guardar el recurso.';
      this.errorMsg.set(msg); // ej. "El slug 'x' ya está en uso por otro recurso."
    } finally {
      this.isSaving.set(false);
      this.uploadProgress.set(null);
    }
  }
}
