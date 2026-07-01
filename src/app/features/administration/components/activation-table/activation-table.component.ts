import { Component, input, output, computed } from '@angular/core';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { Activation, ActivationStatus } from '../../models/activation.model';

const STATUS_MAP: Record<ActivationStatus, { badge: string; label: string }> = {
  success: { badge: 'active',    label: 'Exitosa'     },
  pending: { badge: 'pending',   label: 'En proceso'  },
  failed:  { badge: 'cancelled', label: 'Fallida'     },
};

@Component({
  selector: 'app-activation-table',
  imports: [StatusBadgeComponent, PaginationComponent],
  templateUrl: './activation-table.component.html',
})
export class ActivationTableComponent {
  readonly activations = input.required<Activation[]>();
  readonly totalItems  = input.required<number>();
  readonly currentPage = input.required<number>();
  readonly pageSize    = input(10);

  readonly viewDetail = output<Activation>();
  readonly revoke     = output<Activation>();
  readonly pageChange = output<number>();

  statusBadge  = (s: ActivationStatus) => STATUS_MAP[s].badge;
  statusLabel  = (s: ActivationStatus) => STATUS_MAP[s].label;
  canRevoke    = (a: Activation) => a.status === 'success';
}
