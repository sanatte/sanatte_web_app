import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { EmotionsService } from '../../services/emotions.service';
import { Emotion, CreateEmotionRequest, UpdateEmotionRequest, EmotionStatus } from '../../models/emotion.model';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { SearchInputComponent } from '../../../../shared/components/search-input/search-input.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { EmotionTableComponent } from '../../components/emotion-table/emotion-table.component';
import { EmotionFormDialogComponent } from '../../components/emotion-form-dialog/emotion-form-dialog.component';

@Component({
  selector: 'app-emotion-list',
  imports: [
    HeaderComponent,
    SearchInputComponent,
    PaginationComponent,
    ConfirmDialogComponent,
    EmotionTableComponent,
    EmotionFormDialogComponent,
  ],
  templateUrl: './emotion-list.component.html',
})
export class EmotionListComponent implements OnInit {
  private readonly emotionsService = inject(EmotionsService);

  // Data state
  readonly allEmotions = signal<Emotion[]>([]);
  readonly loading = signal(false);
  readonly searchTerm = signal('');
  readonly statusFilter = signal<EmotionStatus | 'all'>('all');
  readonly showFilterDropdown = signal(false);

  // Pagination
  readonly currentPage = signal(1);
  readonly pageSize = 6;

  // Dialog state
  readonly showFormDialog = signal(false);
  readonly editingEmotion = signal<Emotion | null>(null);
  readonly showDeleteDialog = signal(false);
  readonly deletingEmotion = signal<Emotion | null>(null);

  // Computed: filtered emotions
  readonly filteredEmotions = computed(() => {
    let result = this.allEmotions();

    // Filter by status
    const status = this.statusFilter();
    if (status !== 'all') {
      result = result.filter((e) => e.status === status);
    }

    // Filter by search term
    const term = this.searchTerm().toLowerCase().trim();
    if (term) {
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(term) ||
          e.description.toLowerCase().includes(term)
      );
    }

    return result;
  });

  readonly totalFilteredCount = computed(() => this.filteredEmotions().length);

  readonly paginatedEmotions = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredEmotions().slice(start, start + this.pageSize);
  });

  ngOnInit(): void {
    this.loadEmotions();
  }

  loadEmotions(): void {
    this.loading.set(true);
    this.emotionsService.getEmotions().subscribe({
      next: (res) => {
        this.allEmotions.set(res.data ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
    this.currentPage.set(1);
  }

  onStatusFilter(status: EmotionStatus | 'all'): void {
    this.statusFilter.set(status);
    this.currentPage.set(1);
    this.showFilterDropdown.set(false);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  // CRUD operations
  openCreateDialog(): void {
    this.editingEmotion.set(null);
    this.showFormDialog.set(true);
  }

  openEditDialog(emotion: Emotion): void {
    this.editingEmotion.set(emotion);
    this.showFormDialog.set(true);
  }

  closeFormDialog(): void {
    this.showFormDialog.set(false);
    this.editingEmotion.set(null);
  }

  onSaveEmotion(data: CreateEmotionRequest | UpdateEmotionRequest): void {
    const editing = this.editingEmotion();

    if (editing) {
      this.emotionsService.updateEmotion(editing.id, data as UpdateEmotionRequest).subscribe({
        next: () => {
          this.closeFormDialog();
          this.loadEmotions();
        },
      });
    } else {
      this.emotionsService.createEmotion(data as CreateEmotionRequest).subscribe({
        next: () => {
          this.closeFormDialog();
          this.loadEmotions();
        },
      });
    }
  }

  onToggleStatus(emotion: Emotion): void {
    const action$ =
      emotion.status === 'active'
        ? this.emotionsService.deactivateEmotion(emotion.id)
        : this.emotionsService.activateEmotion(emotion.id);

    action$.subscribe({
      next: () => this.loadEmotions(),
    });
  }

  openDeleteDialog(emotion: Emotion): void {
    this.deletingEmotion.set(emotion);
    this.showDeleteDialog.set(true);
  }

  closeDeleteDialog(): void {
    this.showDeleteDialog.set(false);
    this.deletingEmotion.set(null);
  }

  confirmDelete(): void {
    const emotion = this.deletingEmotion();
    if (!emotion) return;

    this.emotionsService.deleteEmotion(emotion.id).subscribe({
      next: () => {
        this.closeDeleteDialog();
        this.loadEmotions();
      },
    });
  }
}
