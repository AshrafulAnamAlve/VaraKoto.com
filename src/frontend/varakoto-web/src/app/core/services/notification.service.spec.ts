import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  it('should be created and start with null notification', () => {
    expect(service).toBeTruthy();
    expect(service.currentNotification()).toBeNull();
  });

  it('should display error notification and clear it', () => {
    service.showError('সার্ভার সংযোগ বিচ্ছিন্ন হয়েছে।');
    expect(service.currentNotification()?.type).toBe('error');
    expect(service.currentNotification()?.messageBn).toBe('সার্ভার সংযোগ বিচ্ছিন্ন হয়েছে।');

    service.clear();
    expect(service.currentNotification()).toBeNull();
  });

  it('should display success notification', () => {
    service.showSuccess('সফলভাবে সংরক্ষিত হয়েছে।');
    expect(service.currentNotification()?.type).toBe('success');
    expect(service.currentNotification()?.messageBn).toBe('সফলভাবে সংরক্ষিত হয়েছে।');
  });
});
