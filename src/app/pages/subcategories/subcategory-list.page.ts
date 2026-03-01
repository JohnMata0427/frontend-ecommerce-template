import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmDialog } from '../../components/confirm-dialog.component';
import { Pagination } from '../../components/pagination.component';
import { SubcategoryForm } from '../../components/subcategory-form.component';
import { Subcategory } from '../../models/subcategory.model';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { SubcategoryService } from '../../services/subcategory.service';

@Component({
  selector: 'app-subcategory-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, Pagination, ConfirmDialog, DatePipe, SubcategoryForm],
  template: `
    <div class="max-w-7xl">
      <header class="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h1 class="text-2xl font-bold text-gray-900 m-0">Subcategorías</h1>
        @if (authService.isAuthenticated()) {
          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white border-none rounded-lg text-sm font-medium cursor-pointer transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
            (click)="openNewDialog()"
          >
            + Nueva subcategoría
          </button>
        }
      </header>

      <!-- Search -->
      <div class="flex gap-2 mb-4 items-center flex-wrap">
        <label for="search-subcategories" class="sr-only">Buscar subcategorías</label>
        <input
          id="search-subcategories"
          type="search"
          class="flex-1 min-w-56 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-600 focus:ring-3 focus:ring-indigo-600/10"
          placeholder="Buscar por nombre..."
          [ngModel]="searchTerm()"
          (ngModelChange)="searchTerm.set($event)"
          (keyup.enter)="onSearch()"
        />
        <button
          type="button"
          class="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm cursor-pointer hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
          (click)="onSearch()"
        >
          Buscar
        </button>
        @if (searchTerm()) {
          <button
            type="button"
            class="px-3 py-2 bg-transparent border-none text-gray-500 text-sm cursor-pointer hover:text-gray-700 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2 focus-visible:rounded"
            (click)="onClearSearch()"
          >
            Limpiar
          </button>
        }
      </div>

      <!-- Table -->
      @if (loading()) {
        <div class="text-center p-12 text-gray-500 text-sm" role="status">
          <span>Cargando subcategorías...</span>
        </div>
      } @else if (subcategories().length === 0) {
        <div class="text-center p-12 bg-white rounded-xl shadow-sm text-gray-500">
          <p>No se encontraron subcategorías.</p>
        </div>
      } @else {
        <div class="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table class="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th
                  class="text-left px-4 py-3 font-semibold text-gray-500 bg-gray-50 border-b border-gray-200 whitespace-nowrap"
                  scope="col"
                >
                  Nombre
                </th>
                <th
                  class="text-left px-4 py-3 font-semibold text-gray-500 bg-gray-50 border-b border-gray-200 whitespace-nowrap"
                  scope="col"
                >
                  Categoría
                </th>
                <th
                  class="text-left px-4 py-3 font-semibold text-gray-500 bg-gray-50 border-b border-gray-200 whitespace-nowrap"
                  scope="col"
                >
                  Descripción
                </th>
                <th
                  class="text-left px-4 py-3 font-semibold text-gray-500 bg-gray-50 border-b border-gray-200 whitespace-nowrap"
                  scope="col"
                >
                  Productos
                </th>
                <th
                  class="text-left px-4 py-3 font-semibold text-gray-500 bg-gray-50 border-b border-gray-200 whitespace-nowrap"
                  scope="col"
                >
                  Estado
                </th>
                <th
                  class="text-left px-4 py-3 font-semibold text-gray-500 bg-gray-50 border-b border-gray-200 whitespace-nowrap"
                  scope="col"
                >
                  Creada
                </th>
                <th
                  class="text-left px-4 py-3 font-semibold text-gray-500 bg-gray-50 border-b border-gray-200 whitespace-nowrap"
                  scope="col"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              @for (sub of subcategories(); track sub.id) {
                <tr class="hover:bg-gray-50">
                  <td class="px-4 py-3 border-b border-gray-100 font-medium text-gray-900">
                    {{ sub.name }}
                  </td>
                  <td class="px-4 py-3 border-b border-gray-100">
                    <span
                      class="inline-flex px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-xs font-medium"
                      >{{ sub.categoryName }}</span
                    >
                  </td>
                  <td
                    class="px-4 py-3 border-b border-gray-100 max-w-56 overflow-hidden text-ellipsis whitespace-nowrap text-gray-500"
                  >
                    {{ sub.description ?? '—' }}
                  </td>
                  <td class="px-4 py-3 border-b border-gray-100 text-center font-semibold">
                    {{ sub.productCount }}
                  </td>
                  <td class="px-4 py-3 border-b border-gray-100">
                    <span
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                      [class.bg-emerald-50]="sub.active"
                      [class.text-emerald-800]="sub.active"
                      [class.bg-gray-100]="!sub.active"
                      [class.text-gray-500]="!sub.active"
                    >
                      {{ sub.active ? 'Activa' : 'Inactiva' }}
                    </span>
                  </td>
                  <td
                    class="px-4 py-3 border-b border-gray-100 whitespace-nowrap text-gray-500 text-[0.8125rem]"
                  >
                    {{ sub.createdAt | date: 'dd/MM/yyyy' }}
                  </td>
                  <td class="px-4 py-3 border-b border-gray-100">
                    <div class="flex gap-1.5 items-center">
                      @if (authService.isAuthenticated()) {
                        <button
                          type="button"
                          class="inline-flex items-center justify-center size-8 border border-gray-200 rounded-md bg-white text-gray-500 cursor-pointer transition-all hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
                          [attr.aria-label]="'Editar subcategoría ' + sub.name"
                          (click)="openEditDialog(sub)"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="size-4"
                            aria-hidden="true"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          class="inline-flex items-center justify-center size-8 border border-gray-200 rounded-md bg-white text-gray-500 cursor-pointer transition-all hover:text-red-500 hover:border-red-200 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
                          [attr.aria-label]="'Eliminar subcategoría ' + sub.name"
                          (click)="confirmDelete(sub)"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="size-4"
                            aria-hidden="true"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                          </svg>
                        </button>
                      }
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        @if (totalPages() > 1) {
          <app-pagination
            [currentPage]="currentPage()"
            [totalPages]="totalPages()"
            [totalElements]="totalElements()"
            (pageChange)="onPageChange($event)"
          />
        }
      }
    </div>

    <app-subcategory-form
      [open]="showFormDialog()"
      [subcategoryId]="editingSubcategoryId()"
      (saved)="onFormSaved()"
      (cancelled)="onFormCancelled()"
    />

    <app-confirm-dialog
      [open]="showDeleteDialog()"
      title="Eliminar subcategoría"
      [message]="
        '¿Estás seguro de que deseas eliminar la subcategoría «' +
        (subcategoryToDelete()?.name ?? '') +
        '»? Esta acción no se puede deshacer.'
      "
      (confirmed)="onDeleteConfirmed()"
      (cancelled)="onDeleteCancelled()"
    />
  `,
})
export class SubcategoryList {
  private readonly subcategoryService = inject(SubcategoryService);
  private readonly notificationService = inject(NotificationService);
  protected readonly authService = inject(AuthService);

