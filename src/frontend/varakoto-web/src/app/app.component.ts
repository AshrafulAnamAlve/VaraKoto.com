import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NotificationService } from './core/services/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    @if (notificationService.currentNotification(); as notice) {
      <aside class="global-toast" [class]="notice.type" role="alert" aria-live="assertive">
        <div class="toast-content">
          <span class="toast-icon">
            @if (notice.type === 'error') { ⚠️ }
            @else if (notice.type === 'success') { ✓ }
            @else { ℹ️ }
          </span>
          <span class="toast-text">{{ notice.messageBn }}</span>
        </div>
        <button type="button" class="toast-close" (click)="notificationService.clear()" aria-label="বন্ধ করুন">✕</button>
      </aside>
    }
    <router-outlet></router-outlet>
  `,
  styles: [`
    .global-toast {
      position: fixed;
      top: 16px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      max-width: 90vw;
      width: 440px;
      padding: 12px 16px;
      border-radius: var(--radius-md);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      animation: toastSlideDown 240ms cubic-bezier(0.16, 1, 0.3, 1);
      font-family: inherit;
      font-weight: 700;
      font-size: 0.92rem;
    }

    .global-toast.error {
      background: #FEE2E2;
      color: #991B1B;
      border: 1.5px solid #EF4444;
    }

    .global-toast.success {
      background: #D1FAE5;
      color: #065F46;
      border: 1.5px solid #10B981;
    }

    .global-toast.info {
      background: #E0F2FE;
      color: #075985;
      border: 1.5px solid #0284C7;
    }

    .toast-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .toast-close {
      background: transparent;
      border: none;
      font-size: 1rem;
      cursor: pointer;
      color: inherit;
      opacity: 0.7;
      padding: 4px;
      line-height: 1;
    }

    .toast-close:hover {
      opacity: 1;
    }

    @keyframes toastSlideDown {
      from { transform: translate(-50%, -100%); opacity: 0; }
      to { transform: translate(-50%, 0); opacity: 1; }
    }
  `]
})
export class App {
  readonly notificationService = inject(NotificationService);
}
