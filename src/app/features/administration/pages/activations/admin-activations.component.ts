import { Component, inject, signal, computed } from '@angular/core';
import { ActivationService } from '../../services/activation.service';
import { ActivationTableComponent } from '../../components/activation-table/activation-table.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AdminPageHeaderComponent } from '../../../../shared/components/admin-page-header/admin-page-header.component';
import { SearchInputComponent } from '../../../../shared/components/search-input/search-input.component';
import { Activation, ActivationStatus } from '../../models/activation.model';
import { DecimalPipe } from '@angular/common';

type StatusFilter = 'all' | ActivationStatus;
const PAGE_SIZE = 10;

@Component({
  selector: 'app-admin-activations',
  imports: [DecimalPipe, ActivationTableComponent, ConfirmDialogComponent, AdminPageHeaderComponent, SearchInputComponent],
  templateUrl: './admin-activations.component.html',
})
export class AdminActivationsComponent {
  private readonly activationService = inject(ActivationService);

  readonly searchTerm       = signal('');
  readonly statusFilter     = signal<StatusFilter>('all');
  readonly currentPage      = signal(1);
  readonly isConfirmOpen    = signal(false);
  readonly activationToRevoke = signal<Activation | null>(null);

  readonly stats        = this.activationService.stats;
  readonly deviceStats  = this.activationService.deviceStats;
  readonly alerts       = this.activationService.securityAlerts;

  readonly statusOptions = [
    { value: 'all',     label: 'Estado: Todos'  },
    { value: 'success', label: 'Exitosas'        },
    { value: 'pending', label: 'En proceso'      },
    { value: 'failed',  label: 'Fallidas'        },
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

  onViewDetail(act: Activation): void {
    // placeholder - detalle de activación
  }

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

  alertBgClass(type: string): string {
    return type === 'error' ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100';
  }
  alertIconClass(type: string): string {
    return type === 'error' ? 'text-red-500' : 'text-amber-500';
  }
  alertTitleClass(type: string): string {
    return type === 'error' ? 'text-red-700' : 'text-amber-700';
  }
  alertDetailClass(type: string): string {
    return type === 'error' ? 'text-red-600' : 'text-amber-600';
  }
}
