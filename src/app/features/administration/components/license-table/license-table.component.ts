import { Component, input, output } from '@angular/core';
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
  readonly pageChange    = output<number>();
  readonly releaseBatch  = output<string>(); // emite el batchId

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
