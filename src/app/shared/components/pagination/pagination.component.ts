import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'app-pagination',
  template: `
    <div class="flex items-center justify-between px-2 py-3">
      <p class="text-sm text-gray-500">
        Showing <span class="font-medium text-gray-700">{{ startItem() }}</span>
        to <span class="font-medium text-gray-700">{{ endItem() }}</span>
        of <span class="font-medium text-gray-700">{{ total() }}</span> results
      </p>

      <nav class="flex items-center gap-1">
        <!-- Previous -->
        <button
          (click)="goToPage(currentPage() - 1)"
          [disabled]="currentPage() === 1"
          class="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100
                 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Page numbers -->
        @for (page of visiblePages(); track page) {
          @if (page === -1) {
            <span class="px-2 text-gray-400">...</span>
          } @else {
            <button
              (click)="goToPage(page)"
              class="min-w-[36px] h-9 rounded-lg text-sm font-medium transition-colors"
              [class]="page === currentPage()
                ? 'bg-primary text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'">
              {{ page }}
            </button>
          }
        }

        <!-- Next -->
        <button
          (click)="goToPage(currentPage() + 1)"
          [disabled]="currentPage() === totalPages()"
          class="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100
                 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </nav>
    </div>
  `,
})
export class PaginationComponent {
  readonly currentPage = input.required<number>();
  readonly pageSize = input.required<number>();
  readonly total = input.required<number>();
  readonly pageChange = output<number>();

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.total() / this.pageSize()))
  );

  readonly startItem = computed(() =>
    this.total() === 0 ? 0 : (this.currentPage() - 1) * this.pageSize() + 1
  );

  readonly endItem = computed(() =>
    Math.min(this.currentPage() * this.pageSize(), this.total())
  );

  readonly visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();

    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: number[] = [1];

    if (current > 3) pages.push(-1); // ellipsis

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (current < total - 2) pages.push(-1); // ellipsis

    pages.push(total);
    return pages;
  });

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.pageChange.emit(page);
    }
  }
}
