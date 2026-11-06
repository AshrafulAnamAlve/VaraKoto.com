import { Injectable } from '@angular/core';
import { LocationDto } from '../models/location.model';
import { TransitGuide, MetroStation, BusRouteInfo } from '../models/transit-guide.model';
import { METRO_LINE_6_STATIONS, DHAKA_BUS_ROUTES, CHITTAGONG_BUS_ROUTES, INTER_DISTRICT_TERMINALS } from '../data/transit-routes.data';

@Injectable({
  providedIn: 'root'
})
export class TransitGuideService {

  generateGuide(fromLoc: LocationDto | null, toLoc: LocationDto | null, distanceKm: number, currentDistrictId?: string): TransitGuide {
    const guide: TransitGuide = {
      isShortDistance: false,
      hasMetroOption: false,
      hasDirectBus: false,
      directBuses: [],
      isInterDistrict: false,
      interDistrictCoaches: [],
      hasTransferOption: false,
      summaryRecommendation: ''
    };

    if (!fromLoc || !toLoc) {
      return guide;
    }

    const fromText = this.normalizeText(`${fromLoc.nameBn} ${fromLoc.nameEn} ${fromLoc.displayName}`);
    const toText = this.normalizeText(`${toLoc.nameBn} ${toLoc.nameEn} ${toLoc.displayName}`);

    const fromDistrict = (fromLoc.district || '').toLowerCase().trim();
    const toDistrict = (toLoc.district || '').toLowerCase().trim();

    // 1. Check Inter-District Travel
    if (fromDistrict && toDistrict && fromDistrict !== toDistrict && distanceKm > 30) {
      const targetTerminalInfo = INTER_DISTRICT_TERMINALS[toDistrict] || INTER_DISTRICT_TERMINALS[fromDistrict];
      if (targetTerminalInfo) {
        guide.isInterDistrict = true;
        guide.departureTerminal = targetTerminalInfo.terminalBn;
        guide.interDistrictCoaches = targetTerminalInfo.coachesBn;
        guide.destinationDistrict = toLoc.district || toLoc.nameBn;
        guide.summaryRecommendation = `${targetTerminalInfo.terminalBn} থেকে দূরপাল্লার বাসে সরাসরি যেতে পারবেন।`;
        return guide;
      }
    }

    // 2. Check Short Distance (< 2.2 km)
    if (distanceKm > 0 && distanceKm <= 2.2) {
      guide.isShortDistance = true;
      guide.shortDistanceAdvice = 'স্বল্প দূরত্ব: সরাসরি রিকশায় যাওয়া সবচেয়ে দ্রুত ও সুবিধাজনক। বাসের প্রয়োজন নেই।';
      guide.summaryRecommendation = 'রিকশায় সরাসরি যাওয়া সবচেয়ে সুবিধাজনক।';
      return guide;
    }

    // 3. Check Metro Rail (MRT Line-6) Corridor
    const fromStation = this.findMatchingMetroStation(fromText);
    const toStation = this.findMatchingMetroStation(toText);

    if (fromStation && toStation && fromStation.id !== toStation.id) {
      const stationDelta = Math.abs(fromStation.order - toStation.order);
      guide.hasMetroOption = true;
      guide.metroBoardingStation = fromStation.nameBn;
      guide.metroAlightingStation = toStation.nameBn;
      guide.metroDurationMinutes = Math.round(stationDelta * 2.2 + 3);
      guide.metroFare = stationDelta <= 2 ? 20 : Math.min(100, 20 + (stationDelta - 2) * 10);
    }

    // 4. Check Direct City Buses (Dhaka & Chittagong)
    const busPool = (currentDistrictId === 'chattogram' || fromDistrict.includes('chattogram'))
      ? CHITTAGONG_BUS_ROUTES
      : DHAKA_BUS_ROUTES;

    const matchedBuses = this.findMatchingBuses(fromText, toText, busPool);
    if (matchedBuses.length > 0) {
      guide.hasDirectBus = true;
      guide.directBuses = matchedBuses;
      guide.nearestBoardingStop = fromLoc.nameBn || fromLoc.displayName;
      guide.nearestAlightingStop = toLoc.nameBn || toLoc.displayName;
      guide.summaryRecommendation = `${matchedBuses.slice(0, 3).join(', ')} বাসে সরাসরি যাওয়া যায়।`;
    }

    // 5. Transfer / Connecting Option if neither direct bus nor metro
    if (!guide.hasDirectBus && !guide.hasMetroOption) {
      guide.hasTransferOption = true;
      guide.transferHub = this.determineTransferHub(fromText, toText, currentDistrictId);
      guide.nearestBoardingStop = fromLoc.nameBn || fromLoc.displayName;
      guide.summaryRecommendation = `${guide.transferHub} হয়ে এক ট্রান্সফারে পৌঁছানো যাবে।`;
    }

    return guide;
  }

  private findMatchingMetroStation(text: string): MetroStation | null {
    for (const st of METRO_LINE_6_STATIONS) {
      if (st.aliases.some(alias => text.includes(this.normalizeText(alias)))) {
        return st;
      }
    }
    return null;
  }

  private findMatchingBuses(fromText: string, toText: string, busList: BusRouteInfo[]): string[] {
    const directBuses: string[] = [];

    for (const bus of busList) {
      const fromIndex = bus.stops.findIndex((s, i) =>
        fromText.includes(s) || fromText.includes(this.normalizeText(bus.stopsBn[i]))
      );

      const toIndex = bus.stops.findIndex((s, i) =>
        toText.includes(s) || toText.includes(this.normalizeText(bus.stopsBn[i]))
      );

      if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
        directBuses.push(bus.nameBn);
      }
    }

    return directBuses;
  }

  private determineTransferHub(fromText: string, toText: string, currentDistrictId?: string): string {
    if (currentDistrictId === 'chattogram') {
      return 'জিইসি মোড়';
    }
    if (fromText.includes('uttara') || fromText.includes('airport')) {
      return 'মহাখালী';
    }
    if (fromText.includes('mirpur')) {
      return 'ফার্মগেট';
    }
    if (fromText.includes('dhanmondi') || fromText.includes('mohammadpur')) {
      return 'শাহবাগ';
    }
    return 'ফার্মগেট মোড়';
  }

  private normalizeText(text: string): string {
    return (text || '').toLowerCase().replace(/[-_,/()]/g, ' ').replace(/\s+/g, ' ').trim();
  }
}
