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
import { CategoryService } from '../services/category.service';
import { NotificationService } from '../services/notification.service';

interface CategoryFormData {
  name: string;
  description: string;
  active: boolean;
}

@Component({
  selector: 'app-category-form',
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
      <div class="p-6">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-xl font-bold text-gray-900 m-0">
            {{ isEditMode() ? 'Editar categoría' : 'Nueva categoría' }}
          </h2>
          <button
            type="button"
            class="size-8 inline-flex items-center justify-center rounded-md text-gray-400 hover:text-gray-600 cursor-pointer border-none bg-transparent focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
            aria-label="Cerrar"
            (click)="onCancel()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-5"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form class="flex flex-col gap-5" (submit)="onSubmit($event)" novalidate>
          <!-- Name -->
          <div class="flex flex-col gap-1.5">
            <label for="cat-name" class="text-sm font-medium text-gray-700">
              Nombre <span class="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              id="cat-name"
              type="text"
              [formField]="categoryForm.name"
              class="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 font-[inherit] transition-colors focus:outline-none focus:border-indigo-600 focus:ring-3 focus:ring-indigo-600/10 aria-invalid:border-red-500 aria-invalid:focus:ring-red-500/10"
              [attr.aria-invalid]="!categoryForm.name().valid() && categoryForm.name().touched()"
              aria-describedby="cat-name-error"
            />
            @if (!categoryForm.name().valid() && categoryForm.name().touched()) {
              @for (error of categoryForm.name().errors(); track error.kind) {
                <span id="cat-name-error" class="text-[0.8125rem] text-red-500" role="alert">{{
                  error.message
                }}</span>
              }
            }
          </div>

          <!-- Description -->
          <div class="flex flex-col gap-1.5">
            <label for="cat-description" class="text-sm font-medium text-gray-700"
              >Descripción</label
            >
            <textarea
              id="cat-description"
              [formField]="categoryForm.description"
              class="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 font-[inherit] transition-colors resize-y min-h-20 focus:outline-none focus:border-indigo-600 focus:ring-3 focus:ring-indigo-600/10"
              rows="4"
            ></textarea>
          </div>

          <!-- Active -->
          <div class="flex items-center">
            <label class="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                [formField]="categoryForm.active"
                class="size-4 accent-indigo-600"
              />
              <span class="text-sm text-gray-700 font-medium">Activa</span>
            </label>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 justify-end pt-2 border-t border-gray-100">
            <button
              type="button"
              class="px-5 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
              (click)="onCancel()"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-5 py-2 bg-indigo-600 text-white border-none rounded-lg text-sm font-medium cursor-pointer transition-colors hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
              [disabled]="saving()"
            >
              @if (saving()) {
                Guardando...
              } @else if (isEditMode()) {
                Actualizar
              } @else {
                Crear
              }
            </button>
          </div>
        </form>
      </div>
    </dialog>
  `,
})
export class CategoryForm {
  private readonly categoryService = inject(CategoryService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialogRef = viewChild<ElementRef<HTMLDialogElement>>('dialog');

  readonly open = input(false);
  readonly categoryId = input<string | null>(null);
  readonly saved = output<void>();
  readonly cancelled = output<void>();

  protected readonly saving = signal(false);
  protected readonly isEditMode = signal(false);

  protected readonly formModel = signal<CategoryFormData>({
    name: '',
    description: '',
    active: true,
  });

  protected readonly categoryForm = form(this.formModel, (schema) => {
    required(schema.name, { message: 'El nombre es obligatorio.' });
    maxLength(schema.name, 150, { message: 'Máximo 150 caracteres.' });
  });

  constructor() {
    effect(() => {
      const isOpen = this.open();
      const dialog = this.dialogRef()?.nativeElement;
      if (!dialog) return;

      if (isOpen && !dialog.open) {
        const id = this.categoryId();
        this.isEditMode.set(!!id);
        this.saving.set(false);
        if (id) {
          this.loadCategory(id);
        } else {
          this.formModel.set({ name: '', description: '', active: true });
        }
        dialog.showModal();
      } else if (!isOpen && dialog.open) {
        dialog.close();
      }
    });
  }

  private loadCategory(id: string): void {
    this.categoryService.getById(id).subscribe({
      next: (category) => {
        this.formModel.set({
          name: category.name,
          description: category.description ?? '',
          active: category.active,
        });
      },
      error: () => {
        this.notificationService.error('Error al cargar la categoría');
        this.cancelled.emit();
      },
    });
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (this.saving() || !this.categoryForm.name().valid()) return;

    this.saving.set(true);
    const model = this.formModel();
    const request = {
      name: model.name,
      description: model.description || undefined,
      active: model.active,
    };

    const id = this.categoryId();
    const operation$ = id
      ? this.categoryService.update(id, request)
      : this.categoryService.create(request);

    operation$.subscribe({
      next: () => {
        this.notificationService.success(
          id ? 'Categoría actualizada correctamente' : 'Categoría creada correctamente',
        );
        this.saving.set(false);
        this.saved.emit();
      },
      error: (err) => {
        const message = err.error?.validationErrors
          ? Object.values(err.error.validationErrors).join(', ')
          : (err.error?.message ?? 'Error al guardar la categoría');
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
