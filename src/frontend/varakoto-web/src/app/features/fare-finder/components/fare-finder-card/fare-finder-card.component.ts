import { Component, OnInit, HostListener, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { LocationService } from '../../../../core/services/location.service';
import { DistrictService } from '../../../../core/services/district.service';
import { FareService } from '../../../../core/services/fare.service';
import { NativeMobileService } from '../../../../core/services/native-mobile.service';
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
  private readonly nativeMobile = inject(NativeMobileService);
  readonly districtService = inject(DistrictService);

  // Output events
  readonly searchSubmitted = output<void>();

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

  // Popular Recommended Transit Hubs in Bangladesh (Instant one-tap selection)
  readonly popularHubs: LocationDto[] = [
    { id: 1, nameEn: 'Mirpur 10', nameBn: 'মিরপুর ১০', displayName: 'মিরপুর ১০, ঢাকা', latitude: 23.8069, longitude: 90.3687, district: 'Dhaka', thana: 'Mirpur', isHub: true, source: 'Hub' },
    { id: 2, nameEn: 'Farmgate', nameBn: 'ফার্মগেট', displayName: 'ফার্মগেট, ঢাকা', latitude: 23.7561, longitude: 90.3872, district: 'Dhaka', thana: 'Tejgaon', isHub: true, source: 'Hub' },
    { id: 3, nameEn: 'Uttara House Building', nameBn: 'উত্তরা হাউস বিল্ডিং', displayName: 'উত্তরা, ঢাকা', latitude: 23.8759, longitude: 90.3984, district: 'Dhaka', thana: 'Uttara', isHub: true, source: 'Hub' },
    { id: 4, nameEn: 'Motijheel', nameBn: 'মতিঝিল', displayName: 'মতিঝিল, ঢাকা', latitude: 23.7330, longitude: 90.4172, district: 'Dhaka', thana: 'Motijheel', isHub: true, source: 'Hub' },
    { id: 5, nameEn: 'Mohakhali', nameBn: 'মহাখালী', displayName: 'মহাখালী, ঢাকা', latitude: 23.7776, longitude: 90.4054, district: 'Dhaka', thana: 'Mohakhali', isHub: true, source: 'Hub' },
    { id: 6, nameEn: 'Shahbagh', nameBn: 'শাহবাগ', displayName: 'শাহবাগ, ঢাকা', latitude: 23.7388, longitude: 90.3955, district: 'Dhaka', thana: 'Shahbagh', isHub: true, source: 'Hub' },
    { id: 7, nameEn: 'Dhanmondi 27', nameBn: 'ধানমন্ডি ২৭', displayName: 'ধানমন্ডি, ঢাকা', latitude: 23.7542, longitude: 90.3768, district: 'Dhaka', thana: 'Dhanmondi', isHub: true, source: 'Hub' },
    { id: 8, nameEn: 'Gulshan 2', nameBn: 'গুলশান ২', displayName: 'গুলশান, ঢাকা', latitude: 23.7949, longitude: 90.4143, district: 'Dhaka', thana: 'Gulshan', isHub: true, source: 'Hub' },
    { id: 12, nameEn: 'Gabtoli', nameBn: 'গাবতলী বাস টার্মিনাল', displayName: 'গাবতলী, ঢাকা', latitude: 23.7820, longitude: 90.3475, district: 'Dhaka', thana: 'Mirpur', isHub: true, source: 'Hub' },
    { id: 13, nameEn: 'Sayedabad', nameBn: 'সায়েদাবাদ বাস টার্মিনাল', displayName: 'সায়েদাবাদ, ঢাকা', latitude: 23.7153, longitude: 90.4284, district: 'Dhaka', thana: 'Jatrabari', isHub: true, source: 'Hub' }
  ];

  ngOnInit(): void {
    // Setup debounced location search for Origin with District context
    this.fromSearchSubject.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      switchMap((term) => {
        const query = term ? term.trim() : '';
        const currentDist = this.districtService.currentDistrict();
        if (query.length === 0) {
          this.isSearchingFrom.set(false);
          this.fromSuggestions.set(this.currentPopularHubs);
          return [];
        }
        this.isSearchingFrom.set(true);
        return this.locationService.search(query, 8, currentDist.nameEn, currentDist.center);
      })
    ).subscribe((results) => {
      if (results && results.length > 0) {
        // Smartly merge remote results with instant local matches
        const currentLocal = this.fromSuggestions();
        const seen = new Set(currentLocal.map(l => (l.nameBn || l.displayName).toLowerCase().trim()));
        const merged = [...currentLocal];
        for (const rem of results) {
          const key = (rem.nameBn || rem.displayName).toLowerCase().trim();
          if (!seen.has(key)) {
            seen.add(key);
            merged.push(rem);
          }
        }
        this.fromSuggestions.set(merged.slice(0, 10));
      } else if (this.fromQuery().trim().length === 0) {
        this.fromSuggestions.set(this.currentPopularHubs);
      }
      this.isSearchingFrom.set(false);
      this.showFromDropdown.set(true);
    });

    // Setup debounced location search for Destination with District context
    this.toSearchSubject.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      switchMap((term) => {
        const query = term ? term.trim() : '';
        const currentDist = this.districtService.currentDistrict();
        if (query.length === 0) {
          this.isSearchingTo.set(false);
          this.toSuggestions.set(this.currentPopularHubs);
          return [];
        }
        this.isSearchingTo.set(true);
        return this.locationService.search(query, 8, currentDist.nameEn, currentDist.center);
      })
    ).subscribe((results) => {
      if (results && results.length > 0) {
        // Smartly merge remote results with instant local matches
        const currentLocal = this.toSuggestions();
        const seen = new Set(currentLocal.map(l => (l.nameBn || l.displayName).toLowerCase().trim()));
        const merged = [...currentLocal];
        for (const rem of results) {
          const key = (rem.nameBn || rem.displayName).toLowerCase().trim();
          if (!seen.has(key)) {
            seen.add(key);
            merged.push(rem);
          }
        }
        this.toSuggestions.set(merged.slice(0, 10));
      } else if (this.toQuery().trim().length === 0) {
        this.toSuggestions.set(this.currentPopularHubs);
      }
      this.isSearchingTo.set(false);
      this.showToDropdown.set(true);
    });
  }

  get currentPopularHubs(): LocationDto[] {
    return this.districtService.getPopularHubsForCurrentDistrict();
  }

  openDistrictSelector(): void {
    this.districtService.openModal();
  }

  private scrollFieldToTop(elementId: string): void {
    if (typeof window === 'undefined') return;
    const performScroll = () => {
      const el = document.getElementById(elementId);
      if (!el) return;
      const inputGroup = el.closest('.input-group') || el;
      const rect = inputGroup.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      // Position the field ~74px from top (below sticky header) for maximum visibility and room for dropdown above keyboard
      const targetY = scrollTop + rect.top - 74;
      window.scrollTo({
        top: Math.max(0, targetY),
        behavior: 'smooth'
      });
    };

    performScroll();
    setTimeout(performScroll, 180);
    setTimeout(performScroll, 350);
  }

  onFromFocus(): void {
    this.showFromDropdown.set(true);
    this.showToDropdown.set(false);
    if (!this.fromQuery() || this.fromQuery().trim().length < 2) {
      this.fromSuggestions.set(this.currentPopularHubs);
    }
    this.scrollFieldToTop('origin-input');
  }

  onToFocus(): void {
    this.showToDropdown.set(true);
    this.showFromDropdown.set(false);
    if (!this.toQuery() || this.toQuery().trim().length < 2) {
      this.toSuggestions.set(this.currentPopularHubs);
    }
    this.scrollFieldToTop('destination-input');
  }

  onFromInput(value: string): void {
    this.fromQuery.set(value);
    this.validationMessage.set(null);
    if (this.selectedFrom() && this.selectedFrom()?.displayName !== value) {
      this.selectedFrom.set(null);
    }
    const currentDist = this.districtService.currentDistrict();
    if (!value || value.trim().length === 0) {
      this.fromSuggestions.set(this.currentPopularHubs);
    } else {
      // Instant 0ms local match!
      const localMatches = this.locationService.searchLocalHubs(value, currentDist.id);
      if (localMatches.length > 0) {
        this.fromSuggestions.set(localMatches);
      }
    }
    this.showFromDropdown.set(true);
    this.fromSearchSubject.next(value);
  }

  onToInput(value: string): void {
    this.toQuery.set(value);
    this.validationMessage.set(null);
    if (this.selectedTo() && this.selectedTo()?.displayName !== value) {
      this.selectedTo.set(null);
    }
    const currentDist = this.districtService.currentDistrict();
    if (!value || value.trim().length === 0) {
      this.toSuggestions.set(this.currentPopularHubs);
    } else {
      // Instant 0ms local match!
      const localMatches = this.locationService.searchLocalHubs(value, currentDist.id);
      if (localMatches.length > 0) {
        this.toSuggestions.set(localMatches);
      }
    }
    this.showToDropdown.set(true);
    this.toSearchSubject.next(value);
  }

  // Dropdown Scroll & Touch State Management
  private isInteractingWithDropdown = false;
  private dropdownTouchStartY = 0;
  private dropdownTouchStartX = 0;
  private dropdownHasScrolled = false;

  @HostListener('document:touchstart', ['$event'])
  @HostListener('document:click', ['$event'])
  onDocumentInteraction(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target) return;
    if (!target.closest('.input-group')) {
      this.showFromDropdown.set(false);
      this.showToDropdown.set(false);
      this.isInteractingWithDropdown = false;
    }
  }

  onDropdownPointerDown(event: PointerEvent): void {
    // Crucial on mobile: prevents input blur and keyboard collapse while scrolling
    event.preventDefault();
    this.isInteractingWithDropdown = true;
  }

  onDropdownTouchStart(event: TouchEvent): void {
    this.isInteractingWithDropdown = true;
    if (event.touches && event.touches.length > 0) {
      this.dropdownTouchStartY = event.touches[0].clientY;
      this.dropdownTouchStartX = event.touches[0].clientX;
      this.dropdownHasScrolled = false;
    }
  }

  onDropdownTouchMove(event: TouchEvent): void {
    this.isInteractingWithDropdown = true;
    if (event.touches && event.touches.length > 0) {
      const deltaY = Math.abs(event.touches[0].clientY - this.dropdownTouchStartY);
      const deltaX = Math.abs(event.touches[0].clientX - this.dropdownTouchStartX);
      if (deltaY > 6 || deltaX > 6) {
        this.dropdownHasScrolled = true;
      }
    }
  }

  onDropdownTouchEnd(): void {
    setTimeout(() => {
      this.isInteractingWithDropdown = false;
    }, 350);
  }

  onItemSelect(event: Event, loc: LocationDto, field: 'from' | 'to'): void {
    // If user dragged/scrolled the list, suppress selection completely!
    if (this.dropdownHasScrolled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (field === 'from') {
      this.selectFrom(loc);
    } else {
      this.selectTo(loc);
    }
    this.isInteractingWithDropdown = false;
  }

  // Backward compatibility alias for any existing spec tests
  onSelectFromItem(loc: LocationDto): void {
    this.selectFrom(loc);
  }

  onSelectToItem(loc: LocationDto): void {
    this.selectTo(loc);
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

    this.nativeMobile.hapticImpact('light');
    this.locationService.detectBrowserLocation().pipe(
      switchMap((coords) =>
        this.locationService.reverse(coords.latitude, coords.longitude).pipe(
          map((loc) => ({ loc, coords }))
        )
      )
    ).subscribe({
      next: ({ loc, coords }) => {
        this.isDetectingGps.set(false);
        if (loc) {
          this.selectFrom(loc);
          this.nativeMobile.hapticSuccess();
        } else {
          const fallbackLoc: LocationDto = {
            nameBn: 'আমার বর্তমান অবস্থান',
            nameEn: 'My Current Location',
            displayName: `বর্তমান অবস্থান (${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)})`,
            latitude: coords.latitude,
            longitude: coords.longitude,
            isHub: false,
            source: 'GPS'
          };
          this.selectFrom(fallbackLoc);
          this.nativeMobile.hapticSuccess();
        }
      },
      error: (err: any) => {
        this.isDetectingGps.set(false);
        const errMsg = err?.message || 'জিপিএস সংযোগ পাওয়া যায়নি। ফোনের লোকেশন অন করুন অথবা নিচে ম্যাপে স্থান পিন করুন।';
        this.gpsError.set(errMsg);
      }
    });
  }

  selectRouteMode(mode: 'best' | 'alt'): void {
    this.nativeMobile.hapticSelection();
    this.fareService.setRouteMode(mode);
  }

  selectTransport(code: TransportCode): void {
    this.nativeMobile.hapticSelection();
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
        (from == null || s.id !== from.id) &&
        (s.nameBn.toLowerCase().includes(toText.toLowerCase()) || 
         s.nameEn.toLowerCase().includes(toText.toLowerCase()) ||
         toText.toLowerCase().includes(s.nameBn.toLowerCase()))
      );
      if (match) {
        to = match;
        this.selectedTo.set(match);
      }
    }

    // If different text was typed, prevent accidental same location ID
    if (from && to && from.id && to.id && from.id === to.id && fromText.toLowerCase() !== toText.toLowerCase()) {
      to = null;
    }

    if (fromText.toLowerCase() === toText.toLowerCase()) {
      this.validationMessage.set('যাত্রার স্থান এবং গন্তব্য ভিন্ন হতে হবে');
      return;
    }

    this.validationMessage.set(null);
    this.nativeMobile.hapticImpact('medium');
    this.searchSubmitted.emit();

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
    // Generous delay for mobile touch taps to complete before hiding
    setTimeout(() => {
      this.showFromDropdown.set(false);
      this.showToDropdown.set(false);
    }, 350);
  }
}
