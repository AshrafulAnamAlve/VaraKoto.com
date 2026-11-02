import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LocationDto, DistanceResultDto } from '../models/location.model';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private readonly http = inject(HttpClient);
  // Default to relative /api or configurable environment URL
  private readonly apiUrl = 'http://localhost:5000/api';

  search(query: string, limit: number = 8): Observable<LocationDto[]> {
    if (!query || query.trim().length === 0) {
      return of([]);
    }

    const params = new HttpParams()
      .set('q', query.trim())
      .set('limit', limit.toString());

    return this.http.get<LocationDto[]>(`${this.apiUrl}/locations/search`, { params }).pipe(
      catchError(error => {
        console.warn('Location search error:', error);
        return of([]);
      })
    );
  }

  reverse(lat: number, lng: number): Observable<LocationDto | null> {
    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lng', lng.toString());

    return this.http.get<LocationDto>(`${this.apiUrl}/locations/reverse`, { params }).pipe(
      catchError(error => {
        console.warn('Reverse geocoding error:', error);
        return of(null);
      })
    );
  }

  getDistance(
    fromLat: number,
    fromLng: number,
    toLat: number,
    toLng: number,
    fromId?: number | null,
    toId?: number | null
  ): Observable<DistanceResultDto> {
    let params = new HttpParams()
      .set('fromLat', fromLat.toString())
      .set('fromLng', fromLng.toString())
      .set('toLat', toLat.toString())
      .set('toLng', toLng.toString());

    if (fromId) params = params.set('fromId', fromId.toString());
    if (toId) params = params.set('toId', toId.toString());

    return this.http.get<DistanceResultDto>(`${this.apiUrl}/routes/distance`, { params }).pipe(
      catchError(error => {
        console.warn('Distance calculation error, computing client fallback:', error);
        // Fallback distance calculation client-side if API offline
        const clientDist = this.calculateHaversine(fromLat, fromLng, toLat, toLng);
        return of({
          distanceKm: clientDist,
          durationMinutes: Math.round((clientDist / 20) * 60),
          source: 'ClientHaversineFallback',
          isEstimatedRoute: true
        });
      })
    );
  }

  detectBrowserLocation(): Observable<{ latitude: number; longitude: number }> {
    return new Observable(observer => {
      if (typeof window === 'undefined' || !navigator.geolocation) {
        observer.error(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        position => {
          observer.next({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          observer.complete();
        },
        error => {
          observer.error(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 60000
        }
      );
    });
  }

  private calculateHaversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const factor = 1.28; // Dhaka road curvature
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(Math.max(R * c * factor, 0.5) * 100) / 100;
  }
}
