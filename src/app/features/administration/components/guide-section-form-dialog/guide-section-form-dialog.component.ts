import {
  Component, input, output, inject, signal, computed, effect
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { GuideSection } from '../../models/guide-section.model';
import { environment } from '../../../../../environments/environment';
import { TEXTS } from '../../../../core/i18n/texts';

export interface GuideSectionFormEvent {
  key: string;
  title: string;
  sortOrder: number;
  isActive: boolean;
  introResourceId: string | null;
}

@Component({
  selector: 'app-guide-section-form-dialog',
  imports: [ReactiveFormsModule],
  templateUrl: './guide-section-form-dialog.component.html',
})
export class GuideSectionFormDialogComponent {
  private readonly fb   = inject(FormBuilder);
  private readonly http = inject(HttpClient);

  protected readonly t = TEXTS.admin.guideSections.formDialog;
  protected readonly c = TEXTS.common;

  readonly isOpen       = input.required<boolean>();
  readonly editingItem  = input<GuideSection | null>(null);
  readonly isSaving     = input(false);
  readonly errorMessage = input<string | null>(null);

  readonly close = output<void>();
  readonly save  = output<GuideSectionFormEvent>();

  readonly uploadProgress = signal<number | null>(null);
  readonly uploadError    = signal<string | null>(null);
  readonly linkedResourceId    = signal<string | null>(null);
  readonly linkedResourceTitle = signal<string | null>(null);
  readonly linkedResourceType  = signal<string | null>(null);

  readonly isEditMode = computed(() => this.editingItem() !== null);
  readonly title      = computed(() => this.isEditMode() ? this.t.editTitle : this.t.createTitle);

  readonly form = this.fb.nonNullable.group({
    key:       ['', [Validators.required, Validators.maxLength(80), Validators.pattern(/^[a-z0-9-]+$/)]],
    title:     ['', [Validators.required, Validators.maxLength(120)]],
    sortOrder: [0,  [Validators.required, Validators.min(0)]],
    isActive:  [true],
  });

  constructor() {
    effect(() => {
      const item = this.editingItem();
      if (!this.isOpen()) return;
      if (item) {
        this.form.patchValue({
          key:       item.key,
          title:     item.title,
          sortOrder: item.sortOrder,
          isActive:  item.isActive,
        });
        this.form.get('key')?.disable();
        this.linkedResourceId.set(item.introResourceId ?? null);
        this.linkedResourceTitle.set(item.introResourceTitle ?? null);
        this.linkedResourceType.set(item.introResourceContentType ?? null);
      } else {
        this.form.reset({ key: '', title: '', sortOrder: 0, isActive: true });
        this.form.get('key')?.enable();
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
      key:             v.key,
      title:           v.title,
      sortOrder:       v.sortOrder,
      isActive:        v.isActive,
      introResourceId: this.linkedResourceId(),
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
      const sectionTitle = this.form.getRawValue().title || file.name;
      const typeInt = file.type.startsWith('video') ? 1 : 0;

      const created = await firstValueFrom(
        this.http.post<{ id: string; title: string }>(base, {
          title:       `Intro: ${sectionTitle}`,
          description: `Video/audio introductorio de la sección "${sectionTitle}".`,
          type:        typeInt,
          status:      1,
          tags:        ['guide-section-intro'],
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
          storagePath: signed.storagePath,
          contentType: file.type,
          sizeBytes:   file.size,
        })
      );

      this.linkedResourceId.set(created.id);
      this.linkedResourceTitle.set(file.name);
      this.linkedResourceType.set(file.type);
      this.uploadProgress.set(100);

    } catch {
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
    return (this.linkedResourceType() ?? '').startsWith('video') ? 'videocam' : 'headphones';
  }

  getResourceTypeLabel(): string {
    const ct = this.linkedResourceType() ?? '';
    return ct.startsWith('video') ? TEXTS.admin.guideSections.mediaTypes.video : TEXTS.admin.guideSections.mediaTypes.audio;
  }
}
