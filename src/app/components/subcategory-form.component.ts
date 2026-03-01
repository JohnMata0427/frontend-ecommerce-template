import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { form, FormField, maxLength, required } from '@angular/forms/signals';
import { Category } from '../models/category.model';
import { CategoryService } from '../services/category.service';
import { NotificationService } from '../services/notification.service';
import { SubcategoryService } from '../services/subcategory.service';

interface SubcategoryFormData {
  name: string;
  description: string;
  categoryId: string;
  active: boolean;
}

@Component({
  selector: 'app-subcategory-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField],
  styles: `
    dialog::backdrop {
      background-color: rgb(0 0 0 / 0.5);
    }
  `,
  template: `
    <dialog
      #dialog
      class="w-full max-w-lg rounded-xl p-0 border-none bg-white shadow-xl"
      (cancel)="onDialogCancel($event)"
    >
      <div class="px-6 pt-5 pb-4 flex items-center justify-between border-b border-gray-100">
        <h2 class="text-xl font-bold text-gray-900 m-0">
          {{ isEditMode() ? 'Editar' : 'Nueva' }} subcategoría
        </h2>
        <button
          type="button"
          class="inline-flex items-center justify-center size-8 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer border-none bg-transparent focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
          aria-label="Cerrar diálogo"
          (click)="onCancel()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="size-5"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form class="flex flex-col gap-5 px-6 py-5" (submit)="onSubmit($event)">
        <!-- Nombre -->
        <div class="flex flex-col gap-1.5">
          <label for="subcat-name" class="text-sm font-medium text-gray-700">
            Nombre <span class="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="subcat-name"
            type="text"
            [formField]="subcategoryForm.name"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 font-[inherit] transition-colors focus:outline-none focus:border-indigo-600 focus:ring-3 focus:ring-indigo-600/10 aria-invalid:border-red-500 aria-invalid:ring-red-500/10"
            [attr.aria-invalid]="
              !subcategoryForm.name().valid() && subcategoryForm.name().touched()
            "
            aria-describedby="subcat-name-error"
          />
          @if (!subcategoryForm.name().valid() && subcategoryForm.name().touched()) {
            @for (error of subcategoryForm.name().errors(); track error.kind) {
              <span id="subcat-name-error" class="text-[0.8125rem] text-red-500" role="alert">{{
                error.message
              }}</span>
            }
          }
        </div>

        <!-- Categoría -->
        <div class="flex flex-col gap-1.5">
          <label for="subcat-categoryId" class="text-sm font-medium text-gray-700">
            Categoría <span class="text-red-500" aria-hidden="true">*</span>
          </label>
          <select
            id="subcat-categoryId"
            [formField]="subcategoryForm.categoryId"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 font-[inherit] transition-colors focus:outline-none focus:border-indigo-600 focus:ring-3 focus:ring-indigo-600/10 aria-invalid:border-red-500 aria-invalid:ring-red-500/10"
            [attr.aria-invalid]="
              !subcategoryForm.categoryId().valid() && subcategoryForm.categoryId().touched()
            "
            aria-describedby="subcat-categoryId-error"
          >
            <option value="" disabled>Selecciona una categoría</option>
            @for (cat of categories(); track cat.id) {
              <option [value]="cat.id">{{ cat.name }}</option>
            }
          </select>
          @if (!subcategoryForm.categoryId().valid() && subcategoryForm.categoryId().touched()) {
            @for (error of subcategoryForm.categoryId().errors(); track error.kind) {
              <span
                id="subcat-categoryId-error"
                class="text-[0.8125rem] text-red-500"
                role="alert"
                >{{ error.message }}</span
              >
            }
          }
        </div>

        <!-- Descripción -->
        <div class="flex flex-col gap-1.5">
          <label for="subcat-description" class="text-sm font-medium text-gray-700"
            >Descripción</label
          >
          <textarea
            id="subcat-description"
            [formField]="subcategoryForm.description"
            rows="3"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 font-[inherit] transition-colors resize-y focus:outline-none focus:border-indigo-600 focus:ring-3 focus:ring-indigo-600/10"
          ></textarea>
        </div>

        <!-- Activa toggle -->
        <div class="flex items-center gap-2.5 pt-1">
          <input
            id="subcat-active"
            type="checkbox"
            [formField]="subcategoryForm.active"
            class="size-4 accent-indigo-600 cursor-pointer"
          />
          <label for="subcat-active" class="text-sm text-gray-700 cursor-pointer select-none"
            >Subcategoría activa</label
          >
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 pt-2 border-t border-gray-100">
          <button
            type="button"
            class="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-medium cursor-pointer transition-colors hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
            (click)="onCancel()"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-indigo-600 text-white border-none rounded-lg text-sm font-medium cursor-pointer transition-colors hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
            [disabled]="
              !subcategoryForm.name().valid() || !subcategoryForm.categoryId().valid() || saving()
            "
          >
            {{ saving() ? 'Guardando...' : isEditMode() ? 'Actualizar' : 'Crear' }}
          </button>
        </div>
      </form>
    </dialog>
  `,
})
export class SubcategoryForm {
  private readonly subcategoryService = inject(SubcategoryService);
  private readonly categoryService = inject(CategoryService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialogRef = viewChild<ElementRef<HTMLDialogElement>>('dialog');

  readonly open = input(false);
  readonly subcategoryId = input<string | null>(null);
  readonly saved = output<void>();
  readonly cancelled = output<void>();

  protected readonly saving = signal(false);
  protected readonly isEditMode = signal(false);
  protected readonly categories = signal<Category[]>([]);

  protected readonly formModel = signal<SubcategoryFormData>({
    name: '',
    description: '',
    categoryId: '',
    active: true,
  });

  protected readonly subcategoryForm = form(this.formModel, (schema) => {
    required(schema.name, { message: 'El nombre es obligatorio.' });
    maxLength(schema.name, 150, { message: 'Máximo 150 caracteres.' });
    required(schema.categoryId, { message: 'La categoría es obligatoria.' });
  });

  constructor() {
    effect(() => {
      const isOpen = this.open();
      const dialog = this.dialogRef()?.nativeElement;
      if (!dialog) return;

      if (isOpen && !dialog.open) {
        const id = this.subcategoryId();
        this.isEditMode.set(!!id);
        this.saving.set(false);
        this.loadCategories();
        if (id) {
          this.loadSubcategory(id);
        } else {
          this.formModel.set({ name: '', description: '', categoryId: '', active: true });
        }
        dialog.showModal();
      } else if (!isOpen && dialog.open) {
        dialog.close();
      }
    });
  }

  private loadCategories(): void {
    this.categoryService.getActive(1, 100).subscribe({
      next: (response) => this.categories.set(response.content),
      error: () => this.notificationService.error('Error al cargar las categorías'),
    });
  }

  private loadSubcategory(id: string): void {
    this.subcategoryService.getById(id).subscribe({
      next: (subcategory) => {
        this.formModel.set({
          name: subcategory.name,
          description: subcategory.description ?? '',
          categoryId: subcategory.categoryId,
          active: subcategory.active,
        });
      },
      error: () => {
        this.notificationService.error('Error al cargar la subcategoría');
        this.cancelled.emit();
      },
    });
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (
      this.saving() ||
      !this.subcategoryForm.name().valid() ||
      !this.subcategoryForm.categoryId().valid()
    )
      return;

    this.saving.set(true);
    const model = this.formModel();
    const request = {
      name: model.name,
      description: model.description || undefined,
      categoryId: model.categoryId,
      active: model.active,
    };

    const id = this.subcategoryId();
    const operation$ = id
      ? this.subcategoryService.update(id, request)
      : this.subcategoryService.create(request);

    operation$.subscribe({
      next: () => {
        this.notificationService.success(
          id ? 'Subcategoría actualizada correctamente' : 'Subcategoría creada correctamente',
        );
        this.saving.set(false);
        this.saved.emit();
      },
      error: (err) => {
        const message = err.error?.validationErrors
          ? Object.values(err.error.validationErrors).join(', ')
          : (err.error?.message ?? 'Error al guardar la subcategoría');
        this.notificationService.error(message);
        this.saving.set(false);
      },
    });
  }

  protected onCancel(): void {
    this.cancelled.emit();
  }

  protected onDialogCancel(event: Event): void {
    event.preventDefault();
    this.onCancel();
  }
}
