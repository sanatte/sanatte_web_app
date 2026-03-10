import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    @if (open()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/40 backdrop-blur-sm"
          (click)="cancel.emit()">
        </div>

        <!-- Dialog -->
        <div class="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4
                    animate-in fade-in zoom-in duration-200">
          <h3 class="text-lg font-semibold text-gray-900">{{ title() }}</h3>
          <p class="mt-2 text-sm text-gray-500">{{ message() }}</p>

          <div class="mt-6 flex justify-end gap-3">
            <button
              (click)="cancel.emit()"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100
                     rounded-xl hover:bg-gray-200 transition-colors">
              Cancel
            </button>
            <button
              (click)="confirm.emit()"
              class="px-4 py-2 text-sm font-medium text-white rounded-xl transition-colors"
              [class]="variant() === 'danger'
                ? 'bg-danger hover:bg-danger-dark'
                : 'bg-primary hover:bg-primary-dark'">
              {{ confirmText() }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ConfirmDialogComponent {
  readonly open = input(false);
  readonly title = input('Confirm Action');
  readonly message = input('Are you sure you want to proceed?');
  readonly confirmText = input('Confirm');
  readonly variant = input<'primary' | 'danger'>('primary');

  readonly confirm = output<void>();
  readonly cancel = output<void>();
}
