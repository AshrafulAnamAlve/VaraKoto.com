import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FareFinderCardComponent } from './fare-finder-card.component';
import { LocationService } from '../../../../core/services/location.service';
import { FareService } from '../../../../core/services/fare.service';
import { LocationDto } from '../../../../core/models/location.model';

describe('FareFinderCardComponent', () => {
  let component: FareFinderCardComponent;
  let fixture: ComponentFixture<FareFinderCardComponent>;
  let locationService: LocationService;
  let fareService: FareService;

  const mockLocations: LocationDto[] = [
    {
      id: 1,
      nameEn: 'Mirpur 10',
      nameBn: 'মিরপুর ১০',
      displayName: 'মিরপুর ১০, Dhaka',
      latitude: 23.8069,
      longitude: 90.3687,
      isHub: true,
      source: 'Database'
    },
    {
      id: 2,
      nameEn: 'Farmgate',
      nameBn: 'ফার্মগেট',
      displayName: 'ফার্মগেট, Dhaka',
      latitude: 23.7561,
      longitude: 90.3872,
      isHub: true,
      source: 'Database'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FareFinderCardComponent],
      providers: [
        LocationService,
        FareService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FareFinderCardComponent);
    component = fixture.componentInstance;
    locationService = TestBed.inject(LocationService);
    fareService = TestBed.inject(FareService);
    fixture.detectChanges();
  });

  it('should create the fare finder card component', () => {
    expect(component).toBeTruthy();
  });

  it('should update query and reset selected location on input', () => {
    component.selectFrom(mockLocations[0]);
    expect(component.selectedFrom()?.id).toBe(1);

    component.onFromInput('মিরপুর ২');
    expect(component.fromQuery()).toBe('মিরপুর ২');
    expect(component.selectedFrom()).toBeNull();
  });

  it('should select suggestions for from and to correctly', () => {
    component.selectFrom(mockLocations[0]);
    expect(component.selectedFrom()?.id).toBe(1);
    expect(component.fromQuery()).toBe('মিরপুর ১০');

    component.selectTo(mockLocations[1]);
    expect(component.selectedTo()?.id).toBe(2);
    expect(component.toQuery()).toBe('ফার্মগেট');
  });

  it('should clear from and to inputs and selections', () => {
    component.selectFrom(mockLocations[0]);
    component.clearFrom();
    expect(component.fromQuery()).toBe('');
    expect(component.selectedFrom()).toBeNull();

    component.selectTo(mockLocations[1]);
    component.clearTo();
    expect(component.toQuery()).toBe('');
    expect(component.selectedTo()).toBeNull();
  });

  it('should swap origin and destination', () => {
    component.selectFrom(mockLocations[0]);
    component.selectTo(mockLocations[1]);

    component.swapLocations();

    expect(component.selectedFrom()?.id).toBe(2);
    expect(component.selectedTo()?.id).toBe(1);
    expect(component.fromQuery()).toBe('ফার্মগেট');
    expect(component.toQuery()).toBe('মিরপুর ১০');
  });

  it('should validate empty inputs before finding fare', () => {
    component.clearFrom();
    component.clearTo();

    component.onFindFare();
    expect(component.validationMessage()).toContain('কোথা থেকে যাবেন');

    component.fromQuery.set('মিরপুর ১০');
    component.onFindFare();
    expect(component.validationMessage()).toContain('কোথায় যাবেন');
  });

  it('should validate identical origin and destination', () => {
    component.selectFrom(mockLocations[0]);
    component.selectTo(mockLocations[0]);

    component.onFindFare();
    expect(component.validationMessage()).toContain('ভিন্ন হতে হবে');
  });

  it('should call calculateFare when inputs are valid', () => {
    const calcSpy = vi.spyOn(fareService, 'calculateFare').mockReturnValue(of({} as any));

    component.selectFrom(mockLocations[0]);
    component.selectTo(mockLocations[1]);

    component.onFindFare();

    expect(calcSpy).toHaveBeenCalledWith(expect.objectContaining({
      fromLocationId: 1,
      toLocationId: 2,
      transportCode: 'bus'
    }));
  });

  it('should select transport mode', () => {
    const setSpy = vi.spyOn(fareService, 'setSelectedTransport');
    component.selectTransport('cng');
    expect(setSpy).toHaveBeenCalledWith('cng');
  });

  it('should handle geolocation detection', () => {
    vi.spyOn(locationService, 'detectBrowserLocation').mockReturnValue(of({ latitude: 23.8, longitude: 90.3 }));
    vi.spyOn(locationService, 'reverse').mockReturnValue(of(mockLocations[0]));

    component.detectCurrentLocation();

    expect(component.selectedFrom()?.id).toBe(1);
    expect(component.isDetectingGps()).toBe(false);
  });
});
