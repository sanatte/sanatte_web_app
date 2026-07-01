import { Injectable, signal, computed } from '@angular/core';
import { Activation } from '../models/activation.model';
import {
  MOCK_ACTIVATIONS, MOCK_DEVICE_STATS, MOCK_SECURITY_ALERTS,
} from '../mocks/activations.mock';

@Injectable({ providedIn: 'root' })
export class ActivationService {
  private readonly _activations = signal<Activation[]>(MOCK_ACTIVATIONS);

  readonly activations   = this._activations.asReadonly();
  readonly deviceStats   = signal(MOCK_DEVICE_STATS).asReadonly();
  readonly securityAlerts = signal(MOCK_SECURITY_ALERTS).asReadonly();

  readonly stats = computed(() => {
    const list = this._activations();
    return {
      total:   list.filter((a) => a.status === 'success').length,
      pending: list.filter((a) => a.status === 'pending').length,
      failed:  list.filter((a) => a.status === 'failed').length,
    };
  });

  revoke(id: string): void {
    this._activations.update((list) =>
      list.map((a) => a.id === id ? { ...a, status: 'failed' as const } : a)
    );
  }
}
