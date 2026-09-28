import { Component, input, output, computed } from '@angular/core';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { TEXTS } from '../../../../core/i18n/texts';
import { Activation, ActivationStatus } from '../../models/activation.model';

const STATUS_BADGE: Record<ActivationStatus, string> = {
  success: 'active',
  pending: 'pending',
  failed:  'cancelled',
};

@Component({
  selector: 'app-activation-table',
  imports: [StatusBadgeComponent, PaginationComponent],
  templateUrl: './activation-table.component.html',
})
export class ActivationTableComponent {
  protected readonly t = TEXTS.admin.activations.table;

  readonly activations = input.required<Activation[]>();
  readonly totalItems  = input.required<number>();
  readonly currentPage = input.required<number>();
  readonly pageSize    = input(10);

  readonly viewDetail = output<Activation>();
  readonly revoke     = output<Activation>();
  readonly pageChange = output<number>();

  statusBadge  = (s: ActivationStatus) => STATUS_BADGE[s];
  statusLabel  = (s: ActivationStatus) => this.t.statuses[s];
  canRevoke    = (a: Activation) => a.status === 'success';
}
