import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { LocationService } from '../../../../core/services/location.service';
import { FareService } from '../../../../core/services/fare.service';
import { LocationDto } from '../../../../core/models/location.model';
import { TransportCode } from '../../../../core/models/fare.model';

@Component({
  selector: 'app-fare-finder-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fare-finder-card.component.html',
  styleUrls: ['./fare-finder-card.component.scss']
})
export class FareFinderCardComponent implements OnInit {
  private readonly locationService = inject(LocationService);
  readonly fareService = inject(FareService);

  // Form Signals
  readonly fromQuery = signal<string>('');
  readonly toQuery = signal<string>('');
  readonly selectedFrom = signal<LocationDto | null>(null);
  readonly selectedTo = signal<LocationDto | null>(null);

  // Autocomplete Suggestions
  readonly fromSuggestions = signal<LocationDto[]>([]);
  readonly toSuggestions = signal<LocationDto[]>([]);
  readonly isSearchingFrom = signal<boolean>(false);
  readonly isSearchingTo = signal<boolean>(false);
  readonly showFromDropdown = signal<boolean>(false);
  readonly showToDropdown = signal<boolean>(false);

  // Geolocation detection
  readonly isDetectingGps = signal<boolean>(false);
  readonly gpsError = signal<string | null>(null);
  readonly validationMessage = signal<string | null>(null);

  // Search Debouncers
  private readonly fromSearchSubject = new Subject<string>();
  private readonly toSearchSubject = new Subject<string>();

  // Transport Options
  readonly transports: { code: TransportCode; nameEn: string; nameBn: string }[] = [
    { code: 'bus', nameEn: 'Bus', nameBn: 'বাস' },
    { code: 'rickshaw', nameEn: 'Rickshaw', nameBn: 'রিকশা' },
    { code: 'cng', nameEn: 'CNG', nameBn: 'সিএনজি' },
    { code: 'bike', nameEn: 'Bike', nameBn: 'বাইক' }
  ];

  ngOnInit(): void {
    // Setup debounced location search for Origin
    this.fromSearchSubject.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      switchMap((term) => {
        if (!term || term.trim().length < 2) {
          this.isSearchingFrom.set(false);
          return [];
        }
        this.isSearchingFrom.set(true);
        return this.locationService.search(term, 6);
      })
    ).subscribe((results) => {
      this.fromSuggestions.set(results);
      this.isSearchingFrom.set(false);
      this.showFromDropdown.set(results.length > 0);
    });

    // Setup debounced location search for Destination
    this.toSearchSubject.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      switchMap((term) => {
        if (!term || term.trim().length < 2) {
          this.isSearchingTo.set(false);
          return [];
        }
        this.isSearchingTo.set(true);
        return this.locationService.search(term, 6);
      })
    ).subscribe((results) => {
      this.toSuggestions.set(results);
      this.isSearchingTo.set(false);
      this.showToDropdown.set(results.length > 0);
    });
  }

  onFromInput(value: string): void {
    this.fromQuery.set(value);
    this.validationMessage.set(null);
    if (this.selectedFrom() && this.selectedFrom()?.displayName !== value) {
      this.selectedFrom.set(null);
    }
    this.fromSearchSubject.next(value);
  }

  onToInput(value: string): void {
    this.toQuery.set(value);
    this.validationMessage.set(null);
    if (this.selectedTo() && this.selectedTo()?.displayName !== value) {
      this.selectedTo.set(null);
    }
    this.toSearchSubject.next(value);
  }

  selectFrom(loc: LocationDto): void {
    this.selectedFrom.set(loc);
    this.fromQuery.set(loc.nameBn || loc.displayName || loc.nameEn);
    this.showFromDropdown.set(false);
    this.fromSuggestions.set([]);
  }

  selectTo(loc: LocationDto): void {
    this.selectedTo.set(loc);
    this.toQuery.set(loc.nameBn || loc.displayName || loc.nameEn);
    this.showToDropdown.set(false);
    this.toSuggestions.set([]);
  }

  clearFrom(): void {
    this.fromQuery.set('');
    this.selectedFrom.set(null);
    this.showFromDropdown.set(false);
    this.fromSuggestions.set([]);
  }

  clearTo(): void {
    this.toQuery.set('');
    this.selectedTo.set(null);
    this.showToDropdown.set(false);
    this.toSuggestions.set([]);
  }

  swapLocations(): void {
    const tempQuery = this.fromQuery();
    const tempSelected = this.selectedFrom();

    this.fromQuery.set(this.toQuery());
    this.selectedFrom.set(this.selectedTo());

    this.toQuery.set(tempQuery);
    this.selectedTo.set(tempSelected);

    this.showFromDropdown.set(false);
    this.showToDropdown.set(false);

    // If a calculation was already made, recalculate automatically
    if (this.fareService.latestResult()) {
      this.onFindFare();
    }
  }

  detectCurrentLocation(): void {
    this.isDetectingGps.set(true);
    this.gpsError.set(null);

    this.locationService.detectBrowserLocation().pipe(
      switchMap((coords) => this.locationService.reverse(coords.latitude, coords.longitude))
    ).subscribe({
      next: (loc) => {
        this.isDetectingGps.set(false);
        if (loc) {
          this.selectFrom(loc);
        } else {
          this.gpsError.set('লোকেশন সনাক্ত করা সম্ভব হয়নি। নাম লিখে সার্চ করুন।');
        }
      },
      error: () => {
        this.isDetectingGps.set(false);
        this.gpsError.set('লোকেশন পারমিশন দেওয়া হয়নি। ম্যানুয়ালি নাম লিখুন।');
      }
    });
  }

  selectTransport(code: TransportCode): void {
    this.fareService.setSelectedTransport(code);
  }

  onFindFare(): void {
    const from = this.selectedFrom();
    const to = this.selectedTo();
    const fromText = this.fromQuery().trim();
    const toText = this.toQuery().trim();

    if (!fromText) {
      this.validationMessage.set('কোথা থেকে যাবেন (Starting location) নির্বাচন করুন');
      return;
    }

    if (!toText) {
      this.validationMessage.set('কোথায় যাবেন (Destination) নির্বাচন করুন');
      return;
    }

    if (from && to && from.id && to.id && from.id === to.id) {
      this.validationMessage.set('যাত্রার স্থান এবং গন্তব্য ভিন্ন হতে হবে');
      return;
    }

    if (fromText.toLowerCase() === toText.toLowerCase()) {
      this.validationMessage.set('যাত্রার স্থান এবং গন্তব্য ভিন্ন হতে হবে');
      return;
    }

    this.validationMessage.set(null);

    this.fareService.calculateFare({
      fromLocationId: from?.id,
      toLocationId: to?.id,
      fromName: fromText,
      fromLatitude: from?.latitude,
      fromLongitude: from?.longitude,
      toName: toText,
      toLatitude: to?.latitude,
      toLongitude: to?.longitude,
      transportCode: this.fareService.selectedTransport()
    }).subscribe();
  }

  closeDropdowns(): void {
    // Delay hiding dropdown slightly so click events on suggestion items register
    setTimeout(() => {
      this.showFromDropdown.set(false);
      this.showToDropdown.set(false);
    }, 200);
  }
}
