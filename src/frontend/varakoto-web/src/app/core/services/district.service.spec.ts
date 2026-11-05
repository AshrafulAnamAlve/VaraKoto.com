import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DistrictService } from './district.service';
import { NativeMobileService } from './native-mobile.service';
import { BANGLADESH_DISTRICTS } from '../data/districts.data';

describe('DistrictService', () => {
  let service: DistrictService;
  let mockNativeMobile: Partial<NativeMobileService>;

  beforeEach(() => {
    localStorage.clear();
    mockNativeMobile = {
      getCurrentPosition: vi.fn().mockResolvedValue({
        latitude: 22.6533,
        longitude: 92.1753
      }),
      hapticSelection: vi.fn().mockResolvedValue(undefined)
    };

    TestBed.configureTestingModule({
      providers: [
        DistrictService,
        { provide: NativeMobileService, useValue: mockNativeMobile }
      ]
    });

    service = TestBed.inject(DistrictService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created and default to Dhaka or open modal if first visit', () => {
    expect(service).toBeTruthy();
    expect(service.currentDistrict().id).toBe('dhaka');
    expect(service.isModalOpen()).toBe(true);
  });

  it('should set district and save to localStorage', () => {
    const rangamati = BANGLADESH_DISTRICTS.find(d => d.id === 'rangamati')!;
    service.setDistrict(rangamati);

    expect(service.currentDistrict().id).toBe('rangamati');
    expect(service.currentDistrictNameBn()).toBe('রাঙ্গামাটি');
    expect(service.isModalOpen()).toBe(false);
    expect(localStorage.getItem('vk_user_district')).toContain('rangamati');
    expect(mockNativeMobile.hapticSelection).toHaveBeenCalled();
  });

  it('should provide popular hubs for Rangamati', () => {
    const rangamati = BANGLADESH_DISTRICTS.find(d => d.id === 'rangamati')!;
    service.setDistrict(rangamati);

    const hubs = service.getPopularHubsForCurrentDistrict();
    expect(hubs.length).toBeGreaterThan(0);
    expect(hubs.some(h => h.nameBn.includes('বনরূপা'))).toBe(true);
  });

  it('should auto-detect nearest district via GPS', async () => {
    const detected = await service.detectDistrictFromGPS();
    expect(detected.id).toBe('rangamati');
    expect(service.currentDistrict().id).toBe('rangamati');
  });
});
