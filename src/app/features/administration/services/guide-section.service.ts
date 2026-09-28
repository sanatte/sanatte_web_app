import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { GuideSection } from '../models/guide-section.model';
import { environment } from '../../../../environments/environment';
import { TEXTS } from '../../../core/i18n/texts';

export interface CreateGuideSectionBody {
  key: string;
  title: string;
  sortOrder: number;
  introResourceId?: string | null;
}

export interface UpdateGuideSectionBody extends CreateGuideSectionBody {
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class GuideSectionService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/admin/guide-sections`;

  private readonly _sections = signal<GuideSection[]>([]);
  private readonly _loading  = signal(false);
  private readonly _error    = signal<string | null>(null);

  readonly sections = this._sections.asReadonly();
  readonly loading  = this._loading.asReadonly();
  readonly error    = this._error.asReadonly();

  constructor() { this.loadAll(); }

  async loadAll(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const items = await firstValueFrom(this.http.get<GuideSection[]>(this.base));
      this._sections.set(items);
    } catch {
      this._error.set(TEXTS.admin.guideSections.page.loadError);
    } finally {
      this._loading.set(false);
    }
  }

  async create(body: CreateGuideSectionBody): Promise<GuideSection> {
    const created = await firstValueFrom(this.http.post<GuideSection>(this.base, body));
    this._sections.update((list) => [...list, created]);
    return created;
  }

  async update(id: string, body: UpdateGuideSectionBody): Promise<GuideSection> {
    const updated = await firstValueFrom(this.http.put<GuideSection>(`${this.base}/${id}`, body));
    this._sections.update((list) => list.map((s) => (s.id === id ? updated : s)));
    return updated;
  }

  async syncResources(id: string, resourceIds: string[]): Promise<GuideSection> {
    const updated = await firstValueFrom(
      this.http.put<GuideSection>(`${this.base}/${id}/resources`, { resourceIds })
    );
    this._sections.update((list) => list.map((s) => (s.id === id ? updated : s)));
    return updated;
  }

  async deactivate(id: string): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.base}/${id}`));
    this._sections.update((list) =>
      list.map((s) => (s.id === id ? { ...s, isActive: false } : s))
    );
  }

  async reactivate(id: string, item: GuideSection): Promise<void> {
    await this.update(id, {
      key:             item.key,
      title:           item.title,
      sortOrder:       item.sortOrder,
      isActive:        true,
      introResourceId: item.introResourceId,
    });
  }

  /** Retorna el ID de la sección del sistema "emotions" (para el admin de Emociones). */
  getEmotionsSectionId(): string | undefined {
    return this._sections().find(s => s.key === 'emotions')?.id;
  }
}
