import { Injectable, signal, computed, inject } from '@angular/core';
import { District } from '../models/district.model';
import { LocationDto } from '../models/location.model';
import { BANGLADESH_DISTRICTS, DISTRICT_HUBS } from '../data/districts.data';
import { NativeMobileService } from './native-mobile.service';

const STORAGE_KEY = 'vk_user_district';

@Injectable({
  providedIn: 'root'
})
export class DistrictService {
  private readonly nativeMobile = inject(NativeMobileService);

  readonly allDistricts = BANGLADESH_DISTRICTS;
  readonly popularDistricts = BANGLADESH_DISTRICTS.filter(d => d.isPopular);

  readonly currentDistrict = signal<District>(this.loadInitialDistrict());
  readonly isModalOpen = signal<boolean>(false);
  readonly hasUserExplicitlySetDistrict = signal<boolean>(this.checkIfExplicitlySet());

  readonly currentDistrictNameBn = computed(() => this.currentDistrict().nameBn);
  readonly currentDistrictNameEn = computed(() => this.currentDistrict().nameEn);

  constructor() {
    // If not explicitly set in storage, mark modal to open so user chooses on first arrival
    if (!this.checkIfExplicitlySet()) {
      this.isModalOpen.set(true);
    }
  }

  private checkIfExplicitlySet(): boolean {
    try {
      return !!localStorage.getItem(STORAGE_KEY);
    } catch {
      return false;
    }
  }

  private loadInitialDistrict(): District {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const match = BANGLADESH_DISTRICTS.find(d => d.id === parsed.id || d.nameEn.toLowerCase() === (parsed.nameEn || '').toLowerCase());
        if (match) return match;
      }
    } catch (e) {
      console.warn('Failed to parse saved user district', e);
    }
    // Default to Dhaka if nothing saved
    return BANGLADESH_DISTRICTS[0];
  }

  setDistrict(district: District): void {
    this.currentDistrict.set(district);
    this.hasUserExplicitlySetDistrict.set(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(district));
    } catch (e) {
      console.warn('Could not persist district to localStorage', e);
    }
    this.nativeMobile.hapticSelection();
    this.closeModal();
  }

  openModal(): void {
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  async detectDistrictFromGPS(): Promise<District> {
    const pos = await this.nativeMobile.getCurrentPosition();
    const nearest = this.findNearestDistrict(pos.latitude, pos.longitude);
    this.setDistrict(nearest);
    return nearest;
  }

  getPopularHubsForCurrentDistrict(): LocationDto[] {
    const district = this.currentDistrict();
    const districtKey = district.id.toLowerCase();

    if (DISTRICT_HUBS[districtKey]) {
      return DISTRICT_HUBS[districtKey];
    }

    // Dynamic fallback hubs for any of the 64 districts
    return [
      {
        displayName: `${district.nameBn} কেন্দ্রীয় বাস টার্মিনাল`,
        nameBn: `${district.nameBn} বাস টার্মিনাল`,
        nameEn: `${district.nameEn} Bus Terminal`,
        latitude: district.center.lat + 0.005,
        longitude: district.center.lng + 0.005,
        district: district.nameEn,
        thana: `${district.nameEn} Sadar`,
        isHub: true,
        source: 'Hub'
      },
      {
        displayName: `${district.nameBn} জিরো পয়েন্ট (সদর)`,
        nameBn: `${district.nameBn} জিরো পয়েন্ট`,
        nameEn: `${district.nameEn} Zero Point`,
        latitude: district.center.lat,
        longitude: district.center.lng,
        district: district.nameEn,
        thana: `${district.nameEn} Sadar`,
        isHub: true,
        source: 'Hub'
      },
      {
        displayName: `${district.nameBn} কলেজ মোড়`,
        nameBn: 'কলেজ মোড়',
        nameEn: 'College Circle',
        latitude: district.center.lat - 0.005,
        longitude: district.center.lng - 0.005,
        district: district.nameEn,
        thana: `${district.nameEn} Sadar`,
        isHub: true,
        source: 'Hub'
      },
      {
        displayName: `${district.nameBn} প্রধান বাজার মোড়`,
        nameBn: 'প্রধান বাজার',
        nameEn: 'Main Bazar',
        latitude: district.center.lat + 0.002,
        longitude: district.center.lng - 0.003,
        district: district.nameEn,
        thana: `${district.nameEn} Sadar`,
        isHub: true,
        source: 'Hub'
      }
    ];
  }

  private findNearestDistrict(lat: number, lng: number): District {
    let minDistance = Infinity;
    let closestDistrict = this.allDistricts[0];

    for (const d of this.allDistricts) {
      const dist = this.haversineDistance(lat, lng, d.center.lat, d.center.lng);
      if (dist < minDistance) {
        minDistance = dist;
        closestDistrict = d;
      }
    }

    return closestDistrict;
  }

  private haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
