import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, finalize, map, of, tap, throwError } from 'rxjs';
import {
  FareBreakdownModel,
  FareCalculationRequestModel,
  FareCalculationResultModel,
  TransportCode,
  TransportTypeInfo
} from '../models/fare.model';

@Injectable({
  providedIn: 'root'
})
export class FareService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5242/api/fares';

  // Reactive State Signals
  readonly selectedTransport = signal<TransportCode>('bus');
  readonly latestResult = signal<FareCalculationResultModel | null>(null);
  readonly isCalculating = signal<boolean>(false);
  readonly calculationError = signal<string | null>(null);
  readonly transportTypes = signal<TransportTypeInfo[]>([]);

  /**
   * Sets the currently selected transport mode
   */
  setSelectedTransport(transport: TransportCode): void {
    this.selectedTransport.set(transport);
    
    // If we already have results, update the primary fare
    const current = this.latestResult();
    if (current && current.allFares?.length) {
      const match = current.allFares.find(f => f.transportCode === transport);
      if (match) {
        this.latestResult.set({
          ...current,
          primaryFare: match
        });
      }
    }
  }

  /**
   * Calculates fares by calling the backend API
   */
  calculateFare(request: FareCalculationRequestModel): Observable<FareCalculationResultModel> {
    this.isCalculating.set(true);
    this.calculationError.set(null);

    const payload: FareCalculationRequestModel = {
      ...request,
      transportCode: request.transportCode || this.selectedTransport(),
      includeAllTransports: true
    };

    return this.http.post<FareCalculationResultModel>(`${this.apiUrl}/calculate`, payload).pipe(
      tap((result) => {
        this.latestResult.set(result);
      }),
      catchError((error) => {
        const errorMsg = error.error?.message || 'ভাড়া হিসেব করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।';
        this.calculationError.set(errorMsg);
        return throwError(() => new Error(errorMsg));
      }),
      finalize(() => {
        this.isCalculating.set(false);
      })
    );
  }

  /**
   * Fetches active transport options from the backend
   */
  loadTransportTypes(): Observable<TransportTypeInfo[]> {
    return this.http.get<TransportTypeInfo[]>(`${this.apiUrl}/transports`).pipe(
      tap((types) => {
        this.transportTypes.set(types);
      }),
      catchError(() => {
        // Fallback default transports if backend is temporarily unreachable
        const fallbacks: TransportTypeInfo[] = [
          { id: 1, code: 'bus', nameEn: 'Bus', nameBn: 'বাস', iconKey: 'directions_bus', displayOrder: 1 },
          { id: 2, code: 'rickshaw', nameEn: 'Rickshaw', nameBn: 'রিকশা', iconKey: 'pedal_bike', displayOrder: 2 },
          { id: 3, code: 'cng', nameEn: 'CNG', nameBn: 'সিএনজি', iconKey: 'electric_rickshaw', displayOrder: 3 },
          { id: 4, code: 'bike', nameEn: 'Bike', nameBn: 'বাইক', iconKey: 'two_wheeler', displayOrder: 4 }
        ];
        this.transportTypes.set(fallbacks);
        return of(fallbacks);
      })
    );
  }

  /**
   * Gets quick fare estimations for a given road distance
   */
  estimateForDistance(distanceKm: number, durationMinutes?: number): Observable<FareBreakdownModel[]> {
    let url = `${this.apiUrl}/estimate-for-distance?distanceKm=${distanceKm}`;
    if (durationMinutes !== undefined) {
      url += `&durationMinutes=${durationMinutes}`;
    }
    return this.http.get<FareBreakdownModel[]>(url);
  }

  /**
   * Converts English numeral characters to Bengali numerals
   */
  toBengaliDigits(input: string | number): string {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(input).replace(/[0-9]/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
  }

  /**
   * Clears the current calculation results
   */
  clearResult(): void {
    this.latestResult.set(null);
    this.calculationError.set(null);
  }
}
