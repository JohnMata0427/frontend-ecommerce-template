import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CategoryService } from '../../services/category.service';
import { NotificationService } from '../../services/notification.service';
import { SubcategoryService } from '../../services/subcategory.service';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, FormField],
  template: `
    <div class="max-w-4xl">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Panel de Administración</h1>

      <!-- Stats cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div class="bg-white rounded-xl p-5 shadow-sm flex flex-wrap items-center gap-4">
          <div
            class="size-12 rounded-lg flex items-center justify-center bg-indigo-50 text-indigo-600"
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
                d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z"
              />
            </svg>
          </div>
          <div class="flex flex-col flex-1">
            <span class="text-sm text-gray-500">Categorías</span>
            <span class="text-2xl font-bold text-gray-900">{{ totalCategories() }}</span>
          </div>
          <a
            routerLink="/admin/categories"
            class="text-[0.8125rem] text-indigo-600 no-underline font-medium w-full text-right hover:underline focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2 focus-visible:rounded"
            aria-label="Ver categorías"
            >Ver todas →</a
          >
        </div>

        <div class="bg-white rounded-xl p-5 shadow-sm flex flex-wrap items-center gap-4">
          <div
            class="size-12 rounded-lg flex items-center justify-center bg-violet-50 text-violet-600"
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
                d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
              />
            </svg>
          </div>
          <div class="flex flex-col flex-1">
            <span class="text-sm text-gray-500">Subcategorías</span>
            <span class="text-2xl font-bold text-gray-900">{{ totalSubcategories() }}</span>
          </div>
          <a
            routerLink="/admin/subcategories"
            class="text-[0.8125rem] text-violet-600 no-underline font-medium w-full text-right hover:underline focus-visible:outline-2 focus-visible:outline-violet-600 focus-visible:outline-offset-2 focus-visible:rounded"
            aria-label="Ver subcategorías"
            >Ver todas →</a
          >
        </div>
      </div>

      <!-- Auth Section -->
      <section class="bg-white rounded-xl p-6 shadow-sm">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Autenticación</h2>
        @if (authService.isAuthenticated()) {
          <div
            class="flex items-center gap-2 px-4 py-3 rounded-lg text-sm bg-emerald-50 text-emerald-800"
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
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.959 11.959 0 0 1 12 2.714Z"
              />
            </svg>
            <span>Sesión activa — las operaciones de escritura están habilitadas.</span>
          </div>
        } @else {
          <div
            class="flex items-center gap-2 px-4 py-3 rounded-lg text-sm bg-amber-50 text-amber-800 mb-5"
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
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.959 11.959 0 0 1 12 2.714Zm0 13.036h.008v.008H12v-.008Z"
              />
            </svg>
            <span>Sin autenticación — inicia sesión para crear, editar o eliminar registros.</span>
          </div>

          <form (ngSubmit)="onLogin()" class="max-w-sm flex flex-col gap-4">
            <div class="flex flex-col gap-1.5">
              <label for="login-username" class="text-sm font-medium text-gray-700">Usuario</label>
              <input
                id="login-username"
                type="text"
                [formField]="loginForm.username"
                class="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 transition-colors focus:outline-none focus:border-indigo-600 focus:ring-3 focus:ring-indigo-600/10"
                autocomplete="username"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label for="login-password" class="text-sm font-medium text-gray-700"
                >Contraseña</label
              >
              <input
                id="login-password"
                type="password"
                [formField]="loginForm.password"
                class="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 transition-colors focus:outline-none focus:border-indigo-600 focus:ring-3 focus:ring-indigo-600/10"
                autocomplete="current-password"
              />
            </div>
            <button
              type="submit"
              class="self-start px-5 py-2 bg-indigo-600 text-white border-none rounded-lg text-sm font-medium cursor-pointer transition-colors hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
              [disabled]="!loginForm.username().valid() || !loginForm.password().valid()"
            >
              Iniciar sesión
            </button>
          </form>
        }
      </section>
    </div>
  `,
})
export class Dashboard {
  private readonly categoryService = inject(CategoryService);
  private readonly subcategoryService = inject(SubcategoryService);
  private readonly notificationService = inject(NotificationService);

  protected readonly authService = inject(AuthService);

  protected readonly totalCategories = signal(0);
  protected readonly totalSubcategories = signal(0);
  protected readonly loading = signal(true);

  private readonly loginModel = signal({ username: '', password: '' });
  protected readonly loginForm = form(this.loginModel, (schema) => {
    required(schema.username);
    required(schema.password);
  });

  constructor() {
    this.loadStats();
  }

  private loadStats(): void {
    this.loading.set(true);

    this.categoryService.getAll(1, 1).subscribe({
      next: (response) => {
        this.totalCategories.set(response.totalElements);
      },
      error: () => {
        this.totalCategories.set(0);
      },
    });

    this.subcategoryService.getAll(1, 1).subscribe({
      next: (response) => {
        this.totalSubcategories.set(response.totalElements);
        this.loading.set(false);
      },
      error: () => {
        this.totalSubcategories.set(0);
        this.loading.set(false);
      },
    });
  }

  onLogin(): void {
    if (!this.loginForm.username().valid() || !this.loginForm.password().valid()) return;
    const { username, password } = this.loginModel();
    this.authService.login(username, password);
    this.notificationService.success('Sesión iniciada correctamente');
    this.loginModel.set({ username: '', password: '' });
  }
}
