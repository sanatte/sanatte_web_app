import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AdminUser, UserStatus } from '../models/user-admin.model';
import { UserRole } from '../../../core/models/role.model';
import { environment } from '../../../../environments/environment';

interface PagedResult<T> { items: T[]; page: number; pageSize: number; totalItems: number; }

// Normaliza enums de C# (0/1) → strings del front
const ROLE_MAP: Record<number, UserRole>     = { 0: UserRole.User, 1: UserRole.Admin };
const STATUS_MAP: Record<number, UserStatus> = { 0: 'active', 1: 'blocked' };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapApiUser(raw: any): AdminUser {
  const name: string = raw.displayName ?? raw.email ?? '';
  return {
    id:                     raw.id,
    displayName:            name,
    email:                  raw.email,
    role:                   ROLE_MAP[raw.role]   ?? UserRole.User,
    status:                 STATUS_MAP[raw.status] ?? 'active',
    avatarInitials:         name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2),
    avatarGradient:         'from-violet-400 to-purple-600',
    productsCount:          raw.ordersCount ?? 0,
    activationsCount:       0,
    hasActiveSubscription:  false,
    createdAt:              raw.createdAt?.split('T')[0] ?? '',
    lastLoginAt:            raw.lastLoginAt?.split('T')[0] ?? '—',
  };
}

@Injectable({ providedIn: 'root' })
export class UserAdminService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/admin/users`;

  private readonly _users   = signal<AdminUser[]>([]);
  private readonly _loading = signal(false);
  private readonly _total   = signal(0);

  readonly users   = this._users.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly total   = computed(() => this._total());

  constructor() { this.loadAll(); }

  async loadAll(): Promise<void> {
    this._loading.set(true);
    try {
      const params = new HttpParams().set('pageSize', '100');
      const res = await firstValueFrom(
        this.http.get<PagedResult<unknown>>(this.base, { params })
      );
      this._users.set(res.items.map(mapApiUser));
      this._total.set(res.totalItems);
    } finally {
      this._loading.set(false);
    }
  }

  /** Crea un administrador (cuenta en Firebase + registro local rol Admin). */
  async createAdmin(input: { displayName: string; email: string; password: string }): Promise<void> {
    const raw = await firstValueFrom(this.http.post<unknown>(this.base, input));
    const created = mapApiUser(raw);
    this._users.update((list) => [created, ...list]);
    this._total.update((t) => t + 1);
  }

  async updateRole(id: string, role: UserRole): Promise<void> {
    const roleNum = role === UserRole.Admin ? 1 : 0;
    const raw = await firstValueFrom(
      this.http.patch<unknown>(`${this.base}/${id}/role`, { role: roleNum })
    );
    const updated = mapApiUser(raw);
    this._users.update((list) => list.map((u) => u.id === id ? updated : u));
  }

  async updateStatus(id: string, status: UserStatus): Promise<void> {
    const statusNum = status === 'blocked' ? 1 : 0;
    const raw = await firstValueFrom(
      this.http.patch<unknown>(`${this.base}/${id}/status`, { status: statusNum })
    );
    const updated = mapApiUser(raw);
    this._users.update((list) => list.map((u) => u.id === id ? updated : u));
  }

  delete(id: string): void {
    // Soft delete pendiente de endpoint — optimistic local
    this._users.update((list) => list.filter((u) => u.id !== id));
    this._total.update((t) => Math.max(0, t - 1));
  }
}
