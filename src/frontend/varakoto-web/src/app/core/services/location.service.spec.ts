import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { LocationService } from './location.service';
import { LocationDto, DistanceResultDto } from '../models/location.model';
import { environment } from '../../../environments/environment';

describe('LocationService', () => {
  let service: LocationService;
  let httpTesting: HttpTestingController;
  const baseUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        LocationService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(LocationService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return empty list when searching with empty query', () => {
    service.search('').subscribe(results => {
      expect(results).toEqual([]);
    });

    httpTesting.expectNone(`${baseUrl}/locations/search`);
  });

  it('should query backend API when searching valid text', () => {
    const mockLocations: LocationDto[] = [
      {
        id: 1,
        nameEn: 'Mirpur 10',
        nameBn: 'মিরপুর ১০',
        displayName: 'মিরপুর ১০ (Mirpur 10), Dhaka',
        latitude: 23.8069,
        longitude: 90.3687,
        district: 'Dhaka',
        isHub: true,
        source: 'Database'
      }
    ];

    service.search('Mirpur', 5).subscribe(results => {
      expect(results.length).toBe(1);
      expect(results[0].nameEn).toBe('Mirpur 10');
    });

    const req = httpTesting.expectOne(`${baseUrl}/locations/search?q=Mirpur&limit=5`);
    expect(req.request.method).toBe('GET');
    req.flush(mockLocations);
  });

  it('should call reverse geocoding API with coordinates', () => {
    const mockLocation: LocationDto = {
      id: 2,
      nameEn: 'Farmgate',
      nameBn: 'ফার্মগেট',
      displayName: 'ফার্মগেট (Farmgate), Dhaka',
      latitude: 23.7571,
      longitude: 90.3895,
      district: 'Dhaka',
      isHub: true,
      source: 'Database'
    };

    service.reverse(23.7571, 90.3895).subscribe(result => {
      expect(result).toBeTruthy();
      expect(result?.nameEn).toBe('Farmgate');
    });

    const req = httpTesting.expectOne(`${baseUrl}/locations/reverse?lat=23.7571&lng=90.3895`);
    expect(req.request.method).toBe('GET');
    req.flush(mockLocation);
  });

  it('should call route distance API with endpoints', () => {
    const mockDistance: DistanceResultDto = {
      distanceKm: 7.5,
      durationMinutes: 22,
      source: 'OSRM',
      isEstimatedRoute: false
    };

    service.getDistance(23.8069, 90.3687, 23.7571, 90.3895, 1, 2).subscribe(result => {
      expect(result.distanceKm).toBe(7.5);
      expect(result.source).toBe('OSRM');
    });

    const req = httpTesting.expectOne(`${baseUrl}/routes/distance?fromLat=23.8069&fromLng=90.3687&toLat=23.7571&toLng=90.3895&fromId=1&toId=2`);
    expect(req.request.method).toBe('GET');
    req.flush(mockDistance);
  });
});
