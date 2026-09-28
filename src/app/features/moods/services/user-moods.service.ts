import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import {
  MoodCatalogItem,
  MoodEntry,
  MoodHistoryFilter,
  MoodSummary,
  PagedResult,
} from '../models/mood.model';
import { environment } from '../../../../environments/environment';
import { TEXTS } from '../../../core/i18n/texts';

const ERRORS = TEXTS.app.moods.errors;

@Injectable({ providedIn: 'root' })
export class UserMoodsService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly base = `${environment.apiUrl}/me`;

  private readonly _entries        = signal<MoodEntry[]>([]);
  private readonly _total          = signal(0);
  private readonly _summary        = signal<MoodSummary | null>(null);
  private readonly _catalog        = signal<MoodCatalogItem[]>([]);
  private readonly _loading        = signal(false);
  private readonly _summaryLoading = signal(false);
  private readonly _error          = signal<string | null>(null);
  private readonly _summaryError   = signal<string | null>(null);

  readonly entries        = this._entries.asReadonly();
  readonly total          = this._total.asReadonly();
  readonly summary        = this._summary.asReadonly();
  readonly catalog        = this._catalog.asReadonly();
  readonly loading        = this._loading.asReadonly();
  readonly summaryLoading = this._summaryLoading.asReadonly();
  readonly error          = this._error.asReadonly();
  readonly summaryError   = this._summaryError.asReadonly();

  private historyRequest = 0;
  private summaryRequest = 0;

  async loadHistory(filter: MoodHistoryFilter = {}): Promise<void> {
    const request = ++this.historyRequest;
    this._loading.set(true);
    this._error.set(null);
    await this.auth.whenReady();
    try {
      let params = new HttpParams()
        .set('page', String(filter.page ?? 1))
        .set('pageSize', String(filter.pageSize ?? 10));
      if (filter.from)          params = params.set('from', filter.from);
      if (filter.to)            params = params.set('to', filter.to);
      if (filter.moodCatalogId) params = params.set('moodCatalogId', filter.moodCatalogId);

      const res = await firstValueFrom(
        this.http.get<PagedResult<MoodEntry>>(`${this.base}/moods`, { params })
      );
      if (request !== this.historyRequest) return;
      this._entries.set(res.items);
      this._total.set(res.totalItems);
    } catch {
      if (request !== this.historyRequest) return;
      this._entries.set([]);
      this._total.set(0);
      this._error.set(ERRORS.history);
    } finally {
      if (request === this.historyRequest) this._loading.set(false);
    }
  }

  async loadSummary(from: string, to: string): Promise<void> {
    const request = ++this.summaryRequest;
    this._summaryLoading.set(true);
    this._summaryError.set(null);
    await this.auth.whenReady();
    try {
      const params = new HttpParams().set('from', from).set('to', to);
      const res = await firstValueFrom(
        this.http.get<MoodSummary>(`${this.base}/moods/summary`, { params })
      );
      if (request !== this.summaryRequest) return;
      this._summary.set(res);
    } catch {
      if (request !== this.summaryRequest) return;
      this._summary.set(null);
      this._summaryError.set(ERRORS.summary);
    } finally {
      if (request === this.summaryRequest) this._summaryLoading.set(false);
    }
  }

  async loadCatalog(): Promise<void> {
    await this.auth.whenReady();
    try {
      const list = await firstValueFrom(
        this.http.get<MoodCatalogItem[]>(`${this.base}/mood-catalog`)
      );
      this._catalog.set([...list].sort((a, b) => a.sortOrder - b.sortOrder));
    } catch {
      this._catalog.set([]);
    }
  }
}
