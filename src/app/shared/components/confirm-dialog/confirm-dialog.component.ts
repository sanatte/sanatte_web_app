import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    @if (open()) {
      <!-- Backdrop -->
      <div class="fixed inset-0 z-[60] bg-on-background/40 backdrop-blur-sm
                  flex items-center justify-center p-4"
           (click)="cancel.emit()">

        <!-- Card -->
        <div class="bg-white rounded-lg w-full max-w-md mx-4 shadow-2xl"
             style="box-shadow: 0px 20px 50px rgba(76,29,149,0.12)"
             (click)="$event.stopPropagation()">

          <!-- Icon + Header -->
          <div class="px-8 pt-8 pb-6">
            <div class="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                 [class]="iconBgClass()">
              <span class="material-symbols-outlined text-[24px]" [class]="iconColorClass()">
                {{ icon() }}
              </span>
            </div>
            <h3 class="font-heading text-headline-md font-bold text-on-surface">
              {{ title() }}
            </h3>
            <p class="text-label-md font-heading text-on-surface-variant mt-2 leading-relaxed">
              {{ message() }}
            </p>
          </div>

          <!-- Actions -->
          <div class="px-8 pb-8 flex justify-end gap-3">
            <button (click)="cancel.emit()"
                    class="px-6 py-2.5 rounded-full text-label-md font-heading font-bold
                           text-on-surface-variant hover:bg-surface-container-low
                           transition-colors">
              {{ cancelText() }}
            </button>
            <button (click)="confirm.emit()"
                    class="px-6 py-2.5 rounded-full text-label-md font-heading font-bold
                           text-white transition-all active:scale-95"
                    [class]="confirmBtnClass()">
              {{ confirmText() }}
            </button>
          </div>

        </div>
      </div>
    }
  `,
})
export class ConfirmDialogComponent {
  readonly open        = input(false);
  readonly title       = input('¿Confirmar acción?');
  readonly message     = input('¿Estás seguro de que deseas continuar?');
  readonly confirmText = input('Confirmar');
  readonly cancelText  = input('Cancelar');
  readonly variant     = input<'danger' | 'primary'>('danger');

  readonly confirm = output<void>();
  readonly cancel  = output<void>();

  readonly icon = computed(() =>
    this.variant() === 'danger' ? 'delete_forever' : 'check_circle'
  );
  readonly iconBgClass = computed(() =>
    this.variant() === 'danger' ? 'bg-error-container' : 'bg-primary-fixed'
  );
  readonly iconColorClass = computed(() =>
    this.variant() === 'danger' ? 'text-error' : 'text-primary'
  );
  readonly confirmBtnClass = computed(() =>
    this.variant() === 'danger'
      ? 'bg-error hover:bg-red-700'
      : 'gradient-primary hover:opacity-90'
  );
}
