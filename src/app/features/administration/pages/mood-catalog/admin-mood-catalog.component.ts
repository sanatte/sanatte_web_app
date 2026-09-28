import { Component, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MoodCatalogService } from '../../services/mood-catalog.service';
import { GuideSectionService } from '../../services/guide-section.service';
import { MoodCatalog } from '../../models/mood-catalog.model';
import { GuideSection } from '../../models/guide-section.model';
import { TEXTS } from '../../../../core/i18n/texts';
import { environment } from '../../../../../environments/environment';
import { AdminPageHeaderComponent } from '../../../../shared/components/admin-page-header/admin-page-header.component';
import { MoodCatalogFormDialogComponent, MoodCatalogFormEvent } from '../../components/mood-catalog-form-dialog/mood-catalog-form-dialog.component';

@Component({
  selector: 'app-admin-mood-catalog',
  imports: [AdminPageHeaderComponent, MoodCatalogFormDialogComponent],
  templateUrl: './admin-mood-catalog.component.html',
})
export class AdminMoodCatalogComponent {
  private readonly svc            = inject(MoodCatalogService);
  private readonly guideSectionSvc = inject(GuideSectionService);
  private readonly http           = inject(HttpClient);

  protected readonly t = TEXTS.admin.moodCatalog;

  readonly catalogs = this.svc.catalogs;
  readonly loading  = this.svc.loading;
  readonly error    = this.svc.error;

  readonly isModalOpen = signal(false);
  readonly editing     = signal<MoodCatalog | null>(null);
  readonly saving      = signal(false);
  readonly saveError   = signal<string | null>(null);

  // ── Intro de la guía de emociones ──────────────────────────────────────────
  readonly emotionsSection = computed<GuideSection | undefined>(() =>
    this.guideSectionSvc.sections().find(s => s.key === 'emotions')
  );
  readonly introSaving      = signal(false);
  readonly introError       = signal<string | null>(null);
  readonly introUploadProgress = signal<number | null>(null);
  readonly introLinkedId    = signal<string | null>(null);
  readonly introLinkedTitle = signal<string | null>(null);
  readonly introLinkedType  = signal<string | null>(null);

  constructor() {
    // Sincronizar estado del intro con la sección emotions cargada
    const init = () => {
      const s = this.emotionsSection();
      if (s) {
        this.introLinkedId.set(s.introResourceId ?? null);
        this.introLinkedTitle.set(s.introResourceTitle ?? null);
        this.introLinkedType.set(s.introResourceContentType ?? null);
      }
    };
    // Ejecutar cuando el servicio cargue las secciones
    init();
  }

  getIntroIcon(): string {
    return (this.introLinkedType() ?? '').startsWith('video') ? 'videocam' : 'headphones';
  }

  getIntroTypeLabel(): string {
    return (this.introLinkedType() ?? '').startsWith('video') ? 'Video' : 'Audio';
  }

  unlinkIntro(): void {
    this.introLinkedId.set(null);
    this.introLinkedTitle.set(null);
    this.introLinkedType.set(null);
    this.saveIntro(null);
  }

  async onIntroMediaSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const allowed = ['video/mp4', 'video/webm', 'audio/mpeg', 'audio/mp4', 'audio/aac', 'audio/wav'];
    if (!allowed.includes(file.type)) {
      this.introError.set('Formato no válido. Usa MP4, WebM, MP3, AAC o WAV.');
      input.value = '';
      return;
    }

    this.introError.set(null);
    this.introUploadProgress.set(0);

    try {
      const base = `${environment.apiUrl}/admin/resources`;
      const created = await firstValueFrom(
        this.http.post<{ id: string }>(base, {
          title: `Intro: Guía de emociones`,
          description: 'Video/audio introductorio de la guía de emociones.',
          type: file.type.startsWith('video') ? 1 : 0,
          status: 1,
          tags: ['emotions-guide-intro'],
        })
      );

      const signed = await firstValueFrom(
        this.http.post<{ uploadUrl: string; storagePath: string }>(
          `${base}/${created.id}/media/upload-url`, { contentType: file.type }
        )
      );

      await this.uploadToR2(signed.uploadUrl, file, pct => this.introUploadProgress.set(pct));

      await firstValueFrom(
        this.http.put(`${base}/${created.id}/media`, {
          storagePath: signed.storagePath, contentType: file.type, sizeBytes: file.size,
        })
      );

      this.introLinkedId.set(created.id);
      this.introLinkedTitle.set(file.name);
      this.introLinkedType.set(file.type);
      this.introUploadProgress.set(100);
      await this.saveIntro(created.id);

    } catch {
      this.introError.set('Error al subir el archivo. Intenta de nuevo.');
      this.introUploadProgress.set(null);
    } finally {
      input.value = '';
    }
  }

  private async saveIntro(resourceId: string | null): Promise<void> {
    const section = this.emotionsSection();
    if (!section) return;
    this.introSaving.set(true);
    try {
      await this.guideSectionSvc.update(section.id, {
        key: section.key, title: section.title,
        sortOrder: section.sortOrder, isActive: section.isActive,
        introResourceId: resourceId,
      });
    } catch {
      this.introError.set('Error al guardar el intro.');
    } finally {
      this.introSaving.set(false);
    }
  }

  private uploadToR2(url: string, file: File, onProgress: (pct: number) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', url);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.upload.onprogress = e => { if (e.lengthComputable) onProgress(Math.round(e.loaded / e.total * 100)); };
      xhr.onload  = () => xhr.status < 300 ? resolve() : reject();
      xhr.onerror = () => reject();
      xhr.send(file);
    });
  }

  // ── CRUD de emociones ──────────────────────────────────────────────────────

  readonly isEditMode = computed(() => this.editing() !== null);

  openCreate(): void { this.editing.set(null); this.saveError.set(null); this.isModalOpen.set(true); }
  openEdit(item: MoodCatalog): void { this.editing.set(item); this.saveError.set(null); this.isModalOpen.set(true); }
  closeModal(): void { if (!this.saving()) this.isModalOpen.set(false); }

  async onSave(event: MoodCatalogFormEvent): Promise<void> {
    this.saving.set(true);
    this.saveError.set(null);
    try {
      const editingItem = this.editing();
      if (editingItem) {
        await this.svc.update(editingItem.id, {
          name: event.name, emojiCode: event.emojiCode, description: event.description,
          color: event.color, sortOrder: event.sortOrder, isActive: event.isActive, resourceId: event.resourceId,
        });
      } else {
        await this.svc.create({
          name: event.name, emojiCode: event.emojiCode, description: event.description,
          color: event.color, sortOrder: event.sortOrder, resourceId: event.resourceId,
        });
      }
      this.isModalOpen.set(false);
    } catch (e: unknown) {
      this.saveError.set(e instanceof Error ? e.message : this.t.page.saveError);
    } finally {
      this.saving.set(false);
    }
  }

  async toggleActive(item: MoodCatalog): Promise<void> {
    const request = item.isActive ? this.svc.deactivate(item.id) : this.svc.reactivate(item.id, item);
    await request.catch(() => undefined);
  }

  getMediaBadge(item: MoodCatalog): string {
    if (!item.resourceId) return '';
    const ct = item.resourceContentType ?? '';
    if (ct.startsWith('video/')) return this.t.mediaTypes.video;
    if (ct.startsWith('audio/')) return this.t.mediaTypes.audio;
    return this.t.mediaTypes.media;
  }
}
