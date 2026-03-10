import { Component, input } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `
    <header class="flex items-center justify-between h-16 px-8">
      <h1 class="text-2xl font-bold text-gray-900">{{ title() }}</h1>

      <div class="flex items-center gap-3">
        <!-- Notifications -->
        <button class="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67
              6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>

        <!-- Dark mode toggle (placeholder) -->
        <button class="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003
              9.003 0 008.354-5.646z" />
          </svg>
        </button>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  readonly title = input('Dashboard');
}
