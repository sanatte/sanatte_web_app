import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MoodCatalog } from '../models/mood-catalog.model';
import { environment } from '../../../../environments/environment';

export interface CreateMoodCatalogBody {
  name: string;
  emojiCode: string;
  description?: string | null;
  color?: string | null;
  sortOrder: number;
  resourceId?: string | null;
}

export interface UpdateMoodCatalogBody extends CreateMoodCatalogBody {
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class MoodCatalogService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/admin/mood-catalog`;

  private readonly _catalogs = signal<MoodCatalog[]>([]);
  private readonly _loading  = signal(false);
  private readonly _error    = signal<string | null>(null);

  readonly catalogs = this._catalogs.asReadonly();
  readonly loading  = this._loading.asReadonly();
  readonly error    = this._error.asReadonly();

  constructor() { this.loadAll(); }

  async loadAll(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const items = await firstValueFrom(this.http.get<MoodCatalog[]>(this.base));
      this._catalogs.set(items);
    } catch {
      this._error.set('No se pudo cargar el catálogo de emociones.');
    } finally {
      this._loading.set(false);
    }
  }

  async create(body: CreateMoodCatalogBody): Promise<MoodCatalog> {
    const created = await firstValueFrom(this.http.post<MoodCatalog>(this.base, body));
    this._catalogs.update((list) => [...list, created]);
    return created;
  }

  async update(id: string, body: UpdateMoodCatalogBody): Promise<MoodCatalog> {
    const updated = await firstValueFrom(this.http.put<MoodCatalog>(`${this.base}/${id}`, body));
    this._catalogs.update((list) => list.map((m) => (m.id === id ? updated : m)));
    return updated;
  }

  async deactivate(id: string): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.base}/${id}`));
    this._catalogs.update((list) =>
      list.map((m) => (m.id === id ? { ...m, isActive: false } : m))
    );
  }

  async reactivate(id: string, item: MoodCatalog): Promise<void> {
    const body: UpdateMoodCatalogBody = {
      name: item.name,
      emojiCode: item.emojiCode,
      description: item.description,
      color: item.color,
      sortOrder: item.sortOrder,
      isActive: true,
      resourceId: item.resourceId,
    };
    await this.update(id, body);
  }
}
