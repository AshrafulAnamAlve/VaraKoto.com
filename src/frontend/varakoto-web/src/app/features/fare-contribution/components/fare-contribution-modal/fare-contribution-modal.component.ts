import { Component, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FareService } from '../../../../core/services/fare.service';
import { LocationService } from '../../../../core/services/location.service';
import { FareContributionRequestModel, FareContributionResponseModel, TransportCode } from '../../../../core/models/fare.model';
import { LocationDto } from '../../../../core/models/location.model';

@Component({
  selector: 'app-fare-contribution-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fare-contribution-modal.component.html',
  styleUrls: ['./fare-contribution-modal.component.scss']
})
export class FareContributionModalComponent {
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
  readonly transportCode = signal<TransportCode>('bus');
  readonly actualFare = signal<number | null>(null);
  readonly travelDate = signal<string>(new Date().toISOString().split('T')[0]);

  readonly isSubmitting = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successData = signal<FareContributionResponseModel | null>(null);

  readonly transports: { code: TransportCode; labelBn: string; icon: string }[] = [
    { code: 'bus', labelBn: 'বাস', icon: '🚌' },
    { code: 'rickshaw', labelBn: 'রিকশা', icon: '🛺' },
    { code: 'cng', labelBn: 'সিএনজি', icon: '🛺💨' },
    { code: 'bike', labelBn: 'বাইক', icon: '🏍️' }
  ];

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.fromText.set(this.initialFrom());
        this.toText.set(this.initialTo());
        this.transportCode.set(this.initialTransport() || 'bus');
        this.actualFare.set(null);
        this.errorMessage.set(null);
        this.successData.set(null);
      }
    });
  }

  selectTransport(code: TransportCode): void {
    this.transportCode.set(code);
  }

  onSubmit(): void {
    const from = this.fromText().trim();
    const to = this.toText().trim();
    const fare = this.actualFare();

    if (!from) {
      this.errorMessage.set('কোথা থেকে যাত্রা করেছেন লিখুন');
      return;
    }

    if (!to) {
      this.errorMessage.set('গন্তব্য স্থান লিখুন');
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

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const request: FareContributionRequestModel = {
      fromName: from,
      toName: to,
      transportCode: this.transportCode(),
      actualFarePaid: fare,
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
        this.errorMessage.set(err.message || 'ভাড়া জমা দেওয়া যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।');
      }
    });
  }

  onClose(): void {
    this.closeModal.emit();
  }
}
