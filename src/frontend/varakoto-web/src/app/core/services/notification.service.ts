import { Injectable, signal } from '@angular/core';

export interface AppNotification {
  id: number;
  type: 'error' | 'success' | 'info';
  messageBn: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  readonly currentNotification = signal<AppNotification | null>(null);
  private counter = 0;
  private timeoutRef?: any;

  show(type: 'error' | 'success' | 'info', messageBn: string, durationMs: number = 5000): void {
    if (this.timeoutRef) {
      clearTimeout(this.timeoutRef);
    }

    this.counter++;
    this.currentNotification.set({
      id: this.counter,
      type,
      messageBn
    });

    this.timeoutRef = setTimeout(() => {
      this.clear();
    }, durationMs);
  }

  showError(messageBn: string, durationMs: number = 6000): void {
    this.show('error', messageBn, durationMs);
  }

  showSuccess(messageBn: string, durationMs: number = 4000): void {
    this.show('success', messageBn, durationMs);
  }

  clear(): void {
    this.currentNotification.set(null);
    if (this.timeoutRef) {
      clearTimeout(this.timeoutRef);
      this.timeoutRef = undefined;
    }
  }
}
