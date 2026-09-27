import { Component, inject, signal, computed } from '@angular/core';
import { MoodCatalogService } from '../../services/mood-catalog.service';
import { MoodCatalog } from '../../models/mood-catalog.model';
import { AdminPageHeaderComponent } from '../../../../shared/components/admin-page-header/admin-page-header.component';
import { MoodCatalogFormDialogComponent, MoodCatalogFormEvent } from '../../components/mood-catalog-form-dialog/mood-catalog-form-dialog.component';

@Component({
  selector: 'app-admin-mood-catalog',
  imports: [AdminPageHeaderComponent, MoodCatalogFormDialogComponent],
  templateUrl: './admin-mood-catalog.component.html',
})
export class AdminMoodCatalogComponent {
  private readonly svc = inject(MoodCatalogService);

  readonly catalogs = this.svc.catalogs;
  readonly loading  = this.svc.loading;
  readonly error    = this.svc.error;

  readonly isModalOpen = signal(false);
  readonly editing     = signal<MoodCatalog | null>(null);
  readonly saving      = signal(false);
  readonly saveError   = signal<string | null>(null);

  readonly isEditMode = computed(() => this.editing() !== null);

  openCreate(): void {
    this.editing.set(null);
    this.saveError.set(null);
    this.isModalOpen.set(true);
  }

  openEdit(item: MoodCatalog): void {
    this.editing.set(item);
    this.saveError.set(null);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    if (!this.saving()) this.isModalOpen.set(false);
  }

  async onSave(event: MoodCatalogFormEvent): Promise<void> {
    this.saving.set(true);
    this.saveError.set(null);
    try {
      const editingItem = this.editing();
      if (editingItem) {
        await this.svc.update(editingItem.id, {
          name:        event.name,
          emojiCode:   event.emojiCode,
          description: event.description,
          color:       event.color,
          sortOrder:   event.sortOrder,
          isActive:    event.isActive,
          resourceId:  event.resourceId,
        });
      } else {
        await this.svc.create({
          name:        event.name,
          emojiCode:   event.emojiCode,
          description: event.description,
          color:       event.color,
          sortOrder:   event.sortOrder,
          resourceId:  event.resourceId,
        });
      }
      this.isModalOpen.set(false);
    } catch (e: unknown) {
      this.saveError.set(e instanceof Error ? e.message : 'Error al guardar la emoción.');
    } finally {
      this.saving.set(false);
    }
  }

  async toggleActive(item: MoodCatalog): Promise<void> {
    try {
      if (item.isActive) {
        await this.svc.deactivate(item.id);
      } else {
        await this.svc.reactivate(item.id, item);
      }
    } catch {
      // Error manejado en el servicio
    }
  }

  getMediaBadge(item: MoodCatalog): string {
    if (!item.resourceId) return '';
    const ct = item.resourceContentType ?? '';
    if (ct.startsWith('video/')) return 'Video';
    if (ct.startsWith('audio/')) return 'Audio';
    return 'Media';
  }
}
