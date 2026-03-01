import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Notification } from '../components/notification.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Notification],
  template: `
    <div class="flex min-h-screen bg-gray-100">
      <aside
        class="bg-indigo-950 text-white flex flex-col sticky top-0 h-screen overflow-y-auto transition-[width] duration-200"
        [class.w-64]="sidebarOpen()"
        [class.w-16]="!sidebarOpen()"
      >
        <div class="flex items-center justify-between p-4 border-b border-white/10 min-h-14">
          <h1 class="text-lg font-bold m-0 whitespace-nowrap overflow-hidden">
            @if (sidebarOpen()) {
              <span>E-Commerce</span>
            }
          </h1>
          <button
            type="button"
            class="bg-transparent border-none text-white cursor-pointer p-1.5 rounded-md shrink-0 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
            (click)="toggleSidebar()"
            [attr.aria-label]="sidebarOpen() ? 'Colapsar menú' : 'Expandir menú'"
            aria-controls="sidebar-nav"
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
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>

        <nav id="sidebar-nav" class="flex-1 py-3" aria-label="Navegación principal">
          <ul class="list-none m-0 p-0 flex flex-col gap-1">
            <li>
              <a
                routerLink="/admin"
                routerLinkActive="text-white bg-white/15 border-r-[3px] border-indigo-400"
                [routerLinkActiveOptions]="{ exact: true }"
                class="flex items-center gap-3 px-4 py-2.5 text-white/70 no-underline text-sm font-medium transition-all duration-150 whitespace-nowrap hover:text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-5 shrink-0"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>
                @if (sidebarOpen()) {
                  <span>Dashboard</span>
                }
              </a>
            </li>
            <li>
              <a
                routerLink="/admin/categories"
                routerLinkActive="text-white bg-white/15 border-r-[3px] border-indigo-400"
                class="flex items-center gap-3 px-4 py-2.5 text-white/70 no-underline text-sm font-medium transition-all duration-150 whitespace-nowrap hover:text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-5 shrink-0"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z"
                  />
                </svg>
                @if (sidebarOpen()) {
                  <span>Categorías</span>
                }
              </a>
            </li>
            <li>
              <a
                routerLink="/admin/subcategories"
                routerLinkActive="text-white bg-white/15 border-r-[3px] border-indigo-400"
                class="flex items-center gap-3 px-4 py-2.5 text-white/70 no-underline text-sm font-medium transition-all duration-150 whitespace-nowrap hover:text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-5 shrink-0"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                  />
                </svg>
                @if (sidebarOpen()) {
                  <span>Subcategorías</span>
                }
              </a>
            </li>
          </ul>
        </nav>

        <div class="py-3 border-t border-white/10">
          @if (authService.isAuthenticated()) {
            <button
              type="button"
              class="flex items-center gap-3 px-4 py-2.5 text-white/60 text-sm font-medium transition-all duration-150 whitespace-nowrap border-none bg-transparent w-full cursor-pointer text-left hover:text-red-300 hover:bg-red-500/10 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
              (click)="logout()"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-5 shrink-0"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                />
              </svg>
              @if (sidebarOpen()) {
                <span>Cerrar sesión</span>
              }
            </button>
          }
        </div>
      </aside>

      <main class="flex-1 p-6 sm:px-8 min-w-0 overflow-x-auto">
        <router-outlet />
      </main>
    </div>

    <app-notification />
  `,
})
export class AdminLayout {
  protected readonly authService = inject(AuthService);
  protected readonly sidebarOpen = signal(true);

  toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  logout(): void {
    this.authService.logout();
  }
}
