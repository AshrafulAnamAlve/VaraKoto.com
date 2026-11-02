import { Component, EventEmitter, Output, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FareService } from '../../../../core/services/fare.service';
import { FareBreakdownModel, TransportCode } from '../../../../core/models/fare.model';

@Component({
  selector: 'app-fare-result-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fare-result-card.component.html',
  styleUrls: ['./fare-result-card.component.scss']
})
export class FareResultCardComponent {
  readonly fareService = inject(FareService);

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

  selectTransport(code: string): void {
    this.fareService.setSelectedTransport(code as TransportCode);
  }

  onModify(): void {
    this.modifySearch.emit();
  }

  onContribute(): void {
    const res = this.result();
    this.contributeFare.emit({
      fromLocation: res?.fromLocation?.nameBn || res?.fromLocation?.nameEn,
      toLocation: res?.toLocation?.nameBn || res?.toLocation?.nameEn,
      transport: this.primaryFare()?.transportCode
    });
  }
}
