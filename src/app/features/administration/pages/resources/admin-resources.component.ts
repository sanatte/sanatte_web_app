import { Component, inject, signal, computed } from '@angular/core';
import { ResourceService } from '../../services/resource.service';
import { ResourceCardComponent } from '../../components/resource-card/resource-card.component';
import { ResourceFormDialogComponent } from '../../components/resource-form-dialog/resource-form-dialog.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AdminPageHeaderComponent } from '../../../../shared/components/admin-page-header/admin-page-header.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { SearchInputComponent } from '../../../../shared/components/search-input/search-input.component';
import { Resource, ResourceType } from '../../models/resource.model';

type TabFilter = 'all' | ResourceType | 'exercise';

const PAGE_SIZE = 8;

@Component({
  selector: 'app-admin-resources',
  imports: [
    ResourceCardComponent, ResourceFormDialogComponent,
    ConfirmDialogComponent, AdminPageHeaderComponent,
    PaginationComponent, SearchInputComponent,
  ],
  templateUrl: './admin-resources.component.html',
})
export class AdminResourcesComponent {
  private readonly resourceService = inject(ResourceService);

  readonly searchTerm       = signal('');
  readonly activeTab        = signal<TabFilter>('all');
  readonly currentPage      = signal(1);
  readonly isModalOpen      = signal(false);
  readonly editingResource  = signal<Resource | null>(null);
  readonly isConfirmOpen    = signal(false);
  readonly resourceToDelete = signal<Resource | null>(null);

  readonly tabs: { key: TabFilter; label: string }[] = [
    { key: 'all',      label: 'Todos'      },
    { key: 'audio',    label: 'Audio'      },
    { key: 'video',    label: 'Video'      },
    { key: 'pdf',      label: 'PDF'        },
    { key: 'article',  label: 'Artículos'  },
    { key: 'exercise', label: 'Ejercicios' },
  ];

  readonly filtered = computed(() => {
    let list = this.resourceService.resources();
    const tab = this.activeTab();
    if (tab === 'exercise') list = list.filter((r) => r.tags.includes('exercise'));
    else if (tab !== 'all') list = list.filter((r) => r.type === tab);
    const term = this.searchTerm().toLowerCase().trim();
    if (term) list = list.filter(
      (r) => r.title.toLowerCase().includes(term) || r.tags.some((t) => t.toLowerCase().includes(term))
    );
    return list;
  });

  readonly paginated = computed(() => {
    const start = (this.currentPage() - 1) * PAGE_SIZE;
    return this.filtered().slice(start, start + PAGE_SIZE);
  });

  readonly deleteMessage = computed(() => {
    const r = this.resourceToDelete();
    return r ? `¿Eliminar "${r.title}"? Esta acción no se puede deshacer.` : '';
  });

  onTabChange(tab: TabFilter): void { this.activeTab.set(tab); this.currentPage.set(1); }
  onSearch(term: string): void { this.searchTerm.set(term); this.currentPage.set(1); }

  openCreate(): void { this.editingResource.set(null); this.isModalOpen.set(true); }
  openEdit(r: Resource): void { this.editingResource.set(r); this.isModalOpen.set(true); }
  closeModal(): void { this.isModalOpen.set(false); this.editingResource.set(null); }

  onSave(data: Partial<Resource>): void {
    const editing = this.editingResource();
    editing ? this.resourceService.update(editing.id, data) : this.resourceService.create(data as any);
    this.closeModal();
  }

  requestDelete(r: Resource): void { this.resourceToDelete.set(r); this.isConfirmOpen.set(true); }

  confirmDelete(): void {
    const r = this.resourceToDelete();
    if (r) this.resourceService.delete(r.id);
    this.isConfirmOpen.set(false);
    this.resourceToDelete.set(null);
  }

  cancelDelete(): void { this.isConfirmOpen.set(false); this.resourceToDelete.set(null); }
}
