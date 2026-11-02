import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { FareService } from './fare.service';
import { FareCalculationRequestModel, FareCalculationResultModel, TransportTypeInfo } from '../models/fare.model';

describe('FareService', () => {
  let service: FareService;
  let httpTesting: HttpTestingController;

  const mockCalculationResult: FareCalculationResultModel = {
    fromLocation: {
      id: 1,
      nameEn: 'Mirpur 10',
      nameBn: 'মিরপুর ১০',
      displayName: 'মিরপুর ১০, Dhaka',
      latitude: 23.8069,
      longitude: 90.3687,
      district: 'Dhaka',
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
      district: 'Dhaka',
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
      sourceNote: 'BRTA Official',
      sourceNoteBn: 'বিআরটিএ সরকারি রেট',
      reliability: 'Official',
      reliabilityStars: 5,
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
        sourceNote: 'BRTA Official',
        sourceNoteBn: 'বিআরটিএ সরকারি রেট',
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
        sourceNote: 'Street Contract',
        sourceNoteBn: 'চুক্তিভিত্তিক',
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FareService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(FareService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created with initial default states', () => {
    expect(service).toBeTruthy();
    expect(service.selectedTransport()).toBe('bus');
    expect(service.latestResult()).toBeNull();
    expect(service.isCalculating()).toBe(false);
    expect(service.calculationError()).toBeNull();
  });

  it('should convert numbers to Bengali digits correctly', () => {
    expect(service.toBengaliDigits('30 - 40')).toBe('৩০ - ৪০');
    expect(service.toBengaliDigits(250)).toBe('২৫০');
    expect(service.toBengaliDigits('0123456789')).toBe('০১২৩৪৫৬৭৮৯');
  });

  it('should switch selected transport and update primaryFare if result is active', () => {
    service.latestResult.set(mockCalculationResult);
    service.setSelectedTransport('cng');

    expect(service.selectedTransport()).toBe('cng');
    expect(service.latestResult()?.primaryFare.transportCode).toBe('cng');
  });

  it('should calculate fare via HTTP POST and update latestResult signal', () => {
    const request: FareCalculationRequestModel = {
      fromLocationId: 1,
      toLocationId: 2,
      transportCode: 'bus'
    };

    service.calculateFare(request).subscribe((res) => {
      expect(res.distanceKm).toBe(7.5);
      expect(res.primaryFare.transportCode).toBe('bus');
    });

    const req = httpTesting.expectOne('http://localhost:5242/api/fares/calculate');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.fromLocationId).toBe(1);
    expect(req.request.body.includeAllTransports).toBe(true);

    req.flush(mockCalculationResult);

    expect(service.latestResult()).toEqual(mockCalculationResult);
    expect(service.isCalculating()).toBe(false);
    expect(service.calculationError()).toBeNull();
  });

  it('should handle error during fare calculation and set error signal', () => {
    const request: FareCalculationRequestModel = {
      fromLocationId: 1,
      toLocationId: 1
    };

    service.calculateFare(request).subscribe({
      next: () => expect.unreachable('Should have failed'),
      error: (err) => {
        expect(err.message).toContain('ভিন্ন হতে হবে');
      }
    });

    const req = httpTesting.expectOne('http://localhost:5242/api/fares/calculate');
    req.flush(
      { message: 'যাত্রার স্থান এবং গন্তব্য ভিন্ন হতে হবে।' },
      { status: 400, statusText: 'Bad Request' }
    );

    expect(service.calculationError()).toBe('যাত্রার স্থান এবং গন্তব্য ভিন্ন হতে হবে।');
    expect(service.isCalculating()).toBe(false);
  });

  it('should load transport types and update transportTypes signal', () => {
    const mockTypes: TransportTypeInfo[] = [
      { id: 1, code: 'bus', nameEn: 'Bus', nameBn: 'বাস', iconKey: 'directions_bus', displayOrder: 1 },
      { id: 2, code: 'cng', nameEn: 'CNG', nameBn: 'সিএনজি', iconKey: 'electric_rickshaw', displayOrder: 2 }
    ];

    service.loadTransportTypes().subscribe((types) => {
      expect(types.length).toBe(2);
      expect(types[0].code).toBe('bus');
    });

    const req = httpTesting.expectOne('http://localhost:5242/api/fares/transports');
    expect(req.request.method).toBe('GET');
    req.flush(mockTypes);

    expect(service.transportTypes().length).toBe(2);
  });

  it('should clear result and error signals', () => {
    service.latestResult.set(mockCalculationResult);
    service.calculationError.set('Some error');

    service.clearResult();

    expect(service.latestResult()).toBeNull();
    expect(service.calculationError()).toBeNull();
  });
});
