import { Injectable, signal, computed } from '@angular/core';
import { Resource } from '../models/resource.model';
import { MOCK_RESOURCES } from '../mocks/resources.mock';

@Injectable({ providedIn: 'root' })
export class ResourceService {
  private readonly _resources = signal<Resource[]>(MOCK_RESOURCES);

  readonly resources = this._resources.asReadonly();
  readonly total     = computed(() => this._resources().length);

  create(resource: Omit<Resource, 'id' | 'createdAt' | 'linkedProductIds'>): void {
    const newResource: Resource = {
      ...resource,
      id: `res-${Date.now()}`,
      linkedProductIds: [],
      createdAt: new Date().toISOString().split('T')[0],
    };
    this._resources.update((list) => [newResource, ...list]);
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
