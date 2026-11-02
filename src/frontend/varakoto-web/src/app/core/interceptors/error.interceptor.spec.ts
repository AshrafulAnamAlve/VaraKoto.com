import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { errorInterceptor } from './error.interceptor';
import { NotificationService } from '../services/notification.service';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;
  let notificationService: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting()
      ]
    });

    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
    notificationService = TestBed.inject(NotificationService);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should handle network drop (status 0) and show Bengali error notification', () => {
    http.get('/api/test-endpoint').subscribe({
      next: () => expect.unreachable('Should have failed'),
      error: (err) => {
        expect(err.message).toContain('ইন্টারনেট সংযোগ বিচ্ছিন্ন');
      }
    });

    const req = httpTesting.expectOne('/api/test-endpoint');
    req.error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });

    expect(notificationService.currentNotification()?.type).toBe('error');
    expect(notificationService.currentNotification()?.messageBn).toContain('ইন্টারনেট সংযোগ বিচ্ছিন্ন');
  });

  it('should handle 429 rate limit exceeded error', () => {
    http.get('/api/test-rate-limit').subscribe({
      next: () => expect.unreachable('Should have failed'),
      error: (err) => {
        expect(err.message).toContain('অতিরিক্ত রিকোয়েস্ট');
      }
    });

    const req = httpTesting.expectOne('/api/test-rate-limit');
    req.flush({ message: 'Rate limit exceeded' }, { status: 429, statusText: 'Too Many Requests' });

    expect(notificationService.currentNotification()?.type).toBe('error');
    expect(notificationService.currentNotification()?.messageBn).toContain('অতিরিক্ত রিকোয়েস্ট');
  });

  it('should handle 500 server error', () => {
    http.get('/api/test-server-error').subscribe({
      next: () => expect.unreachable('Should have failed'),
      error: (err) => {
        expect(err.message).toContain('সার্ভারে সাময়িক সমস্যা');
      }
    });

    const req = httpTesting.expectOne('/api/test-server-error');
    req.flush({ message: 'Internal Server Error' }, { status: 500, statusText: 'Server Error' });

    expect(notificationService.currentNotification()?.type).toBe('error');
    expect(notificationService.currentNotification()?.messageBn).toContain('সার্ভারে সাময়িক সমস্যা');
  });
});
