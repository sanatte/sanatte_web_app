import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Quote } from '../models/quote.model';
import { environment } from '../../../../environments/environment';
import { TEXTS } from '../../../core/i18n/texts';

export interface CreateQuoteBody {
  textEs: string;
  textEn?: string | null;
  author: string;
  scheduledFor?: string | null;
}

export interface UpdateQuoteBody extends CreateQuoteBody {
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class QuoteService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/admin/quotes`;

  private readonly _quotes  = signal<Quote[]>([]);
  private readonly _loading = signal(false);
  private readonly _error   = signal<string | null>(null);

  readonly quotes  = this._quotes.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error   = this._error.asReadonly();

  constructor() { this.loadAll(); }

  async loadAll(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      this._quotes.set(await firstValueFrom(this.http.get<Quote[]>(this.base)));
    } catch {
      this._error.set(TEXTS.admin.quotes.page.loadError);
    } finally {
      this._loading.set(false);
    }
  }

  async create(body: CreateQuoteBody): Promise<Quote> {
    const created = await firstValueFrom(this.http.post<Quote>(this.base, body));
    this._quotes.update((list) => [created, ...list]);
    return created;
  }

  async update(id: string, body: UpdateQuoteBody): Promise<Quote> {
    const updated = await firstValueFrom(this.http.put<Quote>(`${this.base}/${id}`, body));
    this._quotes.update((list) => list.map((q) => (q.id === id ? updated : q)));
    return updated;
  }

  async deactivate(id: string): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.base}/${id}`));
    this._quotes.update((list) => list.map((q) => (q.id === id ? { ...q, isActive: false } : q)));
  }

  async reactivate(item: Quote): Promise<void> {
    await this.update(item.id, {
      textEs: item.textEs,
      textEn: item.textEn,
      author: item.author,
      scheduledFor: item.scheduledFor,
      isActive: true,
    });
  }
}
