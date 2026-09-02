import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Ally } from '../models/ally.model';
import { environment } from '../../../../environments/environment';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapApi(raw: any): Ally {
  return {
    id:                  raw.id,
    name:                raw.name,
    description:         raw.description ?? null,
    pillar:              raw.pillar,
    logoUrl:             raw.logoUrl ?? null,
    brandColor:          raw.brandColor ?? '#7C4DFF',
    whatsApp:            raw.whatsApp ?? '',
    website:             raw.website ?? null,
    benefitTitle:        raw.benefitTitle,
    benefitDescription:  raw.benefitDescription ?? null,
    isActive:            raw.isActive ?? true,
    discountCode:        raw.discountCode ?? null,
    discountPercentage:  raw.discountPercentage ?? null,
    discountExpiresAt:   raw.discountExpiresAt ?? null,
    discountUsageCount:  raw.discountUsageCount ?? 0,
    createdAt:           raw.createdAt?.split('T')[0] ?? '',
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toBody(a: Partial<Ally>): any {
  return {
    name:               a.name,
    description:        a.description ?? null,
    pillar:             a.pillar,
    brandColor:         a.brandColor ?? null,
    whatsApp:           a.whatsApp,
    website:            a.website ?? null,
    benefitTitle:       a.benefitTitle,
    benefitDescription: a.benefitDescription ?? null,
    isActive:           a.isActive ?? true,
    discountCode:       a.discountCode?.trim().toUpperCase() || null,
    discountPercentage: a.discountPercentage ?? null,
    discountExpiresAt:  a.discountExpiresAt ?? null,
  };
}

@Injectable({ providedIn: 'root' })
export class AllyService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/admin/allies`;

  private readonly _allies  = signal<Ally[]>([]);
  private readonly _loading = signal(false);

  readonly allies  = this._allies.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly total   = computed(() => this._allies().length);

  constructor() { this.loadAll(); }

  async loadAll(): Promise<void> {
    this._loading.set(true);
    try {
      const res = await firstValueFrom(this.http.get<unknown[]>(this.base));
      this._allies.set(res.map(mapApi));
    } finally {
      this._loading.set(false);
    }
  }

  getById(id: string): Ally | undefined {
    return this._allies().find((a) => a.id === id);
  }

  async create(ally: Partial<Ally>): Promise<Ally> {
    const raw = await firstValueFrom(this.http.post<unknown>(this.base, toBody(ally)));
    const created = mapApi(raw);
    this._allies.update((list) => [created, ...list]);
    return created;
  }

  async update(id: string, changes: Partial<Ally>): Promise<Ally> {
    const raw = await firstValueFrom(this.http.put<unknown>(`${this.base}/${id}`, toBody(changes)));
    const updated = mapApi(raw);
    this._allies.update((list) => list.map((a) => a.id === id ? updated : a));
    return updated;
  }

  async delete(id: string): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.base}/${id}`));
    this._allies.update((list) => list.filter((a) => a.id !== id));
  }

  /** Sube/reemplaza el logo del aliado. */
  async uploadLogo(id: string, file: File): Promise<Ally> {
    const fd = new FormData();
    fd.append('file', file, file.name);
    const raw = await firstValueFrom(this.http.post<unknown>(`${this.base}/${id}/logo`, fd));
    const updated = mapApi(raw);
    this._allies.update((list) => list.map((a) => a.id === id ? updated : a));
    return updated;
  }
}
