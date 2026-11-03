import { Component, OnInit, OnDestroy, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { FareService } from '../../../../core/services/fare.service';
import { LocationService } from '../../../../core/services/location.service';
import { FareContributionRequestModel, FareContributionResponseModel, TransportCode } from '../../../../core/models/fare.model';
import { LocationDto } from '../../../../core/models/location.model';
import { MapPickerModalComponent, SelectedMapLocation } from '../../../../shared/components/map-picker-modal/map-picker-modal.component';

@Component({
  selector: 'app-fare-contribution-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MapPickerModalComponent],
  templateUrl: './fare-contribution-modal.component.html',
  styleUrls: ['./fare-contribution-modal.component.scss']
})
export class FareContributionModalComponent implements OnInit, OnDestroy {
  private readonly fareService = inject(FareService);
  private readonly locationService = inject(LocationService);

  // Inputs
  readonly isOpen = input<boolean>(false);
  readonly initialFrom = input<string>('');
  readonly initialTo = input<string>('');
  readonly initialTransport = input<TransportCode>('bus');

  // Outputs
  readonly closeModal = output<void>();
  readonly fareContributed = output<FareContributionResponseModel>();

  // State Signals
  readonly fromText = signal<string>('');
  readonly toText = signal<string>('');
  readonly selectedFrom = signal<LocationDto | null>(null);
  readonly selectedTo = signal<LocationDto | null>(null);

  // Autocomplete Suggestions
  readonly fromSuggestions = signal<LocationDto[]>([]);
  readonly toSuggestions = signal<LocationDto[]>([]);
  readonly isSearchingFrom = signal<boolean>(false);
  readonly isSearchingTo = signal<boolean>(false);
  readonly showFromDropdown = signal<boolean>(false);
  readonly showToDropdown = signal<boolean>(false);

  // Map Picker Modal Signals
  readonly isMapPickerOpen = signal<boolean>(false);
  readonly mapPickerField = signal<'from' | 'to'>('from');
  readonly mapPickerTitle = signal<string>('ম্যাপ থেকে স্থান নির্বাচন করুন');

  // Manual Distance Option
  readonly isManualDistanceActive = signal<boolean>(false);
  readonly manualDistance = signal<number | null>(null);

  readonly transportCode = signal<TransportCode>('bus');
  readonly actualFare = signal<number | null>(null);
  readonly travelDate = signal<string>(new Date().toISOString().split('T')[0]);

  readonly isSubmitting = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successData = signal<FareContributionResponseModel | null>(null);

  private readonly fromSearchSubject = new Subject<string>();
  private readonly toSearchSubject = new Subject<string>();
  private readonly subs: Subscription[] = [];

  readonly transports: { code: TransportCode; labelBn: string; icon: string }[] = [
    { code: 'bus', labelBn: 'বাস', icon: '🚌' },
    { code: 'rickshaw', labelBn: 'রিকশা', icon: '🛺' },
    { code: 'cng', labelBn: 'সিএনজি', icon: '🛺' },
    { code: 'bike', labelBn: 'বাইক', icon: '🏍️' }
  ];

  constructor() {
    effect(() => {
      const from = this.initialFrom();
      const to = this.initialTo();
      const tr = this.initialTransport();
      const open = this.isOpen();

      if (open) {
        if (from) this.fromText.set(from);
        if (to) this.toText.set(to);
        if (tr) this.transportCode.set(tr);
        this.errorMessage.set(null);
        this.successData.set(null);
        this.actualFare.set(null);
        this.showFromDropdown.set(false);
        this.showToDropdown.set(false);
      }
    });
  }

  ngOnInit(): void {
    const fromSub = this.fromSearchSubject.pipe(
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

    const toSub = this.toSearchSubject.pipe(
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

    this.subs.push(fromSub, toSub);
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  onFromInput(value: string): void {
    this.fromText.set(value);
    this.errorMessage.set(null);
    if (this.selectedFrom() && this.selectedFrom()?.displayName !== value && this.selectedFrom()?.nameBn !== value) {
      this.selectedFrom.set(null);
    }
    this.fromSearchSubject.next(value);
  }

  onToInput(value: string): void {
    this.toText.set(value);
    this.errorMessage.set(null);
    if (this.selectedTo() && this.selectedTo()?.displayName !== value && this.selectedTo()?.nameBn !== value) {
      this.selectedTo.set(null);
    }
    this.toSearchSubject.next(value);
  }

  selectFrom(loc: LocationDto): void {
    this.selectedFrom.set(loc);
    this.fromText.set(loc.nameBn || loc.displayName);
    this.showFromDropdown.set(false);
    this.errorMessage.set(null);
  }

  selectTo(loc: LocationDto): void {
    this.selectedTo.set(loc);
    this.toText.set(loc.nameBn || loc.displayName);
    this.showToDropdown.set(false);
    this.errorMessage.set(null);
  }

  clearFrom(): void {
    this.fromText.set('');
    this.selectedFrom.set(null);
    this.fromSuggestions.set([]);
    this.showFromDropdown.set(false);
  }

  clearTo(): void {
    this.toText.set('');
    this.selectedTo.set(null);
    this.toSuggestions.set([]);
    this.showToDropdown.set(false);
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
      this.fromText.set(loc.name);
    } else {
      this.selectedTo.set(locDto);
      this.toText.set(loc.name);
    }
    this.errorMessage.set(null);
  }

  toggleManualDistance(): void {
    this.isManualDistanceActive.update(v => !v);
  }

  enableManualDistance(): void {
    this.isManualDistanceActive.set(true);
    this.showFromDropdown.set(false);
    this.showToDropdown.set(false);
  }

  closeDropdowns(): void {
    setTimeout(() => {
      this.showFromDropdown.set(false);
      this.showToDropdown.set(false);
    }, 250);
  }

  selectTransport(code: TransportCode): void {
    this.transportCode.set(code);
  }

  onSubmit(): void {
    let from = this.selectedFrom();
    let to = this.selectedTo();
    const fromVal = this.fromText().trim();
    const toVal = this.toText().trim();
    const fare = this.actualFare();

    if (!fromVal) {
      this.errorMessage.set('কোথা থেকে যাত্রা করেছেন লিখুন');
      return;
    }

    if (!toVal) {
      this.errorMessage.set('গন্তব্য স্থান লিখুন');
      return;
    }

    // Auto-resolve from suggestions if user typed without clicking dropdown item
    if (!from && this.fromSuggestions().length > 0) {
      const match = this.fromSuggestions().find(s => 
        s.nameBn.toLowerCase().includes(fromVal.toLowerCase()) || 
        s.nameEn.toLowerCase().includes(fromVal.toLowerCase()) ||
        fromVal.toLowerCase().includes(s.nameBn.toLowerCase())
      ) || this.fromSuggestions()[0];
      from = match;
      this.selectedFrom.set(match);
    }

    if (!to && this.toSuggestions().length > 0) {
      const match = this.toSuggestions().find(s => 
        s.nameBn.toLowerCase().includes(toVal.toLowerCase()) || 
        s.nameEn.toLowerCase().includes(toVal.toLowerCase()) ||
        toVal.toLowerCase().includes(s.nameBn.toLowerCase())
      ) || this.toSuggestions()[0];
      to = match;
      this.selectedTo.set(match);
    }

    if (fromVal.toLowerCase() === toVal.toLowerCase()) {
      this.errorMessage.set('যাত্রার স্থান এবং গন্তব্য ভিন্ন হতে হবে');
      return;
    }

    if (!fare || fare <= 0) {
      this.errorMessage.set('প্রকৃতপক্ষে কত ভাড়া দিয়েছেন উল্লেখ করুন');
      return;
    }

    if (fare < 10) {
      this.errorMessage.set('ভাড়া সর্বনিম্ন ১০ টাকা বা তার বেশি হতে হবে');
      return;
    }

    if (fare > 5000) {
      this.errorMessage.set('ভাড়া ৫,০০০ টাকার বেশি হতে পারে না');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const manualDist = this.isManualDistanceActive() && this.manualDistance() && this.manualDistance()! > 0
      ? this.manualDistance()!
      : undefined;

    const request: FareContributionRequestModel = {
      fromLocationId: from?.id,
      fromLatitude: from?.latitude,
      fromLongitude: from?.longitude,
      fromName: from?.displayName || fromVal,
      toLocationId: to?.id,
      toLatitude: to?.latitude,
      toLongitude: to?.longitude,
      toName: to?.displayName || toVal,
      transportCode: this.transportCode(),
      actualFarePaid: fare,
      manualDistanceKm: manualDist,
      travelDate: this.travelDate() ? new Date(this.travelDate()).toISOString() : null
    };

    this.fareService.contributeFare(request).subscribe({
      next: (response) => {
        this.isSubmitting.set(false);
        this.successData.set(response);
        this.fareContributed.emit(response);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        const errorMsg = err?.message || 'ভাড়া জমা দেওয়া যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।';
        this.errorMessage.set(errorMsg);
      }
    });
  }

  onClose(): void {
    this.closeModal.emit();
  }
}
