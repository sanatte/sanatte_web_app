import { Component, input, output } from '@angular/core';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { AdminUser } from '../../models/user-admin.model';
import { UserRole } from '../../../../core/models/role.model';

@Component({
  selector: 'app-user-table',
  imports: [StatusBadgeComponent, PaginationComponent],
  templateUrl: './user-table.component.html',
})
export class UserTableComponent {
  readonly users       = input.required<AdminUser[]>();
  readonly totalItems  = input.required<number>();
  readonly currentPage = input.required<number>();
  readonly pageSize    = input(10);

  readonly toggleStatus = output<AdminUser>();
  readonly toggleRole   = output<AdminUser>();
  readonly deleteUser   = output<AdminUser>();
  readonly pageChange   = output<number>();

  readonly UserRole = UserRole;

  roleLabel(role: UserRole): string {
    return role === UserRole.Admin ? 'Admin' : 'Usuario';
  }

  roleClasses(role: UserRole): string {
    return role === UserRole.Admin
      ? 'bg-primary-fixed text-on-primary-fixed-variant'
      : 'bg-surface-variant text-on-surface-variant';
  }
}
