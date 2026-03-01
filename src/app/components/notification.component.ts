import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-notification',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="fixed top-4 right-4 z-100 flex flex-col gap-2 max-w-sm"
      aria-live="polite"
      aria-atomic="false"
    >
      @for (notification of notifications(); track notification.id) {
        <div
          class="flex items-center gap-3 px-4 py-3 rounded-lg shadow-md animate-slide-in-right text-sm"
          [class]="typeClass(notification.type)"
          role="alert"
        >
          <span class="shrink-0 text-base font-bold" aria-hidden="true">{{
            typeIcon(notification.type)
          }}</span>
          <span class="flex-1 leading-snug">{{ notification.message }}</span>
          <button
            type="button"
            class="shrink-0 bg-transparent border-none cursor-pointer opacity-60 text-xs p-1 leading-none hover:opacity-100 focus-visible:outline-2 focus-visible:outline-current focus-visible:outline-offset-2 focus-visible:rounded"
            aria-label="Cerrar notificación"
            (click)="notificationService.dismiss(notification.id)"
          >
            ✕
          </button>
        </div>
      }
    </div>
  `,
})
export class Notification {
  protected readonly notificationService = inject(NotificationService);
  protected readonly notifications = this.notificationService.notifications;

  protected typeClass(type: string): string {
    const classes: Record<string, string> = {
      success: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
      error: 'bg-red-50 text-red-800 border border-red-200',
      info: 'bg-blue-50 text-blue-800 border border-blue-200',
      warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    };
    return classes[type] ?? classes['info'];
  }

  protected typeIcon(type: string): string {
    const icons: Record<string, string> = {
      success: '✓',
      error: '✕',
      info: 'ℹ',
      warning: '⚠',
    };
    return icons[type] ?? 'ℹ';
  }
}
