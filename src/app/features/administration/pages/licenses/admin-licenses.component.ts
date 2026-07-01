import { Component, inject, signal, computed } from '@angular/core';
import { LicenseService } from '../../services/license.service';
import { LicenseTableComponent } from '../../components/license-table/license-table.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AdminPageHeaderComponent } from '../../../../shared/components/admin-page-header/admin-page-header.component';
import { SearchInputComponent } from '../../../../shared/components/search-input/search-input.component';
import { License } from '../../models/license.model';
import { GenerateBatchDialogComponent } from '../../components/generate-batch-dialog/generate-batch-dialog.component';
import { DecimalPipe } from '@angular/common';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-admin-licenses',
  imports: [DecimalPipe, LicenseTableComponent, ConfirmDialogComponent, AdminPageHeaderComponent, SearchInputComponent, GenerateBatchDialogComponent],
  templateUrl: './admin-licenses.component.html',
})
export class AdminLicensesComponent {
  private readonly licenseService = inject(LicenseService);

  readonly searchTerm    = signal('');
  readonly currentPage   = signal(1);
  readonly isConfirmOpen    = signal(false);
  readonly licenseToRevoke  = signal<License | null>(null);
  readonly isBatchDialogOpen = signal(false);

  readonly stats    = this.licenseService.stats;
  readonly activity = this.licenseService.activity;
  readonly trends   = this.licenseService.trendData;

  readonly filtered = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.licenseService.licenses();
    return this.licenseService.licenses().filter(
      (l) => l.code.toLowerCase().includes(term)
           || l.productName.toLowerCase().includes(term)
           || l.userName?.toLowerCase().includes(term)
           || l.batchId.toLowerCase().includes(term)
    );
  });

  readonly paginated = computed(() => {
    const start = (this.currentPage() - 1) * PAGE_SIZE;
    return this.filtered().slice(start, start + PAGE_SIZE);
  });

  onSearch(term: string): void { this.searchTerm.set(term); this.currentPage.set(1); }
  onPageChange(page: number): void { this.currentPage.set(page); }

  openBatchDialog(): void { this.isBatchDialogOpen.set(true); }
  closeBatchDialog(): void { this.isBatchDialogOpen.set(false); }

  onGenerateBatch(data: { productId: string; productName: string; quantity: number }): void {
    this.licenseService.generateBatch(data.productId, data.productName, data.quantity);
    this.closeBatchDialog();
  }

  onCopyCode(license: License): void {
    navigator.clipboard?.writeText(license.code).catch(() => {});
    // Toast feedback - placeholder
  }

  onViewOrder(license: License): void {
    // Navigate to order - placeholder
  }

  onRevoke(license: License): void {
    this.licenseToRevoke.set(license);
    this.isConfirmOpen.set(true);
  }

  confirmRevoke(): void {
    const l = this.licenseToRevoke();
    if (l) this.licenseService.revoke(l.id);
    this.isConfirmOpen.set(false);
    this.licenseToRevoke.set(null);
  }

  cancelRevoke(): void {
    this.isConfirmOpen.set(false);
    this.licenseToRevoke.set(null);
  }

  activityIcon(type: string): string {
    return { activation: 'bolt', batch: 'verified', revocation: 'warning' }[type] ?? 'info';
  }

  activityIconClasses(type: string): string {
    return {
      activation: 'bg-primary/10 text-primary',
      batch:      'bg-secondary/10 text-secondary',
      revocation: 'bg-error-container/20 text-error',
    }[type] ?? 'bg-surface-container text-outline';
  }
}
