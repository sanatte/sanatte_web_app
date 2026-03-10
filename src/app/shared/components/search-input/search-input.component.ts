import { Component, input, output, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-input',
  imports: [FormsModule],
  template: `
    <div class="relative">
      <svg
        class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        [placeholder]="placeholder()"
        [(ngModel)]="value"
        (ngModelChange)="search.emit($event)"
        class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl
               text-sm text-gray-700 placeholder-gray-400
               focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
               transition-all duration-200"
      />
    </div>
  `,
})
export class SearchInputComponent {
  readonly placeholder = input('Search...');
  readonly search = output<string>();

  protected value = '';
}
