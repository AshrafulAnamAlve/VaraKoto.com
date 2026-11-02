import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AdminService } from './admin.service';
import { AdminLoginResponseModel, AdminStatsModel, AdminSubmissionModel } from '../models/admin.model';

describe('AdminService', () => {
  let service: AdminService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        AdminService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    });
    service = TestBed.inject(AdminService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
    localStorage.clear();
  });

  it('should be created and start unauthenticated', () => {
    expect(service).toBeTruthy();
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should login and set session', () => {
    const mockRes: AdminLoginResponseModel = {
      token: 'test-token-xyz',
      username: 'admin',
      displayName: 'VaraKoto Admin',
      role: 'Admin',
      expiresAt: new Date(Date.now() + 86400000).toISOString()
    };

    service.login({ username: 'admin', password: 'Admin@123' }).subscribe((res) => {
      expect(res.token).toBe('test-token-xyz');
      expect(service.isAuthenticated()).toBe(true);
    });

    const req = httpTesting.expectOne('http://localhost:5293/api/admin/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockRes);
  });

  it('should fetch stats', () => {
    const mockStats: AdminStatsModel = {
      totalPending: 3,
      totalApproved: 10,
      totalFlagged: 1,
      totalRejected: 0,
      totalSubmissions: 14
    };

    service.getStats().subscribe((stats) => {
      expect(stats.totalPending).toBe(3);
      expect(stats.totalApproved).toBe(10);
    });

    const req = httpTesting.expectOne('http://localhost:5293/api/admin/stats');
    expect(req.request.method).toBe('GET');
    req.flush(mockStats);
  });

  it('should approve submission', () => {
    const mockApproved: AdminSubmissionModel = {
      id: 5,
      fromLocationName: 'মিরপুর ১০',
      toLocationName: 'ফার্মগেট',
      transportCode: 'bus',
      transportNameBn: 'বাস',
      userSubmittedFare: 35,
      databaseStandardFare: 35,
      differenceAmount: 0,
      differencePercentage: 0,
      distanceKm: 7.5,
      moderationStatus: 'Approved',
      timeAgoBn: 'এইমাত্র',
      submittedAt: new Date().toISOString()
    };

    service.approveSubmission(5, 'Approved').subscribe((res) => {
      expect(res.moderationStatus).toBe('Approved');
    });

    const req = httpTesting.expectOne('http://localhost:5293/api/admin/submissions/5/approve');
    expect(req.request.method).toBe('POST');
    req.flush(mockApproved);
  });
});
