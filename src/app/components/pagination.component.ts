import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav aria-label="Paginación de resultados" class="flex items-center justify-between py-3 gap-4">
      <span class="text-sm text-gray-500">{{ totalElements() }} resultado(s)</span>
      <div class="flex gap-1">
        <button
          type="button"
          [disabled]="!hasPrevious()"
          (click)="goToPage(currentPage() - 1)"
          aria-label="Página anterior"
          class="min-w-9 h-9 inline-flex items-center justify-center border border-gray-300 rounded-md bg-white text-gray-700 text-sm cursor-pointer transition-all hover:bg-gray-100 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
        >
          &laquo;
        </button>
        @for (page of pages(); track page) {
          <button
            type="button"
            [class.bg-indigo-600]="page === currentPage()"
            [class.text-white]="page === currentPage()"
            [class.border-indigo-600]="page === currentPage()"
            [attr.aria-current]="page === currentPage() ? 'page' : null"
            (click)="goToPage(page)"
            [attr.aria-label]="'Ir a página ' + page"
            class="min-w-9 h-9 inline-flex items-center justify-center border border-gray-300 rounded-md bg-white text-gray-700 text-sm cursor-pointer transition-all hover:bg-gray-100 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
          >
            {{ page }}
          </button>
        }
        <button
          type="button"
          [disabled]="!hasNext()"
          (click)="goToPage(currentPage() + 1)"
          aria-label="Página siguiente"
          class="min-w-9 h-9 inline-flex items-center justify-center border border-gray-300 rounded-md bg-white text-gray-700 text-sm cursor-pointer transition-all hover:bg-gray-100 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
        >
          &raquo;
        </button>
      </div>
    </nav>
  `,
})
export class Pagination {
  readonly currentPage = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly totalElements = input(0);

  readonly pageChange = output<number>();

  protected readonly pages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  });

  protected readonly hasPrevious = computed(() => this.currentPage() > 1);
  protected readonly hasNext = computed(() => this.currentPage() < this.totalPages());

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages() && page !== this.currentPage()) {
      this.pageChange.emit(page);
    }
  }
}
