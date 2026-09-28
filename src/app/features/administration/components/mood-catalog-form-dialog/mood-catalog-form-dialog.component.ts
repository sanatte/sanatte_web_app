import {
  Component, input, output, inject, signal, computed, effect
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MoodCatalog } from '../../models/mood-catalog.model';
import { environment } from '../../../../../environments/environment';
import { TEXTS } from '../../../../core/i18n/texts';

export interface MoodCatalogFormEvent {
  name: string;
  emojiCode: string;
  description: string | null;
  color: string | null;
  sortOrder: number;
  isActive: boolean;
  resourceId: string | null;
}

@Component({
  selector: 'app-mood-catalog-form-dialog',
  imports: [ReactiveFormsModule],
  templateUrl: './mood-catalog-form-dialog.component.html',
})
export class MoodCatalogFormDialogComponent {
  private readonly fb   = inject(FormBuilder);
  private readonly http = inject(HttpClient);

  protected readonly t = TEXTS.admin.moodCatalog.formDialog;
  protected readonly c = TEXTS.common;

  readonly isOpen       = input.required<boolean>();
  readonly editingItem  = input<MoodCatalog | null>(null);
  readonly isSaving     = input(false);
  readonly errorMessage = input<string | null>(null);

  readonly close = output<void>();
  readonly save  = output<MoodCatalogFormEvent>();

  readonly uploadProgress = signal<number | null>(null);
  readonly uploadError    = signal<string | null>(null);
  readonly linkedResourceId    = signal<string | null>(null);
  readonly linkedResourceTitle = signal<string | null>(null);
  readonly linkedResourceType  = signal<string | null>(null);

  readonly isEditMode = computed(() => this.editingItem() !== null);
  readonly title      = computed(() => this.isEditMode() ? this.t.editTitle : this.t.createTitle);

  readonly form = this.fb.nonNullable.group({
    name:        ['', [Validators.required, Validators.maxLength(80)]],
    emojiCode:   ['', [Validators.required, Validators.maxLength(20)]],
    description: [''],
    color:       [''],
    sortOrder:   [0, [Validators.required, Validators.min(0)]],
    isActive:    [true],
  });

  constructor() {
    effect(() => {
      const item = this.editingItem();
      if (!this.isOpen()) return;
      if (item) {
        this.form.patchValue({
          name:        item.name,
          emojiCode:   item.emojiCode,
          description: item.description ?? '',
          color:       item.color ?? '',
          sortOrder:   item.sortOrder,
          isActive:    item.isActive,
        });
        this.linkedResourceId.set(item.resourceId ?? null);
        this.linkedResourceTitle.set(item.resourceTitle ?? null);
        this.linkedResourceType.set(item.resourceContentType ?? null);
      } else {
        this.form.reset({ name: '', emojiCode: '', description: '', color: '', sortOrder: 0, isActive: true });
        this.linkedResourceId.set(null);
        this.linkedResourceTitle.set(null);
        this.linkedResourceType.set(null);
      }
      this.uploadProgress.set(null);
      this.uploadError.set(null);
    });
  }

  onClose(): void { this.close.emit(); }

  onSubmit(): void {
    if (this.form.invalid || this.isSaving()) return;
    const v = this.form.getRawValue();
    this.save.emit({
      name:        v.name,
      emojiCode:   v.emojiCode,
      description: v.description?.trim() || null,
      color:       v.color?.trim() || null,
      sortOrder:   v.sortOrder,
      isActive:    v.isActive,
      resourceId:  this.linkedResourceId(),
    });
  }

  unlinkResource(): void {
    this.linkedResourceId.set(null);
    this.linkedResourceTitle.set(null);
    this.linkedResourceType.set(null);
  }

  async onMediaSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const allowed = ['video/mp4', 'video/webm', 'audio/mpeg', 'audio/mp4', 'audio/aac', 'audio/wav'];
    if (!allowed.includes(file.type)) {
      this.uploadError.set(this.t.invalidFormat);
      input.value = '';
      return;
    }

    this.uploadError.set(null);
    this.uploadProgress.set(0);

    try {
      const base = `${environment.apiUrl}/admin/resources`;

      const resourceName = this.form.getRawValue().name || file.name;
      const typeInt = file.type.startsWith('video') ? 1 : 0;
      const created = await firstValueFrom(
        this.http.post<{ id: string; title: string }>(base, {
          title: `Media lúdico: ${resourceName}`,
          description: `Herramienta lúdica explicativa de la emoción "${resourceName}".`,
          type: typeInt,
          status: 1,
          tags: ['mood-resource'],
        })
      );

      const signed = await firstValueFrom(
        this.http.post<{ uploadUrl: string; storagePath: string }>(
          `${base}/${created.id}/media/upload-url`,
          { contentType: file.type }
        )
      );

      await this.uploadToR2(signed.uploadUrl, file, (pct) => this.uploadProgress.set(pct));

      await firstValueFrom(
        this.http.put(`${base}/${created.id}/media`, {
          storagePath:  signed.storagePath,
          contentType:  file.type,
          sizeBytes:    file.size,
        })
      );

      this.linkedResourceId.set(created.id);
      this.linkedResourceTitle.set(file.name);
      this.linkedResourceType.set(file.type);
      this.uploadProgress.set(100);

    } catch (e) {
      this.uploadError.set(this.t.uploadError);
      this.uploadProgress.set(null);
    } finally {
      input.value = '';
    }
  }

  private uploadToR2(url: string, file: File, onProgress: (pct: number) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', url);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
      };
      xhr.onload  = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`HTTP ${xhr.status}`)));
      xhr.onerror = () => reject(new Error('Network error'));
      xhr.send(file);
    });
  }

  getResourceIcon(): string {
    const ct = this.linkedResourceType() ?? '';
    return ct.startsWith('video') ? 'videocam' : 'headphones';
  }

  getResourceTypeLabel(): string {
    const ct = this.linkedResourceType() ?? '';
    return ct.startsWith('video') ? TEXTS.admin.moodCatalog.mediaTypes.video : TEXTS.admin.moodCatalog.mediaTypes.audio;
  }
}
