import { Injectable, signal, computed } from '@angular/core';
import { AdminUser, UserStatus } from '../models/user-admin.model';
import { UserRole } from '../../../core/models/role.model';
import { MOCK_ADMIN_USERS } from '../mocks/users.mock';

@Injectable({ providedIn: 'root' })
export class UserAdminService {
  private readonly _users = signal<AdminUser[]>(MOCK_ADMIN_USERS);

  readonly users = this._users.asReadonly();
  readonly total = computed(() => this._users().length);

  updateRole(id: string, role: UserRole): void {
    this._users.update((list) => list.map((u) => u.id === id ? { ...u, role } : u));
  }

  updateStatus(id: string, status: UserStatus): void {
    this._users.update((list) => list.map((u) => u.id === id ? { ...u, status } : u));
  }

  delete(id: string): void {
    this._users.update((list) => list.filter((u) => u.id !== id));
  }
}
