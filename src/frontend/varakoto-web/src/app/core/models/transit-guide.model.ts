export interface TransitGuide {
  isShortDistance: boolean;
  shortDistanceAdvice?: string;

  hasMetroOption: boolean;
  metroBoardingStation?: string;
  metroAlightingStation?: string;
  metroDurationMinutes?: number;
  metroFare?: number;

  hasDirectBus: boolean;
  directBuses: string[];
  nearestBoardingStop?: string;
  nearestAlightingStop?: string;

  isInterDistrict: boolean;
  departureTerminal?: string;
  interDistrictCoaches: string[];
  destinationDistrict?: string;

  hasTransferOption: boolean;
  transferHub?: string;
  firstLegBus?: string;
  secondLegBus?: string;

  summaryRecommendation: string;
}

export interface MetroStation {
  id: string;
  nameBn: string;
  nameEn: string;
  order: number;
  aliases: string[];
}

export interface BusRouteInfo {
  nameBn: string;
  nameEn: string;
  stops: string[]; // List of stop names (lowercased or normalized)
  stopsBn: string[];
}
