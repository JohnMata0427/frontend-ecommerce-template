import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        role="dialog"
        aria-modal="true"
        [attr.aria-labelledby]="'dialog-title'"
        data-backdrop
        (click)="onBackdropClick($event)"
        (keydown)="onKeydown($event)"
      >
        <div class="bg-white rounded-xl p-6 max-w-md w-full shadow-xl text-center">
          <div
            class="flex items-center justify-center size-12 rounded-full bg-red-50 text-red-500 mx-auto mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>
          <h2 id="dialog-title" class="text-lg font-semibold text-gray-900 mb-2">{{ title() }}</h2>
          <p class="text-sm text-gray-500 mb-6 leading-relaxed">{{ message() }}</p>
          <div class="flex gap-3 justify-center">
            <button
              type="button"
              class="px-5 py-2 rounded-lg text-sm font-medium cursor-pointer border border-gray-300 bg-white text-gray-700 transition-all hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
              (click)="onCancel()"
            >
              {{ cancelLabel() }}
            </button>
            <button
              type="button"
              class="px-5 py-2 rounded-lg text-sm font-medium cursor-pointer border border-transparent bg-red-500 text-white transition-all hover:bg-red-600 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
              (click)="onConfirm()"
            >
              {{ confirmLabel() }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ConfirmDialog {
  readonly open = input(false);
  readonly title = input('Confirmar acción');
  readonly message = input('¿Estás seguro de que deseas continuar?');
  readonly confirmLabel = input('Eliminar');
  readonly cancelLabel = input('Cancelar');

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).hasAttribute('data-backdrop')) {
      this.onCancel();
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.onCancel();
    }
  }
}
