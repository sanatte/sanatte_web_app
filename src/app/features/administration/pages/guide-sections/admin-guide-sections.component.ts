import { Component, inject, signal, computed } from '@angular/core';
import { GuideSectionService } from '../../services/guide-section.service';
import { GuideSection } from '../../models/guide-section.model';
import { TEXTS } from '../../../../core/i18n/texts';
import { AdminPageHeaderComponent } from '../../../../shared/components/admin-page-header/admin-page-header.component';
import { GuideSectionFormDialogComponent, GuideSectionFormEvent } from '../../components/guide-section-form-dialog/guide-section-form-dialog.component';

@Component({
  selector: 'app-admin-guide-sections',
  imports: [AdminPageHeaderComponent, GuideSectionFormDialogComponent],
  templateUrl: './admin-guide-sections.component.html',
})
export class AdminGuideSectionsComponent {
  private readonly svc = inject(GuideSectionService);

  protected readonly t = TEXTS.admin.guideSections;

  readonly sections  = this.svc.sections;
  readonly loading   = this.svc.loading;
  readonly error     = this.svc.error;

  readonly isModalOpen = signal(false);
  readonly editing     = signal<GuideSection | null>(null);
  readonly saving      = signal(false);
  readonly saveError   = signal<string | null>(null);

  readonly isEditMode = computed(() => this.editing() !== null);

  openCreate(): void {
    this.editing.set(null);
    this.saveError.set(null);
    this.isModalOpen.set(true);
  }

  openEdit(item: GuideSection): void {
    this.editing.set(item);
    this.saveError.set(null);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    if (!this.saving()) this.isModalOpen.set(false);
  }

  async onSave(event: GuideSectionFormEvent): Promise<void> {
    this.saving.set(true);
    this.saveError.set(null);
    try {
      const editingItem = this.editing();
      if (editingItem) {
        await this.svc.update(editingItem.id, {
          key:             event.key,
          title:           event.title,
          sortOrder:       event.sortOrder,
          isActive:        event.isActive,
          introResourceId: event.introResourceId,
        });
      } else {
        await this.svc.create({
          key:             event.key,
          title:           event.title,
          sortOrder:       event.sortOrder,
          introResourceId: event.introResourceId,
        });
      }
      this.isModalOpen.set(false);
    } catch (e: unknown) {
      this.saveError.set(e instanceof Error ? e.message : this.t.page.saveError);
    } finally {
      this.saving.set(false);
    }
  }

  async toggleActive(item: GuideSection): Promise<void> {
    const request = item.isActive
      ? this.svc.deactivate(item.id)
      : this.svc.reactivate(item.id, item);
    await request.catch(() => undefined);
  }

  getIntroBadge(item: GuideSection): string {
    if (!item.introResourceId) return '';
    const ct = item.introResourceContentType ?? '';
    if (ct.startsWith('video/')) return this.t.mediaTypes.video;
    if (ct.startsWith('audio/')) return this.t.mediaTypes.audio;
    return this.t.mediaTypes.media;
  }
}
