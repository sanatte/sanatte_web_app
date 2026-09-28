import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MoodEntryAdmin, PagedResult } from '../models/mood-catalog.model';
import { environment } from '../../../../environments/environment';
import { TEXTS } from '../../../core/i18n/texts';

export interface MoodTrackingFilter {
  userId?: string;
  moodCatalogId?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}

@Injectable({ providedIn: 'root' })
export class MoodTrackingService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/admin/moods`;

  private readonly _entries  = signal<MoodEntryAdmin[]>([]);
  private readonly _total    = signal(0);
  private readonly _loading  = signal(false);
  private readonly _error    = signal<string | null>(null);

  readonly entries = this._entries.asReadonly();
  readonly total   = this._total.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error   = this._error.asReadonly();

  async loadAll(filter: MoodTrackingFilter = {}): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      let params = new HttpParams()
        .set('page', String(filter.page ?? 1))
        .set('pageSize', String(filter.pageSize ?? 20));
      if (filter.userId)        params = params.set('userId', filter.userId);
      if (filter.moodCatalogId) params = params.set('moodCatalogId', filter.moodCatalogId);
      if (filter.from)          params = params.set('from', filter.from);
      if (filter.to)            params = params.set('to', filter.to);

      const res = await firstValueFrom(
        this.http.get<PagedResult<MoodEntryAdmin>>(this.base, { params })
      );
      this._entries.set(res.items);
      this._total.set(res.totalItems);
    } catch {
      this._error.set(TEXTS.admin.moodTracking.page.loadError);
    } finally {
      this._loading.set(false);
    }
  }

  async loadByUser(userId: string, filter: Omit<MoodTrackingFilter, 'userId'> = {}): Promise<void> {
    await this.loadAll({ ...filter, userId });
  }
}
