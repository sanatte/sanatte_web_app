import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { mapApiOrder } from '../../administration/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { Order } from '../../administration/models/order.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserOrdersService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  private readonly _orders  = signal<Order[]>([]);
  private readonly _loading = signal(false);
  private readonly _loaded  = signal(false);

  readonly orders  = this._orders.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly loaded  = this._loaded.asReadonly();

  constructor() { this.load(); }

  async load(): Promise<void> {
    await this.auth.whenReady();
    if (!this.auth.currentUser()) { this._orders.set([]); this._loaded.set(true); return; }
    this._loading.set(true);
    try {
      const list = await firstValueFrom(
        this.http.get<unknown[]>(`${environment.apiUrl}/me/orders`)
      );
      this._orders.set(list.map(mapApiOrder));
    } finally {
      this._loading.set(false);
      this._loaded.set(true);
    }
  }

  getById(id: string): Order | undefined {
    return this._orders().find((o) => o.id === id);
  }
}
