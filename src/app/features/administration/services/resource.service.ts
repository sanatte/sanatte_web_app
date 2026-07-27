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
    content:           raw.content ?? null,
    thumbnailUrl:      raw.thumbnailUrl ?? null,
    thumbnailGradient: raw.thumbnailGradient ?? 'from-violet-400 to-purple-600',
    createdAt:         raw.createdAt?.split('T')[0] ?? '',
    mediaContentType:  raw.mediaContentType ?? null,
    mediaSizeBytes:    raw.mediaSizeBytes ?? null,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toApiBody(r: Partial<Resource>): any {
  return {
    title: r.title,
    slug: r.slug?.trim() || null,
    description: r.description,
    type: r.type ? TYPE_TO_INT[r.type] : 0,
    status: r.status ? STATUS_TO_INT[r.status] : 0,
    tags: r.tags ?? [],
    duration: r.duration ?? null,
    fileSize: r.fileSize ?? null,
    readTime: r.readTime ?? null,
    content: r.content ?? null,
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

  async create(resource: Omit<Resource, 'id' | 'createdAt'>): Promise<Resource> {
    const raw = await firstValueFrom(this.http.post<unknown>(this.base, toApiBody(resource)));
    const created = mapApiResource(raw);
    this._resources.update((list) => [created, ...list]);
    return created;
  }

  async update(id: string, changes: Partial<Resource>): Promise<Resource> {
    // El PUT reemplaza el recurso completo → combinamos con el estado actual
    const current = this.getById(id);
    const merged = { ...current, ...changes } as Resource;
    const raw = await firstValueFrom(this.http.put<unknown>(`${this.base}/${id}`, toApiBody(merged)));
    const updated = mapApiResource(raw);
    this._resources.update((list) => list.map((r) => r.id === id ? updated : r));
    return updated;
  }

  async delete(id: string): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.base}/${id}`));
    this._resources.update((list) => list.filter((r) => r.id !== id));
  }

  /** Sube o reemplaza el thumbnail de un recurso existente. */
  async uploadThumbnail(id: string, file: File): Promise<void> {
    const fd = new FormData();
    fd.append('file', file, file.name);
    const raw = await firstValueFrom(
      this.http.post<unknown>(`${this.base}/${id}/thumbnail`, fd)
    );
    const updated = mapApiResource(raw);
    this._resources.update((list) => list.map((r) => r.id === id ? updated : r));
  }

  /**
   * Sube el archivo de media (audio/video/pdf) de un recurso en 3 pasos:
   * 1) pide una URL firmada al backend, 2) sube el archivo DIRECTO a R2 (no pasa
   * por la API → soporta archivos grandes), 3) confirma la metadata.
   */
  async uploadMedia(
    id: string,
    file: File,
    opts?: { duration?: string; onProgress?: (pct: number) => void },
  ): Promise<Resource> {
    // 1) URL firmada de subida (PUT)
    const signed = await firstValueFrom(
      this.http.post<{ uploadUrl: string; storagePath: string; expiresAt: string }>(
        `${this.base}/${id}/media/upload-url`, { contentType: file.type },
      ),
    );

    // 2) PUT directo a R2 vía XHR: progreso real y sin el interceptor de auth
    await this.putToR2(signed.uploadUrl, file, opts?.onProgress);

    // 3) Confirmar: el backend persiste path/tipo/tamaño (y duración si viene)
    const raw = await firstValueFrom(
      this.http.put<unknown>(`${this.base}/${id}/media`, {
        storagePath: signed.storagePath,
        contentType: file.type,
        sizeBytes: file.size,
        duration: opts?.duration ?? null,
      }),
    );
    const updated = mapApiResource(raw);
    this._resources.update((list) => list.map((r) => r.id === id ? updated : r));
    return updated;
  }

  /** PUT a R2 con la URL firmada. El Content-Type DEBE coincidir con el firmado. */
  private putToR2(url: string, file: File, onProgress?: (pct: number) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', url, true);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
      };
      xhr.onload = () =>
        xhr.status >= 200 && xhr.status < 300
          ? resolve()
          : reject(new Error(`Fallo la subida a R2 (HTTP ${xhr.status}).`));
      xhr.onerror = () => reject(new Error('Error de red subiendo a R2.'));
      xhr.send(file);
    });
  }
}
