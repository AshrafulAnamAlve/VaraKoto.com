import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { LocationService } from '../../../../core/services/location.service';
import { FareService } from '../../../../core/services/fare.service';
import { LocationDto } from '../../../../core/models/location.model';
import { TransportCode } from '../../../../core/models/fare.model';
import { MapPickerModalComponent, SelectedMapLocation } from '../../../../shared/components/map-picker-modal/map-picker-modal.component';

@Component({
  selector: 'app-fare-finder-card',
  standalone: true,
  imports: [CommonModule, FormsModule, MapPickerModalComponent],
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

  // Map Picker Modal Signals
  readonly isMapPickerOpen = signal<boolean>(false);
  readonly mapPickerField = signal<'from' | 'to'>('from');
  readonly mapPickerTitle = signal<string>('ম্যাপ থেকে স্থান নির্বাচন করুন');

  // Manual Distance Option
  readonly isManualDistanceActive = signal<boolean>(false);
  readonly manualDistance = signal<number | null>(null);

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
      this.showFromDropdown.set(true);
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
      this.showToDropdown.set(true);
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

  openMapPicker(field: 'from' | 'to'): void {
    this.mapPickerField.set(field);
    this.mapPickerTitle.set(field === 'from' ? 'যাত্রার শুরুর স্থান ম্যাপে নির্বাচন করুন 📍' : 'গন্তব্য স্থান ম্যাপে নির্বাচন করুন 🏁');
    this.isMapPickerOpen.set(true);
    this.showFromDropdown.set(false);
    this.showToDropdown.set(false);
  }

  onLocationPickedFromMap(loc: SelectedMapLocation): void {
    const locDto: LocationDto = {
      nameEn: loc.name,
      nameBn: loc.name,
      displayName: loc.displayName,
      latitude: loc.latitude,
      longitude: loc.longitude,
      isHub: false,
      source: 'MapPicker'
    };

    if (this.mapPickerField() === 'from') {
      this.selectedFrom.set(locDto);
      this.fromQuery.set(loc.name);
    } else {
      this.selectedTo.set(locDto);
      this.toQuery.set(loc.name);
    }
    this.validationMessage.set(null);
  }

  toggleManualDistance(): void {
    this.isManualDistanceActive.update(v => !v);
  }

  enableManualDistance(): void {
    this.isManualDistanceActive.set(true);
    this.showFromDropdown.set(false);
    this.showToDropdown.set(false);
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
          this.gpsError.set('লোকেশন সনাক্ত করা সম্ভব হয়নি। নাম লিখে সার্চ করুন বা ম্যাপে পিন করুন।');
        }
      },
      error: () => {
        this.isDetectingGps.set(false);
        this.gpsError.set('লোকেশন পারমিশন দেওয়া হয়নি। ম্যানুয়ালি নাম লিখুন বা ম্যাপে পিন করুন।');
      }
    });
  }

  selectTransport(code: TransportCode): void {
    this.fareService.setSelectedTransport(code);
  }

  onFindFare(): void {
    let from = this.selectedFrom();
    let to = this.selectedTo();
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

    // Auto-resolve from suggestions if user typed text without selecting from dropdown
    if (!from && this.fromSuggestions().length > 0) {
      const match = this.fromSuggestions().find(s => 
        s.nameBn.toLowerCase().includes(fromText.toLowerCase()) || 
        s.nameEn.toLowerCase().includes(fromText.toLowerCase()) ||
        fromText.toLowerCase().includes(s.nameBn.toLowerCase())
      ) || this.fromSuggestions()[0];
      from = match;
      this.selectedFrom.set(match);
    }

    if (!to && this.toSuggestions().length > 0) {
      const match = this.toSuggestions().find(s => 
        s.nameBn.toLowerCase().includes(toText.toLowerCase()) || 
        s.nameEn.toLowerCase().includes(toText.toLowerCase()) ||
        toText.toLowerCase().includes(s.nameBn.toLowerCase())
      ) || this.toSuggestions()[0];
      to = match;
      this.selectedTo.set(match);
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

    const manualDist = this.isManualDistanceActive() && this.manualDistance() && this.manualDistance()! > 0
      ? this.manualDistance()!
      : undefined;

    this.fareService.calculateFare({
      fromLocationId: from?.id,
      toLocationId: to?.id,
      fromName: from?.displayName || fromText,
      fromLatitude: from?.latitude,
      fromLongitude: from?.longitude,
      toName: to?.displayName || toText,
      toLatitude: to?.latitude,
      toLongitude: to?.longitude,
      transportCode: this.fareService.selectedTransport(),
      manualDistanceKm: manualDist
    }).subscribe({
      error: (err) => {
        this.validationMessage.set(err.message || 'ভাড়া নির্ধারণ করা সম্ভব হয়নি। ম্যাপ থেকে পিন করুন অথবা আনুমানিক দূরত্ব লিখুন।');
      }
    });
  }

  closeDropdowns(): void {
    // Delay hiding dropdown slightly so click events on suggestion items register
    setTimeout(() => {
      this.showFromDropdown.set(false);
      this.showToDropdown.set(false);
    }, 250);
  }
}
