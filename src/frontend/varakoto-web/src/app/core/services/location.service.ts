import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LocationDto, DistanceResultDto } from '../models/location.model';
import { environment } from '../../../environments/environment';
import { NativeMobileService } from './native-mobile.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private readonly http = inject(HttpClient);
  private readonly nativeMobile = inject(NativeMobileService);
  private readonly apiUrl = environment.apiUrl;

  search(
    query: string,
    limit: number = 8,
    districtName?: string,
    centerCoords?: { lat: number; lng: number }
  ): Observable<LocationDto[]> {
    if (!query || query.trim().length === 0) {
      return of([]);
    }

    const trimmed = query.trim();
    let params = new HttpParams()
      .set('q', trimmed)
      .set('limit', limit.toString());

    if (districtName) {
      params = params.set('district', districtName);
    }

    return this.http.get<LocationDto[]>(`${this.apiUrl}/locations/search`, { params }).pipe(
      map(results => {
        return this.rankByDistrict(results, districtName, centerCoords);
      }),
      catchError(error => {
        console.warn('Backend location search error, attempting direct client fallback:', error);
        return this.searchPhotonDirect(trimmed, limit, districtName, centerCoords);
      })
    );
  }

  private searchPhotonDirect(
    query: string,
    limit: number,
    districtName?: string,
    centerCoords?: { lat: number; lng: number }
  ): Observable<LocationDto[]> {
    let photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&bbox=88.0,20.5,92.7,26.7&limit=${limit}`;
    if (centerCoords) {
      photonUrl += `&lat=${centerCoords.lat}&lon=${centerCoords.lng}`;
    }

    return this.http.get<any>(photonUrl).pipe(
      map(data => {
        const features = data?.features || [];
        const mapped: LocationDto[] = features.map((f: any) => {
          const coords = f.geometry?.coordinates || [0, 0];
          const props = f.properties || {};
          const name = props.name || query;
          const district = props.city || props.district || props.county || props.state || districtName || 'Bangladesh';
          return {
            nameEn: name,
            nameBn: name,
            displayName: `${name}, ${district}`,
            latitude: coords[1],
            longitude: coords[0],
            district: district,
            isHub: false,
            source: 'Geocoding'
          };
        });

        return this.rankByDistrict(mapped, districtName, centerCoords);
      }),
      catchError(() => of([]))
    );
  }

  private rankByDistrict(
    results: LocationDto[],
    districtName?: string,
    centerCoords?: { lat: number; lng: number }
  ): LocationDto[] {
    if (!results || results.length <= 1) return results;
    if (!districtName && !centerCoords) return results;

    const normDistrict = (districtName || '').toLowerCase().trim();

    return [...results].sort((a, b) => {
      // 1. Check direct district text matching
      const aMatchesDistrict = (
        (a.district && a.district.toLowerCase().includes(normDistrict)) ||
        (a.displayName && a.displayName.toLowerCase().includes(normDistrict)) ||
        (a.nameBn && a.nameBn.toLowerCase().includes(normDistrict)) ||
        (a.nameEn && a.nameEn.toLowerCase().includes(normDistrict))
      ) ? 1 : 0;

      const bMatchesDistrict = (
        (b.district && b.district.toLowerCase().includes(normDistrict)) ||
        (b.displayName && b.displayName.toLowerCase().includes(normDistrict)) ||
        (b.nameBn && b.nameBn.toLowerCase().includes(normDistrict)) ||
        (b.nameEn && b.nameEn.toLowerCase().includes(normDistrict))
      ) ? 1 : 0;

      if (aMatchesDistrict !== bMatchesDistrict) {
        return bMatchesDistrict - aMatchesDistrict; // District matches come first!
      }

      // 2. If center coords available, sort closer locations first
      if (centerCoords) {
        const distA = Math.hypot(a.latitude - centerCoords.lat, a.longitude - centerCoords.lng);
        const distB = Math.hypot(b.latitude - centerCoords.lat, b.longitude - centerCoords.lng);
        return distA - distB;
      }

      return 0;
    });
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
    return from(this.nativeMobile.getCurrentPosition());
  }

  private calculateHaversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const factor = 1.28; // Road curvature
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
