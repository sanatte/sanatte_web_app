import { Injectable, signal, computed } from '@angular/core';
import { Resource } from '../models/resource.model';
import { MOCK_RESOURCES } from '../mocks/resources.mock';

@Injectable({ providedIn: 'root' })
export class ResourceService {
  private readonly _resources = signal<Resource[]>(MOCK_RESOURCES);

  readonly resources = this._resources.asReadonly();
  readonly total     = computed(() => this._resources().length);

  getById(id: string): Resource | undefined {
    return this._resources().find((r) => r.id === id);
  }

  create(resource: Omit<Resource, 'id' | 'createdAt'>): void {
    this._resources.update((list) => [
      { ...resource, id: `res-${Date.now()}`, createdAt: new Date().toISOString().split('T')[0] },
      ...list,
    ]);
  }

  update(id: string, changes: Partial<Resource>): void {
    this._resources.update((list) =>
      list.map((r) => (r.id === id ? { ...r, ...changes } : r))
    );
  }

  delete(id: string): void {
    this._resources.update((list) => list.filter((r) => r.id !== id));
  }
}
