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

  readonly revoke     = output<License>();
  readonly copyCode   = output<License>();
  readonly viewOrder  = output<License>();
  readonly pageChange = output<number>();

  statusLabel(status: LicenseStatus): string {
    return { available: 'Disponible', active: 'Activa', revoked: 'Revocada' }[status];
  }

  canRevoke(license: License): boolean {
    return license.status === 'active';
  }
}
