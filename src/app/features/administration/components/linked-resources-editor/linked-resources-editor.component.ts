import { Component, input, output, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Resource, RESOURCE_TYPE_META } from '../../models/resource.model';
import { TEXTS } from '../../../../core/i18n/texts';

@Component({
  selector: 'app-linked-resources-editor',
  imports: [RouterLink],
  templateUrl: './linked-resources-editor.component.html',
})
export class LinkedResourcesEditorComponent {
  protected readonly t = TEXTS.admin.linkedResourcesEditor;
  protected readonly c = TEXTS.common;

  /** Recursos ya vinculados en su orden actual. */
  readonly resources = input.required<Resource[]>();
  /** Recursos disponibles para agregar (ya filtrados — sin los vinculados). */
  readonly available = input<Resource[]>([]);
  /** Emite el array ordenado de IDs cuando el orden o la lista cambia. */
  readonly orderChange = output<string[]>();

  readonly isPickerOpen = signal(false);

  // ── Drag state ──────────────────────────────────────────────────────────────
  private dragIndex: number | null = null;

  readonly localOrder = computed(() => [...this.resources()]);

  onDragStart(index: number): void {
    this.dragIndex = index;
  }

  onDragOver(event: DragEvent, index: number): void {
    event.preventDefault();
    if (this.dragIndex === null || this.dragIndex === index) return;

    const list = [...this.resources()];
    const [moved] = list.splice(this.dragIndex, 1);
    list.splice(index, 0, moved);
    this.dragIndex = index;
    this.orderChange.emit(list.map(r => r.id));
  }

  onDragEnd(): void {
    this.dragIndex = null;
  }

  // ── Up / Down buttons ───────────────────────────────────────────────────────
  moveUp(index: number): void {
    if (index === 0) return;
    const list = [...this.resources()];
    [list[index - 1], list[index]] = [list[index], list[index - 1]];
    this.orderChange.emit(list.map(r => r.id));
  }

  moveDown(index: number): void {
    const list = this.resources();
    if (index === list.length - 1) return;
    const copy = [...list];
    [copy[index], copy[index + 1]] = [copy[index + 1], copy[index]];
    this.orderChange.emit(copy.map(r => r.id));
  }

  // ── Add / Remove ────────────────────────────────────────────────────────────
  add(resource: Resource): void {
    const list = [...this.resources(), resource];
    this.isPickerOpen.set(false);
    this.orderChange.emit(list.map(r => r.id));
  }

  remove(resourceId: string): void {
    const list = this.resources().filter(r => r.id !== resourceId);
    this.orderChange.emit(list.map(r => r.id));
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────
  resourceIcon(type: string): string {
    return RESOURCE_TYPE_META[type as keyof typeof RESOURCE_TYPE_META]?.icon ?? 'attach_file';
  }

  resourceTypeLabel(type: string): string {
    return RESOURCE_TYPE_META[type as keyof typeof RESOURCE_TYPE_META]?.label ?? type;
  }
}
