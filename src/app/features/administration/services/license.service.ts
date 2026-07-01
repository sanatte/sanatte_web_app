import { Injectable, signal, computed } from '@angular/core';
import { License, LicenseStatus } from '../models/license.model';
import { MOCK_LICENSES, MOCK_LICENSE_ACTIVITY, MOCK_TREND_DATA } from '../mocks/licenses.mock';

@Injectable({ providedIn: 'root' })
export class LicenseService {
  private readonly _licenses = signal<License[]>(MOCK_LICENSES);

  readonly licenses  = this._licenses.asReadonly();
  readonly activity  = signal(MOCK_LICENSE_ACTIVITY).asReadonly();
  readonly trendData = signal(MOCK_TREND_DATA).asReadonly();

  readonly stats = computed(() => {
    const list = this._licenses();
    return {
      total:     list.length,
      pending:   list.filter((l) => l.status === 'available').length,
      activated: list.filter((l) => l.status === 'active').length,
    };
  });

  revoke(id: string): void {
    this._licenses.update((list) =>
      list.map((l) => l.id === id ? { ...l, status: 'revoked' as LicenseStatus } : l)
    );
  }

  generateBatch(productId: string, productName: string, quantity: number): void {
    const batchId = `Lote #${Math.floor(Math.random() * 90) + 10}-X`;
    const newLicenses: License[] = Array.from({ length: quantity }, (_, i) => ({
      id: `l-${Date.now()}-${i}`,
      code: `SN-${Math.random().toString(36).substring(2, 4).toUpperCase()}-${Math.floor(Math.random() * 9000) + 1000}`,
      batchId,
      productId,
      productName,
      status: 'available' as LicenseStatus,
      generatedAt: new Date().toISOString().split('T')[0],
    }));
    this._licenses.update((list) => [...newLicenses, ...list]);
  }
}
