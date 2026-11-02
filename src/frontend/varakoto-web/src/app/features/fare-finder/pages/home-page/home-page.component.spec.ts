import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { HomePageComponent } from './home-page.component';
import { FareService } from '../../../../core/services/fare.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { FareCalculationResultModel } from '../../../../core/models/fare.model';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let fareService: FareService;
  let themeService: ThemeService;

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
    fareService.clearResult();
    fixture.detectChanges();
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
});
