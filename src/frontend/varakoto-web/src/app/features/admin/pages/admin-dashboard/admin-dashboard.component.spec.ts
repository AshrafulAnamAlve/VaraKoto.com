import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { AdminService } from '../../../../core/services/admin.service';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardComponent],
      providers: [
        AdminService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    // Flush initial requests
    const statsReq = httpTesting.match('http://localhost:5293/api/admin/stats');
    if (statsReq.length > 0) {
      statsReq[0].flush({
        totalPending: 2,
        totalApproved: 5,
        totalFlagged: 0,
        totalRejected: 1,
        totalSubmissions: 8
      });
    }

    const subReq = httpTesting.match('http://localhost:5293/api/admin/submissions?status=Pending');
    if (subReq.length > 0) {
      subReq[0].flush([
        {
          id: 1,
          fromLocationName: 'মিরপুর ১০',
          toLocationName: 'ফার্মগেট',
          transportCode: 'bus',
          transportNameBn: 'বাস',
          userSubmittedFare: 40,
          databaseStandardFare: 35,
          differenceAmount: 5,
          differencePercentage: 14.3,
          distanceKm: 7.5,
          moderationStatus: 'Pending',
          timeAgoBn: 'এইমাত্র',
          submittedAt: new Date().toISOString()
        }
      ]);
    }

    fixture.detectChanges();
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should create the dashboard component', () => {
    expect(component).toBeTruthy();
  });

  it('should display comparison between user fare and database standard fare', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('মিরপুর ১০');
    expect(el.textContent).toContain('ফার্মগেট');
    expect(el.textContent).toContain('৳40');
    expect(el.textContent).toContain('৳35');
    expect(el.textContent).toContain('+৳5 (+14.3%)');
  });

  it('should filter submissions when clicking tab', () => {
    component.loadSubmissions('Approved');
    expect(component.selectedFilter()).toBe('Approved');

    const req = httpTesting.expectOne('http://localhost:5293/api/admin/submissions?status=Approved');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
