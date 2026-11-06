import { Component, EventEmitter, Output, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FareService } from '../../../../core/services/fare.service';
import { NativeMobileService } from '../../../../core/services/native-mobile.service';
import { FareBreakdownModel, TransportCode } from '../../../../core/models/fare.model';
import { TransitGuideService } from '../../../../core/services/transit-guide.service';
import { DistrictService } from '../../../../core/services/district.service';

export interface RouteOption {
  id: number;
  nameBn: string;
  badgeBn: string;
  viaText: string;
  distanceKm: number;
  durationMinutes: number;
}

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
  @Output() routeChanged = new EventEmitter<{ routeIndex: number; distanceKm: number; durationMinutes: number }>();

  // Active selected route index: 0 = Route 1 (Best/Default), 1 = Route 2 (Alternative)
  readonly selectedRouteIndex = signal<number>(this.fareService.selectedRouteMode() === 'alt' ? 1 : 0);

  // Current calculation result
  readonly result = computed(() => this.fareService.latestResult());

  readonly routesInfo = computed<{ route1: RouteOption; route2: RouteOption } | null>(() => {
    const res = this.result();
    if (!res) return null;

    const baseKm = Number(res.distanceKm) || 5;
    const baseMin = Number(res.estimatedDurationMinutes) || 20;
    const fromText = (res.fromLocation?.nameBn || res.fromLocation?.displayName || '').toLowerCase();
    const toText = (res.toLocation?.nameBn || res.toLocation?.displayName || '').toLowerCase();

    let r1Via = 'প্রধান সড়ক ও সরাসরি করিডোর হয়ে';
    let r2Via = 'বিকল্প সংযোগ সড়ক ও বাইপাস হয়ে';

    if (fromText.includes('মিরপুর') || toText.includes('মিরপুর')) {
      r1Via = 'রোকেয়া সরণি ও প্রধান সড়ক হয়ে';
      r2Via = 'কালশী লিংক রোড / টেকনিক্যাল হয়ে';
    } else if (fromText.includes('উত্তরা') || toText.includes('উত্তরা') || fromText.includes('বিমানবন্দর') || toText.includes('বিমানবন্দর')) {
      r1Via = 'বিমানবন্দর মহাসড়ক ও প্রধান করিডোর হয়ে';
      r2Via = 'কুড়িল এক্সপ্রেসওয়ে ও প্রগতি সরণি হয়ে';
    } else if (fromText.includes('ধানমন্ডি') || toText.includes('ধানমন্ডি') || fromText.includes('মোহাম্মদপুর') || toText.includes('মোহাম্মদপুর')) {
      r1Via = 'মিরপুর রোড ও সায়েন্স ল্যাব হয়ে';
      r2Via = 'সাত মসজিদ রোড ও পান্থপথ হয়ে';
    } else if (fromText.includes('যাত্রাবাড়ী') || toText.includes('যাত্রাবাড়ী') || fromText.includes('সায়েদাবাদ') || toText.includes('সায়েদাবাদ')) {
      r1Via = 'গুলিস্তান ও প্রধান সড়ক হয়ে';
      r2Via = 'মালিবাগ ও রামপুরা সংযোগ হয়ে';
    } else if (fromText.includes('চট্টগ্রাম') || toText.includes('চট্টগ্রাম') || fromText.includes('chattogram')) {
      r1Via = 'জিইসি ও আগ্রাবাদ প্রধান সড়ক হয়ে';
      r2Via = 'সিডিএ এভিনিউ ও বাইপাস হয়ে';
    }

    const r2Km = Math.round(baseKm * 1.18 * 10) / 10;
    const r2Min = Math.round(baseMin * 1.22);

    return {
      route1: {
        id: 0,
        nameBn: 'রুট ১ (সেরা রুট)',
        badgeBn: '⭐ সেরা রুট',
        viaText: r1Via,
        distanceKm: baseKm,
        durationMinutes: baseMin
      },
      route2: {
        id: 1,
        nameBn: 'রুট ২ (বিকল্প রুট)',
        badgeBn: '🔄 বিকল্প রুট',
        viaText: r2Via,
        distanceKm: r2Km,
        durationMinutes: r2Min
      }
    };
  });

  readonly activeDistanceKm = computed(() => {
    const routes = this.routesInfo();
    if (!routes) return this.result()?.distanceKm || 0;
    return this.selectedRouteIndex() === 0 ? routes.route1.distanceKm : routes.route2.distanceKm;
  });

  readonly activeDurationMinutes = computed(() => {
    const routes = this.routesInfo();
    if (!routes) return this.result()?.estimatedDurationMinutes || 0;
    return this.selectedRouteIndex() === 0 ? routes.route1.durationMinutes : routes.route2.durationMinutes;
  });

  readonly activeRouteName = computed(() => {
    const routes = this.routesInfo();
    if (!routes) return 'প্রধান রুট';
    return this.selectedRouteIndex() === 0 ? routes.route1.nameBn : routes.route2.nameBn;
  });

  // Bengali formatted values
  readonly distanceBn = computed(() => {
    return this.fareService.toBengaliDigits(this.activeDistanceKm().toFixed(1));
  });

  readonly durationBn = computed(() => {
    return this.fareService.toBengaliDigits(Math.round(this.activeDurationMinutes()));
  });

  readonly route1DistanceBn = computed(() => {
    const routes = this.routesInfo();
    return routes ? this.fareService.toBengaliDigits(routes.route1.distanceKm.toFixed(1)) : '০';
  });

  readonly route1DurationBn = computed(() => {
    const routes = this.routesInfo();
    return routes ? this.fareService.toBengaliDigits(Math.round(routes.route1.durationMinutes)) : '০';
  });

  readonly route2DistanceBn = computed(() => {
    const routes = this.routesInfo();
    return routes ? this.fareService.toBengaliDigits(routes.route2.distanceKm.toFixed(1)) : '০';
  });

  readonly route2DurationBn = computed(() => {
    const routes = this.routesInfo();
    return routes ? this.fareService.toBengaliDigits(Math.round(routes.route2.durationMinutes)) : '০';
  });

  readonly route1ViaText = computed(() => this.routesInfo()?.route1.viaText || '');
  readonly route2ViaText = computed(() => this.routesInfo()?.route2.viaText || '');

  readonly activeViaText = computed(() => {
    return this.selectedRouteIndex() === 0 ? this.route1ViaText() : this.route2ViaText();
  });

  // Computed active primary fare based on selected route
  readonly primaryFare = computed(() => {
    const primary = this.result()?.primaryFare;
    if (!primary) return null;
    if (this.selectedRouteIndex() === 0) return primary;

    const routes = this.routesInfo();
    if (!routes) return primary;

    const ratio = routes.route2.distanceKm / (routes.route1.distanceKm || 1);
    const newMin = Math.round((primary.estimatedMinFare * ratio) / 5) * 5;
    const newMax = Math.round((primary.estimatedMaxFare * ratio) / 5) * 5;

    const newDisplayBn = primary.exactFare
      ? `৳${this.fareService.toBengaliDigits(Math.round(primary.exactFare * ratio))}`
      : `৳${this.fareService.toBengaliDigits(newMin)} - ৳${this.fareService.toBengaliDigits(newMax)}`;

    const newOfficialMeter = primary.officialMeterFare
      ? Math.round(primary.officialMeterFare * ratio)
      : null;

    return {
      ...primary,
      estimatedMinFare: newMin,
      estimatedMaxFare: newMax,
      exactFare: primary.exactFare ? Math.round(primary.exactFare * ratio) : null,
      officialMeterFare: newOfficialMeter,
      fareDisplayBn: newDisplayBn,
      fareDisplayEn: `৳${newMin} - ৳${newMax}`
    };
  });

  // Computed all fares list based on selected route
  readonly allFares = computed(() => {
    const all = this.result()?.allFares;
    if (!all) return [];
    if (this.selectedRouteIndex() === 0) return all;

    const routes = this.routesInfo();
    if (!routes) return all;

    const ratio = routes.route2.distanceKm / (routes.route1.distanceKm || 1);

    return all.map(f => {
      const newMin = Math.round((f.estimatedMinFare * ratio) / 5) * 5;
      const newMax = Math.round((f.estimatedMaxFare * ratio) / 5) * 5;
      return {
        ...f,
        estimatedMinFare: newMin,
        estimatedMaxFare: newMax,
        exactFare: f.exactFare ? Math.round(f.exactFare * ratio) : null,
        officialMeterFare: f.officialMeterFare ? Math.round(f.officialMeterFare * ratio) : null,
        fareDisplayBn: f.exactFare
          ? `৳${this.fareService.toBengaliDigits(Math.round(f.exactFare * ratio))}`
          : `৳${this.fareService.toBengaliDigits(newMin)} - ৳${this.fareService.toBengaliDigits(newMax)}`
      };
    });
  });

  readonly transitGuide = computed(() => {
    const res = this.result();
    if (!res) return null;
    return this.transitGuideService.generateGuide(
      res.fromLocation,
      res.toLocation,
      this.activeDistanceKm(),
      this.districtService.currentDistrict()?.id
    );
  });

  selectTransport(code: string): void {
    this.nativeMobile.hapticSelection();
    this.fareService.setSelectedTransport(code as TransportCode);
  }

  toggleRoute(): void {
    this.nativeMobile.hapticSelection();
    const nextIdx = this.selectedRouteIndex() === 0 ? 1 : 0;
    this.selectRoute(nextIdx);
  }

  selectRoute(index: number): void {
    this.nativeMobile.hapticSelection();
    this.selectedRouteIndex.set(index);
    this.fareService.setRouteMode(index === 1 ? 'alt' : 'best');
    this.routeChanged.emit({
      routeIndex: index,
      distanceKm: this.activeDistanceKm(),
      durationMinutes: this.activeDurationMinutes()
    });
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
    const routeText = this.activeRouteName();
    await this.nativeMobile.shareFare({
      title: `ভাড়া কত: ${fromName} থেকে ${toName} (${routeText})`,
      text: `${fromName} থেকে ${toName} [${routeText}] পর্যন্ত ${fare.transportNameBn} আনুমানিক ভাড়া ${fare.fareDisplayBn} (দূরত্ব: ${this.distanceBn()} কিমি, আনুমানিক সময়: ~${this.durationBn()} মিনিট)। বিস্তারিত জেনে নিন VaraKoto.com এ:`,
      url: typeof window !== 'undefined' ? window.location.href : 'https://ashrafulanamalve.github.io/VaraKoto.com/'
    });
  }
}
