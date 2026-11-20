import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { TransitGuideService } from './transit-guide.service';
import { LocationDto } from '../models/location.model';

describe('TransitGuideService', () => {
  let service: TransitGuideService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransitGuideService]
    });
    service = TestBed.inject(TransitGuideService);
  });

  it('should be created successfully', () => {
    expect(service).toBeTruthy();
  });

  it('should recommend direct rickshaw for short distances (<= 2.2 km)', () => {
    const fromLoc: LocationDto = {
      nameBn: 'মিরপুর ১০',
      nameEn: 'Mirpur 10',
      displayName: 'মিরপুর ১০, ঢাকা',
      latitude: 23.8069,
      longitude: 90.3687,
      district: 'Dhaka',
      isHub: true,
      source: 'Database'
    };

    const toLoc: LocationDto = {
      nameBn: 'মিরপুর ২',
      nameEn: 'Mirpur 2',
      displayName: 'মিরপুর ২, ঢাকা',
      latitude: 23.8040,
      longitude: 90.3600,
      district: 'Dhaka',
      isHub: false,
      source: 'Database'
    };

    const guide = service.generateGuide(fromLoc, toLoc, 1.5, 'dhaka');
    expect(guide.isShortDistance).toBe(true);
    expect(guide.shortDistanceAdvice).toContain('রিকশায়');
  });

  it('should recommend Metro Rail (MRT Line-6) when traveling along the metro corridor', () => {
    const fromLoc: LocationDto = {
      nameBn: 'মিরপুর ১০ গোলচত্বর',
      nameEn: 'Mirpur 10',
      displayName: 'মিরপুর ১০, ঢাকা',
      latitude: 23.8069,
      longitude: 90.3687,
      district: 'Dhaka',
      isHub: true,
      source: 'Database'
    };

    const toLoc: LocationDto = {
      nameBn: 'ফার্মগেট আনন্দ সিনেমা',
      nameEn: 'Farmgate',
      displayName: 'ফার্মগেট, ঢাকা',
      latitude: 23.7571,
      longitude: 90.3895,
      district: 'Dhaka',
      isHub: true,
      source: 'Database'
    };

    const guide = service.generateGuide(fromLoc, toLoc, 5.8, 'dhaka');
    expect(guide.hasMetroOption).toBe(true);
    expect(guide.metroBoardingStation).toContain('মিরপুর ১০');
    expect(guide.metroAlightingStation).toContain('ফার্মগেট');
    expect(guide.metroDurationMinutes).toBeGreaterThan(5);
  });

  it('should recommend direct buses between Mirpur and Motijheel', () => {
    const fromLoc: LocationDto = {
      nameBn: 'মিরপুর ১০',
      nameEn: 'Mirpur 10',
      displayName: 'মিরপুর ১০, ঢাকা',
      latitude: 23.8069,
      longitude: 90.3687,
      district: 'Dhaka',
      isHub: true,
      source: 'Database'
    };

    const toLoc: LocationDto = {
      nameBn: 'মতিঝিল শাপলা চত্বর',
      nameEn: 'Motijheel',
      displayName: 'মতিঝিল, ঢাকা',
      latitude: 23.7330,
      longitude: 90.4172,
      district: 'Dhaka',
      isHub: true,
      source: 'Database'
    };

    const guide = service.generateGuide(fromLoc, toLoc, 11.2, 'dhaka');
    expect(guide.hasDirectBus).toBe(true);
    expect(guide.directBuses.length).toBeGreaterThan(0);
    expect(guide.directBuses.some(b => b.includes('বিহঙ্গ') || b.includes('শিখর') || b.includes('বিকল্প'))).toBe(true);
  });

  it('should recommend highway coaches and terminal for inter-district travel', () => {
    const fromLoc: LocationDto = {
      nameBn: 'ঢাকা সদর',
      nameEn: 'Dhaka',
      displayName: 'ঢাকা',
      latitude: 23.8103,
      longitude: 90.4125,
      district: 'Dhaka',
      isHub: true,
      source: 'Database'
    };

    const toLoc: LocationDto = {
      nameBn: 'রাঙ্গামাটি সদর',
      nameEn: 'Rangamati',
      displayName: 'রাঙ্গামাটি',
      latitude: 22.6533,
      longitude: 92.1753,
      district: 'Rangamati',
      isHub: true,
      source: 'Database'
    };

    const guide = service.generateGuide(fromLoc, toLoc, 310, 'dhaka');
    expect(guide.isInterDistrict).toBe(true);
    expect(guide.departureTerminal).toContain('সায়েদাবাদ');
    expect(guide.interDistrictCoaches.length).toBeGreaterThan(0);
    expect(guide.interDistrictCoaches.some(c => c.includes('শ্যামলী') || c.includes('সেন্টমার্টিন'))).toBe(true);
  });

  it('should recommend accurate non-Farmgate intermediate hubs for different corridors', () => {
    // 1. Uttara to Mirpur connecting route
    const uttaraLoc: LocationDto = {
      nameBn: 'উত্তরা সেক্টর ১০',
      nameEn: 'Uttara Sector 10',
      displayName: 'উত্তরা ১০, ঢাকা',
      latitude: 23.8720,
      longitude: 90.3850,
      district: 'Dhaka',
      isHub: false,
      source: 'Database'
    };
    const mirpurLoc: LocationDto = {
      nameBn: 'মিরপুর ২',
      nameEn: 'Mirpur 2',
      displayName: 'মিরপুর ২, ঢাকা',
      latitude: 23.8040,
      longitude: 90.3600,
      district: 'Dhaka',
      isHub: false,
      source: 'Database'
    };

    const guide1 = service.generateGuide(uttaraLoc, mirpurLoc, 8.5, 'dhaka');
    expect(guide1.transferHub).toBeDefined();
    expect(guide1.transferHub).toContain('কালশী');
    expect(guide1.transferHub).not.toContain('ফার্মগেট');

    // 2. Sylhet local transfer route
    const sylhet1: LocationDto = {
      nameBn: 'কোর্ট পয়েন্ট',
      nameEn: 'Court Point',
      displayName: 'কোর্ট পয়েন্ট, সিলেট',
      latitude: 24.8949,
      longitude: 91.8687,
      district: 'Sylhet',
      isHub: true,
      source: 'Database'
    };
    const sylhet2: LocationDto = {
      nameBn: 'টিলাগড়',
      nameEn: 'Tilagarh',
      displayName: 'টিলাগড়, সিলেট',
      latitude: 24.8967,
      longitude: 91.9028,
      district: 'Sylhet',
      isHub: false,
      source: 'Database'
    };

    const guide2 = service.generateGuide(sylhet1, sylhet2, 4.2, 'sylhet');
    expect(guide2.transferHub).toBeDefined();
    expect(guide2.transferHub).toContain('কোর্ট পয়েন্ট');
    expect(guide2.transferHub).not.toContain('ফার্মগেট');
  });
});
