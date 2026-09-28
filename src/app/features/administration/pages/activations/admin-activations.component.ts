import { Component, inject, signal, computed } from '@angular/core';
import { ActivationService } from '../../services/activation.service';
import { ActivationTableComponent } from '../../components/activation-table/activation-table.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AdminPageHeaderComponent } from '../../../../shared/components/admin-page-header/admin-page-header.component';
import { SearchInputComponent } from '../../../../shared/components/search-input/search-input.component';
import { Activation, ActivationStatus } from '../../models/activation.model';
import { DecimalPipe } from '@angular/common';
import { TEXTS } from '../../../../core/i18n/texts';

type StatusFilter = 'all' | ActivationStatus;
const PAGE_SIZE = 10;

@Component({
  selector: 'app-admin-activations',
  imports: [DecimalPipe, ActivationTableComponent, ConfirmDialogComponent, AdminPageHeaderComponent, SearchInputComponent],
  templateUrl: './admin-activations.component.html',
})
export class AdminActivationsComponent {
  private readonly activationService = inject(ActivationService);

  protected readonly t = TEXTS.admin.activations.page;

  readonly searchTerm       = signal('');
  readonly statusFilter     = signal<StatusFilter>('all');
  readonly currentPage      = signal(1);
  readonly isConfirmOpen    = signal(false);
  readonly activationToRevoke = signal<Activation | null>(null);

  readonly stats        = this.activationService.stats;

  readonly statusOptions = [
    { value: 'all',     label: this.t.statusFilter.all     },
    { value: 'success', label: this.t.statusFilter.success },
    { value: 'pending', label: this.t.statusFilter.pending },
    { value: 'failed',  label: this.t.statusFilter.failed  },
  ];

  readonly filtered = computed(() => {
    let list = this.activationService.activations();
    const sf = this.statusFilter();
    if (sf !== 'all') list = list.filter((a) => a.status === sf);
    const term = this.searchTerm().toLowerCase().trim();
    if (term) list = list.filter(
      (a) => a.licenseCode.toLowerCase().includes(term)
           || a.productName.toLowerCase().includes(term)
           || a.userEmail?.toLowerCase().includes(term)
           || a.userName?.toLowerCase().includes(term)
    );
    return list;
  });

  readonly paginated = computed(() => {
    const start = (this.currentPage() - 1) * PAGE_SIZE;
    return this.filtered().slice(start, start + PAGE_SIZE);
  });

  onSearch(term: string): void { this.searchTerm.set(term); this.currentPage.set(1); }
  onStatusChange(e: Event): void {
    this.statusFilter.set((e.target as HTMLSelectElement).value as StatusFilter);
    this.currentPage.set(1);
  }
  onPageChange(page: number): void { this.currentPage.set(page); }

  onViewDetail(act: Activation): void {}

  onRevoke(act: Activation): void {
    this.activationToRevoke.set(act);
    this.isConfirmOpen.set(true);
  }

  confirmRevoke(): void {
    const a = this.activationToRevoke();
    if (a) this.activationService.revoke(a.id);
    this.isConfirmOpen.set(false);
    this.activationToRevoke.set(null);
  }

  cancelRevoke(): void {
    this.isConfirmOpen.set(false);
    this.activationToRevoke.set(null);
  }
}
