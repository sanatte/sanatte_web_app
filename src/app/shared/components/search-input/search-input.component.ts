import { Component, input, output, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-input',
  imports: [FormsModule],
  template: `
    <div class="relative">
      <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2
                   text-outline text-[18px]">search</span>
      <input type="text"
             [placeholder]="placeholder()"
             [(ngModel)]="value"
             (ngModelChange)="search.emit($event)"
             class="w-full pl-9 pr-4 py-2.5 bg-white border border-outline-variant/40
                    rounded-full text-label-md font-heading text-on-surface
                    placeholder:text-outline focus:outline-none focus:ring-2
                    focus:ring-primary/50 transition-all"/>
    </div>
  `,
})
export class SearchInputComponent {
  readonly placeholder = input('Search...');
  readonly search = output<string>();

  protected value = '';
}
