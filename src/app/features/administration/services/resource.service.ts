import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Resource, ResourceType, ResourceStatus } from '../models/resource.model';
import { environment } from '../../../../environments/environment';

// ─── Normalización de enums C# (int) ↔ strings del front ────────────────────
const TYPE_MAP: Record<number, ResourceType>     = { 0: 'audio', 1: 'video', 2: 'pdf', 3: 'article' };
const STATUS_MAP: Record<number, ResourceStatus> = { 0: 'draft', 1: 'published' };
const TYPE_TO_INT: Record<ResourceType, number>     = { audio: 0, video: 1, pdf: 2, article: 3 };
const STATUS_TO_INT: Record<ResourceStatus, number> = { draft: 0, published: 1 };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapApiResource(raw: any): Resource {
  return {
    id:                raw.id,
    title:             raw.title,
    slug:              raw.slug ?? '',
    description:       raw.description,
    type:              TYPE_MAP[raw.type] ?? 'article',
    status:            STATUS_MAP[raw.status] ?? 'draft',
    tags:              raw.tags ?? [],
    duration:          raw.duration ?? undefined,
    fileSize:          raw.fileSize ?? undefined,
    readTime:          raw.readTime ?? undefined,
    thumbnailGradient: raw.thumbnailGradient ?? 'from-violet-400 to-purple-600',
    createdAt:         raw.createdAt?.split('T')[0] ?? '',
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toApiBody(r: Partial<Resource>): any {
  return {
    title: r.title,
    description: r.description,
    type: r.type ? TYPE_TO_INT[r.type] : 0,
    status: r.status ? STATUS_TO_INT[r.status] : 0,
    tags: r.tags ?? [],
    duration: r.duration ?? null,
    fileSize: r.fileSize ?? null,
    readTime: r.readTime ?? null,
    thumbnailGradient: r.thumbnailGradient ?? null,
  };
}

@Injectable({ providedIn: 'root' })
export class ResourceService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/admin/resources`;

  private readonly _resources = signal<Resource[]>([]);
  private readonly _loading   = signal(false);

  readonly resources = this._resources.asReadonly();
  readonly loading   = this._loading.asReadonly();
  readonly total     = computed(() => this._resources().length);

  constructor() { this.loadAll(); }

  async loadAll(): Promise<void> {
    this._loading.set(true);
    try {
      const res = await firstValueFrom(this.http.get<unknown[]>(this.base));
      this._resources.set(res.map(mapApiResource));
    } finally {
      this._loading.set(false);
    }
  }

  getById(id: string): Resource | undefined {
    return this._resources().find((r) => r.id === id);
  }

  async create(resource: Omit<Resource, 'id' | 'createdAt'>): Promise<void> {
    const raw = await firstValueFrom(this.http.post<unknown>(this.base, toApiBody(resource)));
    this._resources.update((list) => [mapApiResource(raw), ...list]);
  }

  async update(id: string, changes: Partial<Resource>): Promise<void> {
    // El PUT reemplaza el recurso completo → combinamos con el estado actual
    const current = this.getById(id);
    const merged = { ...current, ...changes } as Resource;
    const raw = await firstValueFrom(this.http.put<unknown>(`${this.base}/${id}`, toApiBody(merged)));
    const updated = mapApiResource(raw);
    this._resources.update((list) => list.map((r) => r.id === id ? updated : r));
  }

  async delete(id: string): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.base}/${id}`));
    this._resources.update((list) => list.filter((r) => r.id !== id));
  }
}
