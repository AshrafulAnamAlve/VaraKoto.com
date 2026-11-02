import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FareResultCardComponent } from './fare-result-card.component';
import { FareService } from '../../../../core/services/fare.service';
import { FareCalculationResultModel } from '../../../../core/models/fare.model';

describe('FareResultCardComponent', () => {
  let component: FareResultCardComponent;
  let fixture: ComponentFixture<FareResultCardComponent>;
  let fareService: FareService;

  const mockResult: FareCalculationResultModel = {
    fromLocation: {
      id: 1,
      nameEn: 'Mirpur 10',
      nameBn: 'মিরপুর ১০',
      displayName: 'মিরপুর ১০, Dhaka',
      latitude: 23.8069,
      longitude: 90.3687,
      isHub: true,
      source: 'Database'
    },
    toLocation: {
      id: 2,
      nameEn: 'Farmgate',
      nameBn: 'ফার্মগেট',
      displayName: 'ফার্মগেট, Dhaka',
      latitude: 23.7561,
      longitude: 90.3872,
      isHub: true,
      source: 'Database'
    },
    distanceKm: 7.5,
    estimatedDurationMinutes: 25,
    distanceSource: 'OSRM',
    primaryFare: {
      transportCode: 'cng',
      transportNameEn: 'CNG',
      transportNameBn: 'সিএনজি',
      iconKey: 'electric_rickshaw',
      displayOrder: 3,
      estimatedMinFare: 250,
      estimatedMaxFare: 340,
      exactFare: null,
      officialMeterFare: 110,
      fareDisplayEn: '৳250 - ৳340',
      fareDisplayBn: '৳২৫০ - ৳৩৪০',
      fareType: 'NegotiatedMarket',
      sourceNote: 'Street contract',
      sourceNoteBn: 'বাস্তবে চুক্তিভিত্তিক',
      reliability: 'Estimated',
      reliabilityStars: 3,
      communitySubmissionCount: 0,
      communityAverageFare: null,
      isAvailableForDistance: true,
      distanceNotice: null,
      distanceNoticeBn: null
    },
    allFares: [
      {
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
        sourceNoteBn: 'বিআরটিএ রেট',
        reliability: 'Official',
        reliabilityStars: 5,
        communitySubmissionCount: 0,
        communityAverageFare: null,
        isAvailableForDistance: true,
        distanceNotice: null,
        distanceNoticeBn: null
      },
      {
        transportCode: 'cng',
        transportNameEn: 'CNG',
        transportNameBn: 'সিএনজি',
        iconKey: 'electric_rickshaw',
        displayOrder: 3,
        estimatedMinFare: 250,
        estimatedMaxFare: 340,
        exactFare: null,
        officialMeterFare: 110,
        fareDisplayEn: '৳250 - ৳340',
        fareDisplayBn: '৳২৫০ - ৳৩৪০',
        fareType: 'NegotiatedMarket',
        sourceNote: 'Street contract',
        sourceNoteBn: 'বাস্তবে চুক্তিভিত্তিক',
        reliability: 'Estimated',
        reliabilityStars: 3,
        communitySubmissionCount: 0,
        communityAverageFare: null,
        isAvailableForDistance: true,
        distanceNotice: null,
        distanceNoticeBn: null
      }
    ],
    calculatedAt: new Date().toISOString()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FareResultCardComponent],
      providers: [
        FareService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FareResultCardComponent);
    component = fixture.componentInstance;
    fareService = TestBed.inject(FareService);
    fareService.latestResult.set(mockResult);
    fixture.detectChanges();
  });

  it('should create fare result card', () => {
    expect(component).toBeTruthy();
  });

  it('should display origin and destination names', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('মিরপুর ১০');
    expect(compiled.textContent).toContain('ফার্মগেট');
  });

  it('should format distance and duration in Bengali', () => {
    expect(component.distanceBn()).toBe('৭.৫');
    expect(component.durationBn()).toBe('২৫');
  });

  it('should display the primary fare amount and transport', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('৳২৫০ - ৳৩৪০');
    expect(compiled.textContent).toContain('সিএনজি ভাড়া');
  });

  it('should display CNG meter notice when meter fare is available', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.meter-notice-box')).toBeTruthy();
    expect(compiled.textContent).toContain('১১০');
  });

  it('should emit modifySearch on button click', () => {
    const modifySpy = vi.spyOn(component.modifySearch, 'emit');
    component.onModify();
    expect(modifySpy).toHaveBeenCalled();
  });

  it('should emit contributeFare on button click', () => {
    const contributeSpy = vi.spyOn(component.contributeFare, 'emit');
    component.onContribute();
    expect(contributeSpy).toHaveBeenCalledWith(expect.objectContaining({
      fromLocation: 'মিরপুর ১০',
      toLocation: 'ফার্মগেট',
      transport: 'cng'
    }));
  });

  it('should switch transport mode on comparison button click', () => {
    const switchSpy = vi.spyOn(fareService, 'setSelectedTransport');
    component.selectTransport('bus');
    expect(switchSpy).toHaveBeenCalledWith('bus');
  });
});
