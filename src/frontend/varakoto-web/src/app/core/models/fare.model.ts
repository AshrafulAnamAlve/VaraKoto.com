import { LocationModel } from './location.model';

export type TransportCode = 'bus' | 'rickshaw' | 'cng' | 'bike';
export type FareReliability = 'Official' | 'Estimated' | 'CommunityBacked';
export type FareType = 'OfficialRate' | 'NegotiatedMarket' | 'RideShareEstimate' | 'CommunityRefined' | 'Estimated';

export interface FareBreakdownModel {
  transportCode: string;
  transportNameEn: string;
  transportNameBn: string;
  iconKey: string;
  displayOrder: number;
  estimatedMinFare: number;
  estimatedMaxFare: number;
  exactFare: number | null;
  officialMeterFare: number | null;
  fareDisplayEn: string;
  fareDisplayBn: string;
  fareType: FareType;
  sourceNote: string;
  sourceNoteBn: string;
  reliability: FareReliability;
  reliabilityStars: number;
  communitySubmissionCount: number;
  communityAverageFare: number | null;
  isAvailableForDistance: boolean;
  distanceNotice: string | null;
  distanceNoticeBn: string | null;
}

export interface FareCalculationRequestModel {
  fromLocationId?: number | null;
  toLocationId?: number | null;
  fromLatitude?: number | null;
  fromLongitude?: number | null;
  fromName?: string | null;
  toLatitude?: number | null;
  toLongitude?: number | null;
  toName?: string | null;
  transportCode?: string;
  includeAllTransports?: boolean;
}

export interface FareCalculationResultModel {
  fromLocation: LocationModel;
  toLocation: LocationModel;
  distanceKm: number;
  estimatedDurationMinutes: number;
  distanceSource: string;
  primaryFare: FareBreakdownModel;
  allFares: FareBreakdownModel[];
  calculatedAt: string;
}

export interface TransportTypeInfo {
  id: number;
  code: string;
  nameEn: string;
  nameBn: string;
  iconKey: string;
  displayOrder: number;
  fareRule?: {
    baseFare: number;
    baseDistanceKm: number;
    perKmRate: number;
    minimumFare: number;
    officialSourceNote: string;
  };
}
