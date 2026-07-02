import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { License, LicenseStatus } from '../models/license.model';
import { MOCK_LICENSE_ACTIVITY, MOCK_TREND_DATA } from '../mocks/licenses.mock';
import { environment } from '../../../../environments/environment';

interface ApiStats { total: number; pending: number; activated: number; }

const STATUS_MAP: Record<number, LicenseStatus> = { 0: 'available', 1: 'active', 2: 'revoked' };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapApiLicense(raw: any): License {
  return {
    id:                 raw.id,
    code:               raw.code,
    batchId:            raw.batchId,
    productId:          raw.productId,
    productName:        raw.productName,
    orderId:            raw.orderId ?? undefined,
    userId:             raw.userId ?? undefined,
    userName:           raw.userName ?? undefined,
    userInitials:       raw.userInitials ?? undefined,
    userAvatarGradient: 'from-violet-400 to-purple-600',
    status:             STATUS_MAP[raw.status] ?? 'available',
    generatedAt:        raw.generatedAt ?? '',
    activatedAt:        raw.activatedAt ?? undefined,
  };
}

@Injectable({ providedIn: 'root' })
export class LicenseService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/admin/licenses`;

  private readonly _licenses = signal<License[]>([]);
  private readonly _stats    = signal<ApiStats>({ total: 0, pending: 0, activated: 0 });

  readonly licenses  = this._licenses.asReadonly();
  readonly stats     = computed(() => this._stats());
  // Feed de actividad y tendencia: presentación (mock por ahora).
  readonly activity  = signal(MOCK_LICENSE_ACTIVITY).asReadonly();
  readonly trendData = signal(MOCK_TREND_DATA).asReadonly();

  constructor() { this.loadAll(); }

  async loadAll(): Promise<void> {
    const [list, stats] = await Promise.all([
      firstValueFrom(this.http.get<unknown[]>(this.base)),
      firstValueFrom(this.http.get<ApiStats>(`${this.base}/stats`)),
    ]);
    this._licenses.set(list.map(mapApiLicense));
    this._stats.set(stats);
  }

  async generateBatch(productId: string, _productName: string, quantity: number): Promise<void> {
    const created = await firstValueFrom(
      this.http.post<unknown[]>(`${this.base}/batch`, { productId, quantity })
    );
    this._licenses.update((list) => [...created.map(mapApiLicense), ...list]);
    await this.refreshStats();
  }

  async revoke(id: string): Promise<void> {
    const raw = await firstValueFrom(this.http.patch<unknown>(`${this.base}/${id}/revoke`, {}));
    const updated = mapApiLicense(raw);
    this._licenses.update((list) => list.map((l) => l.id === id ? updated : l));
    await this.refreshStats();
  }

  /** Busca por código en las licencias cargadas (usado por el flujo de activación). */
  findByCode(code: string): License | undefined {
    const norm = code.trim().toUpperCase();
    return this._licenses().find((l) => l.code.toUpperCase() === norm);
  }

  /** Marca localmente una licencia como activada (la persistencia real llega con Activaciones). */
  activate(
    id: string,
    user: { userId: string; userName: string; userInitials: string; userAvatarGradient: string },
  ): void {
    this._licenses.update((list) =>
      list.map((l) => l.id === id
        ? { ...l, status: 'active' as LicenseStatus, ...user, activatedAt: new Date().toISOString().split('T')[0] }
        : l)
    );
  }

  private async refreshStats(): Promise<void> {
    this._stats.set(await firstValueFrom(this.http.get<ApiStats>(`${this.base}/stats`)));
  }
}
