import { Component, input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  template: `
    <span
      class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize"
      [class]="statusClasses()">
      {{ status() }}
    </span>
  `,
})
export class StatusBadgeComponent {
  readonly status = input.required<string>();

  protected statusClasses() {
    switch (this.status().toLowerCase()) {
      case 'active':
        return 'bg-emerald-100 text-emerald-700';
      case 'inactive':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }
}
