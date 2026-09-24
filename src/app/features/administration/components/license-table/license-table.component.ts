import { Component, computed, input, output, signal } from '@angular/core';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { License, LicenseStatus } from '../../models/license.model';

@Component({
  selector: 'app-license-table',
  imports: [StatusBadgeComponent, PaginationComponent],
  templateUrl: './license-table.component.html',
})
export class LicenseTableComponent {
  readonly licenses    = input.required<License[]>();
  readonly totalItems  = input.required<number>();
  readonly currentPage = input.required<number>();
  readonly pageSize    = input(10);

  readonly revoke        = output<License>();
  readonly copyCode      = output<License>();
  readonly viewOrder     = output<License>();
  readonly downloadQr    = output<License>();
  readonly downloadCard  = output<License>();
  readonly pageChange    = output<number>();
  readonly releaseBatch  = output<string>();
  readonly downloadCards = output<License[]>();

  readonly selectedIds = signal<Set<string>>(new Set());

  readonly selectableLicenses = computed(() =>
    this.licenses().filter(l => l.status !== 'revoked')
  );

  readonly selectedCount = computed(() => this.selectedIds().size);

  readonly allSelected = computed(() => {
    const selectable = this.selectableLicenses();
    return selectable.length > 0 && selectable.every(l => this.selectedIds().has(l.id));
  });

  readonly selectedLicenses = computed(() =>
    this.licenses().filter(l => this.selectedIds().has(l.id))
  );

  isSelected(id: string): boolean {
    return this.selectedIds().has(id);
  }

  toggleOne(license: License): void {
    if (license.status === 'revoked') return;
    this.selectedIds.update(set => {
      const next = new Set(set);
      next.has(license.id) ? next.delete(license.id) : next.add(license.id);
      return next;
    });
  }

  toggleAll(): void {
    const selectable = this.selectableLicenses();
    if (this.allSelected()) {
      this.selectedIds.update(set => {
        const next = new Set(set);
        selectable.forEach(l => next.delete(l.id));
        return next;
      });
    } else {
      this.selectedIds.update(set => {
        const next = new Set(set);
        selectable.forEach(l => next.add(l.id));
        return next;
      });
    }
  }

  clearSelection(): void {
    this.selectedIds.set(new Set());
  }

  onPageChange(page: number): void {
    this.clearSelection();
    this.pageChange.emit(page);
  }

  statusLabel(status: LicenseStatus): string {
    return {
      preparing: 'En preparación',
      available: 'Disponible',
      assigned: 'Asignada',
      sold: 'Vendida',
      active: 'Activa',
      revoked: 'Revocada',
    }[status] ?? status;
  }

  statusVariant(status: LicenseStatus): string {
    return status === 'preparing' ? 'warning'
         : status === 'available' ? 'pending'
         : status === 'active'    ? 'active'
         : 'cancelled';
  }

  canRevoke(license: License): boolean {
    return license.status !== 'revoked' && license.status !== 'active';
  }
}
