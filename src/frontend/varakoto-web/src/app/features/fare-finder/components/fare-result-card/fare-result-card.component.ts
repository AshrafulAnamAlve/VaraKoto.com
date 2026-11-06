import { Component, EventEmitter, Output, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FareService } from '../../../../core/services/fare.service';
import { NativeMobileService } from '../../../../core/services/native-mobile.service';
import { FareBreakdownModel, TransportCode } from '../../../../core/models/fare.model';
import { TransitGuideService } from '../../../../core/services/transit-guide.service';
import { DistrictService } from '../../../../core/services/district.service';

@Component({
  selector: 'app-fare-result-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fare-result-card.component.html',
  styleUrls: ['./fare-result-card.component.scss']
})
export class FareResultCardComponent {
  readonly fareService = inject(FareService);
  readonly nativeMobile = inject(NativeMobileService);
  readonly transitGuideService = inject(TransitGuideService);
  readonly districtService = inject(DistrictService);

  @Output() modifySearch = new EventEmitter<void>();
  @Output() contributeFare = new EventEmitter<{ fromLocation?: string; toLocation?: string; transport?: string }>();

  // Current calculation result
  readonly result = computed(() => this.fareService.latestResult());
  readonly primaryFare = computed(() => this.result()?.primaryFare);

  // Bengali formatted values
  readonly distanceBn = computed(() => {
    const res = this.result();
    return res ? this.fareService.toBengaliDigits(res.distanceKm.toFixed(1)) : '০';
  });

  readonly durationBn = computed(() => {
    const res = this.result();
    return res ? this.fareService.toBengaliDigits(Math.round(res.estimatedDurationMinutes)) : '০';
  });

  readonly transitGuide = computed(() => {
    const res = this.result();
    if (!res) return null;
    return this.transitGuideService.generateGuide(
      res.fromLocation,
      res.toLocation,
      res.distanceKm,
      this.districtService.currentDistrict()?.id
    );
  });

  selectTransport(code: string): void {
    this.nativeMobile.hapticSelection();
    this.fareService.setSelectedTransport(code as TransportCode);
  }

  onModify(): void {
    this.nativeMobile.hapticSelection();
    this.modifySearch.emit();
  }

  onContribute(): void {
    this.nativeMobile.hapticSelection();
    const res = this.result();
    this.contributeFare.emit({
      fromLocation: res?.fromLocation?.nameBn || res?.fromLocation?.nameEn,
      toLocation: res?.toLocation?.nameBn || res?.toLocation?.nameEn,
      transport: this.primaryFare()?.transportCode
    });
  }

  async onShare(): Promise<void> {
    this.nativeMobile.hapticSelection();
    const res = this.result();
    const fare = this.primaryFare();
    if (!res || !fare) return;
    const fromName = res.fromLocation?.nameBn || res.fromLocation?.displayName || res.fromLocation?.nameEn || '';
    const toName = res.toLocation?.nameBn || res.toLocation?.displayName || res.toLocation?.nameEn || '';
    await this.nativeMobile.shareFare({
      title: `ভাড়া কত: ${fromName} থেকে ${toName}`,
      text: `${fromName} থেকে ${toName} পর্যন্ত ${fare.transportNameBn} আনুমানিক ভাড়া ${fare.fareDisplayBn} (দূরত্ব: ${this.distanceBn()} কিমি, আনুমানিক সময়: ~${this.durationBn()} মিনিট)। বিস্তারিত জেনে নিন VaraKoto.com এ:`,
      url: typeof window !== 'undefined' ? window.location.href : 'https://ashrafulanamalve.github.io/VaraKoto.com/'
    });
  }
}
