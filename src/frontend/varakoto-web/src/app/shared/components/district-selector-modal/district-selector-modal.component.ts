import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DistrictService } from '../../../core/services/district.service';
import { District } from '../../../core/models/district.model';

@Component({
  selector: 'app-district-selector-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './district-selector-modal.component.html',
  styleUrls: ['./district-selector-modal.component.scss']
})
export class DistrictSelectorModalComponent {
  readonly districtService = inject(DistrictService);

  readonly searchQuery = signal<string>('');
  readonly isDetectingGps = signal<boolean>(false);
  readonly gpsError = signal<string | null>(null);

  readonly popularDistricts = this.districtService.popularDistricts;

  readonly filteredDistricts = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) {
      return this.districtService.allDistricts;
    }
    return this.districtService.allDistricts.filter(d =>
      d.nameBn.toLowerCase().includes(q) ||
      d.nameEn.toLowerCase().includes(q) ||
      d.divisionBn.toLowerCase().includes(q) ||
      d.divisionEn.toLowerCase().includes(q)
    );
  });

  selectDistrict(d: District): void {
    this.districtService.setDistrict(d);
  }

  async detectGps(): Promise<void> {
    this.isDetectingGps.set(true);
    this.gpsError.set(null);

    try {
      await this.districtService.detectDistrictFromGPS();
      this.isDetectingGps.set(false);
    } catch (err: any) {
      this.isDetectingGps.set(false);
      this.gpsError.set(err?.message || 'জিপিএস অবস্থান পাওয়া যায়নি। তালিকা থেকে জেলা বেছে নিন।');
    }
  }

  close(): void {
    this.districtService.closeModal();
  }
}
