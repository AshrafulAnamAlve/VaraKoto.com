import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { HomePageComponent } from './home-page.component';
import { FareService } from '../../../../core/services/fare.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { FareCalculationResultModel, RecentContributionModel } from '../../../../core/models/fare.model';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let fareService: FareService;
  let themeService: ThemeService;
  let httpTesting: HttpTestingController;

  const mockResult: FareCalculationResultModel = {
    fromLocation: {
      id: 1,
      nameEn: 'Mirpur 10',
      nameBn: 'মিরপুর ১০',
      displayName: 'মিরপুর ১০',
      latitude: 23.8069,
      longitude: 90.3687,
      isHub: true,
      source: 'Database'
    },
    toLocation: {
      id: 2,
      nameEn: 'Farmgate',
      nameBn: 'ফার্মগেট',
      displayName: 'ফার্মগেট',
      latitude: 23.7561,
      longitude: 90.3872,
      isHub: true,
      source: 'Database'
    },
    distanceKm: 7.5,
    estimatedDurationMinutes: 25,
    distanceSource: 'OSRM',
    primaryFare: {
      transportCode: 'bus',
      transportNameEn: 'Bus',
      transportNameBn: 'বাস',
      iconKey: 'directions_bus',
      displayOrder: 1,
      estimatedMinFare: 30,
      estimatedMaxFare: 40,
      exactFare: null,
      officialMeterFare: null,
      fareDisplayEn: '৳30 - ৳40',
      fareDisplayBn: '৳৩০ - ৳৪০',
      fareType: 'OfficialRate',
      sourceNote: 'BRTA',
      sourceNoteBn: 'বিআরটিএ',
      reliability: 'Official',
      reliabilityStars: 5,
      communitySubmissionCount: 0,
      communityAverageFare: null,
      isAvailableForDistance: true,
      distanceNotice: null,
      distanceNoticeBn: null
    },
    allFares: [],
    calculatedAt: new Date().toISOString()
  };

  const mockRecentContributions: RecentContributionModel[] = [
    {
      id: 1,
      fromLocationName: 'মিরপুর ১০',
      toLocationName: 'ফার্মগেট',
      transportCode: 'bus',
      transportNameBn: 'বাস',
      actualFarePaid: 35,
      fareDisplayBn: '৳৩৫',
      distanceKm: 7.5,
      timeAgoBn: '১০ মিনিট আগে',
      submittedAt: new Date().toISOString()
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [
        FareService,
        ThemeService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fareService = TestBed.inject(FareService);
    themeService = TestBed.inject(ThemeService);
    httpTesting = TestBed.inject(HttpTestingController);

    fareService.clearResult();
    fixture.detectChanges();

    // Flush recent-contributions request from ngOnInit
    const req = httpTesting.match('http://localhost:5293/api/fares/recent-contributions?limit=6');
    if (req.length > 0) {
      req[0].flush(mockRecentContributions);
      fixture.detectChanges();
    }
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should create the home page component', () => {
    expect(component).toBeTruthy();
  });

  it('should display fare finder card by default', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-fare-finder-card')).toBeTruthy();
    expect(compiled.querySelector('app-fare-result-card')).toBeNull();
  });

  it('should toggle theme mode on button click', () => {
    const initial = themeService.isDark();
    component.toggleTheme();
    expect(themeService.isDark()).not.toBe(initial);
  });

  it('should display fare result card when calculation result is present', () => {
    fareService.latestResult.set(mockResult);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-fare-result-card')).toBeTruthy();
    expect(compiled.querySelector('app-fare-finder-card')).toBeNull();
  });

  it('should reset view to finder card when showFinder is called', () => {
    fareService.latestResult.set(mockResult);
    fixture.detectChanges();

    component.showFinder();
    fixture.detectChanges();

    expect(fareService.latestResult()).toBeNull();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-fare-finder-card')).toBeTruthy();
  });

  it('should render loading screen when calculation is active', () => {
    fareService.isCalculating.set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-loading-screen')).toBeTruthy();
  });

  it('should open and close contribution modal', () => {
    expect(component.isContributionModalOpen()).toBe(false);

    component.openContributionModal('উত্তরা', 'বনানী', 'cng');
    expect(component.isContributionModalOpen()).toBe(true);
    expect(component.contributionInitialFrom()).toBe('উত্তরা');
    expect(component.contributionInitialTo()).toBe('বনানী');
    expect(component.contributionInitialTransport()).toBe('cng');

    component.closeContributionModal();
    expect(component.isContributionModalOpen()).toBe(false);
  });

  it('should render recent community contributions section', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const section = compiled.querySelector('.recent-contributions-section');
    expect(section).toBeTruthy();
    expect(section?.textContent).toContain('সাম্প্রতিক সহযাত্রীদের আপডেট');
    expect(section?.textContent).toContain('মিরপুর ১০');
    expect(section?.textContent).toContain('ফার্মগেট');
  });
});
