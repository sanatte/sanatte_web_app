import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Activation, ActivationStatus } from '../models/activation.model';
import { MOCK_DEVICE_STATS, MOCK_SECURITY_ALERTS } from '../mocks/activations.mock';
import { environment } from '../../../../environments/environment';

interface ApiStats { total: number; pending: number; failed: number; }

const STATUS_MAP: Record<number, ActivationStatus> = { 0: 'success', 1: 'pending', 2: 'failed' };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapApiActivation(raw: any): Activation {
  return {
    id:                 raw.id,
    licenseCode:        raw.licenseCode,
    orderId:            raw.orderId ?? undefined,
    productId:          raw.productId,
    productName:        raw.productName,
    userId:             raw.userId ?? undefined,
    userName:           raw.userName ?? undefined,
    userEmail:          raw.userEmail ?? undefined,
    userInitials:       raw.userInitials ?? undefined,
    userAvatarGradient: 'from-violet-400 to-purple-600',
    status:             STATUS_MAP[raw.status] ?? 'success',
    date:               raw.date ?? '',
    time:               raw.time ?? '',
    ipAddress:          raw.ipAddress ?? '—',
    device:             raw.device ?? 'Web',
    resourcesUnlocked:  raw.resourcesUnlocked ?? 0,
    createdAt:          raw.date ?? '',
  };
}

@Injectable({ providedIn: 'root' })
export class ActivationService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/admin/activations`;

  private readonly _activations = signal<Activation[]>([]);
  private readonly _stats       = signal<ApiStats>({ total: 0, pending: 0, failed: 0 });

  readonly activations    = this._activations.asReadonly();
  readonly stats          = computed(() => this._stats());
  // Distribución por dispositivo y alertas: presentación (mock por ahora).
  readonly deviceStats    = signal(MOCK_DEVICE_STATS).asReadonly();
  readonly securityAlerts = signal(MOCK_SECURITY_ALERTS).asReadonly();

  constructor() { this.loadAll(); }

  async loadAll(): Promise<void> {
    const [list, stats] = await Promise.all([
      firstValueFrom(this.http.get<unknown[]>(this.base)),
      firstValueFrom(this.http.get<ApiStats>(`${this.base}/stats`)),
    ]);
    this._activations.set(list.map(mapApiActivation));
    this._stats.set(stats);
  }

  async revoke(id: string): Promise<void> {
    const raw = await firstValueFrom(this.http.patch<unknown>(`${this.base}/${id}/fail`, {}));
    const updated = mapApiActivation(raw);
    this._activations.update((list) => list.map((a) => a.id === id ? updated : a));
    await this.refreshStats();
  }

  /** Refresca la lista tras una activación creada desde el flujo de cliente. */
  async refresh(): Promise<void> {
    await this.loadAll();
  }

  private async refreshStats(): Promise<void> {
    this._stats.set(await firstValueFrom(this.http.get<ApiStats>(`${this.base}/stats`)));
  }
}