  protected readonly subcategories = signal<Subcategory[]>([]);
  protected readonly loading = signal(false);
  protected readonly currentPage = signal(1);
  protected readonly totalPages = signal(0);
  protected readonly totalElements = signal(0);
  protected readonly searchTerm = signal('');

  protected readonly showDeleteDialog = signal(false);
  protected readonly subcategoryToDelete = signal<Subcategory | null>(null);

  protected readonly showFormDialog = signal(false);
  protected readonly editingSubcategoryId = signal<string | null>(null);

  constructor() {
    this.loadSubcategories();
  }

  loadSubcategories(page = 1): void {
    this.loading.set(true);
    const search = this.searchTerm().trim();
    const request$ = search
      ? this.subcategoryService.search(search, page)
      : this.subcategoryService.getAll(page);

    request$.subscribe({
      next: (response) => {
        this.subcategories.set(response.content);
        this.currentPage.set(response.number);
        this.totalPages.set(response.totalPages);
        this.totalElements.set(response.totalElements);
        this.loading.set(false);
      },
      error: () => {
        this.notificationService.error('Error al cargar las subcategorías');
        this.loading.set(false);
      },
    });
  }

  onSearch(): void {
    this.loadSubcategories(1);
  }

  onClearSearch(): void {
    this.searchTerm.set('');
    this.loadSubcategories(1);
  }

  onPageChange(page: number): void {
    this.loadSubcategories(page);
  }

  confirmDelete(subcategory: Subcategory): void {
    this.subcategoryToDelete.set(subcategory);
    this.showDeleteDialog.set(true);
  }

  onDeleteConfirmed(): void {
    const subcategory = this.subcategoryToDelete();
    if (!subcategory) return;

    this.subcategoryService.delete(subcategory.id).subscribe({
      next: () => {
        this.notificationService.success(`Subcategoría "${subcategory.name}" eliminada`);
        this.showDeleteDialog.set(false);
        this.subcategoryToDelete.set(null);
        this.loadSubcategories(this.currentPage());
      },
      error: () => {
        this.notificationService.error('Error al eliminar la subcategoría');
        this.showDeleteDialog.set(false);
      },
    });
  }

  onDeleteCancelled(): void {
    this.showDeleteDialog.set(false);
    this.subcategoryToDelete.set(null);
  }

  openNewDialog(): void {
    this.editingSubcategoryId.set(null);
    this.showFormDialog.set(true);
  }

  openEditDialog(subcategory: Subcategory): void {
    this.editingSubcategoryId.set(subcategory.id);
    this.showFormDialog.set(true);
  }

  onFormSaved(): void {
    this.showFormDialog.set(false);
    this.loadSubcategories(this.currentPage());
  }

  onFormCancelled(): void {
    this.showFormDialog.set(false);
  }
}
