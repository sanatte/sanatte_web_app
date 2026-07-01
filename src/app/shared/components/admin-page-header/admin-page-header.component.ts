import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-admin-page-header',
  template: `
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6">
      <div>
        <h3 class="font-heading text-headline-lg text-on-surface">{{ title() }}</h3>
        @if (description()) {
          <p class="text-label-md font-heading text-on-surface-variant mt-1">
            {{ description() }}
          </p>
        }
      </div>
      @if (actionLabel()) {
        <button (click)="action.emit()"
                class="self-start sm:self-auto flex items-center gap-2 gradient-primary text-white
                       px-5 py-2.5 rounded-full text-label-md font-heading font-bold
                       hover:opacity-90 active:scale-95 transition-all whitespace-nowrap"
                style="box-shadow: 0 4px 14px 0 rgba(107,56,212,0.39)">
          <span class="material-symbols-outlined text-[18px]">{{ actionIcon() }}</span>
          {{ actionLabel() }}
        </button>
      }
    </div>
  `,
})
export class AdminPageHeaderComponent {
  readonly title       = input.required<string>();
  readonly description = input('');
  readonly actionLabel = input('');
  readonly actionIcon  = input('add');
  readonly action      = output<void>();
}
