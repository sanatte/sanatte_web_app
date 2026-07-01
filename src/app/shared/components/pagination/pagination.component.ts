import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'app-pagination',
  template: `
    <div class="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 py-3">

      <!-- Contador -->
      <p class="text-label-sm font-heading text-on-surface-variant">
        Mostrando
        <span class="font-bold text-on-surface">{{ startItem() }}–{{ endItem() }}</span>
        de <span class="font-bold text-on-surface">{{ total() }}</span>
        {{ label() }}
      </p>

      <!-- Páginas -->
      <nav class="flex items-center gap-1">
        <button (click)="goToPage(currentPage() - 1)"
                [disabled]="currentPage() === 1"
                class="w-9 h-9 flex items-center justify-center rounded-lg border
                       border-outline-variant text-on-surface-variant hover:border-primary
                       hover:text-primary transition-colors
                       disabled:opacity-40 disabled:cursor-not-allowed">
          <span class="material-symbols-outlined text-[18px]">chevron_left</span>
        </button>

        @for (page of visiblePages(); track page) {
          @if (page === -1) {
            <span class="w-9 h-9 flex items-center justify-center text-outline
                         text-label-sm font-heading">…</span>
          } @else {
            <button (click)="goToPage(page)"
                    class="w-9 h-9 flex items-center justify-center rounded-lg text-label-md
                           font-heading font-bold transition-colors"
                    [class]="page === currentPage()
                      ? 'gradient-primary text-white'
                      : 'border border-outline-variant text-on-surface-variant hover:border-primary'">
              {{ page }}
            </button>
          }
        }

        <button (click)="goToPage(currentPage() + 1)"
                [disabled]="currentPage() === totalPages()"
                class="w-9 h-9 flex items-center justify-center rounded-lg border
                       border-outline-variant text-on-surface-variant hover:border-primary
                       hover:text-primary transition-colors
                       disabled:opacity-40 disabled:cursor-not-allowed">
          <span class="material-symbols-outlined text-[18px]">chevron_right</span>
        </button>
      </nav>
    </div>
  `,
})
export class PaginationComponent {
  readonly currentPage = input.required<number>();
  readonly pageSize    = input.required<number>();
  readonly total       = input.required<number>();
  readonly label       = input('resultados');
  readonly pageChange  = output<number>();

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
