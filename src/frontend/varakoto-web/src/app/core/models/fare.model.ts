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
  manualDistanceKm?: number | null;
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

export interface FareContributionRequestModel {
  fromLocationId?: number | null;
  toLocationId?: number | null;
  fromName?: string | null;
  toName?: string | null;
  fromLatitude?: number | null;
  fromLongitude?: number | null;
  toLatitude?: number | null;
  toLongitude?: number | null;
  transportCode: string;
  actualFarePaid: number;
  manualDistanceKm?: number | null;
  travelDate?: string | null;
}

export interface FareContributionResponseModel {
  submissionId: number;
  status: 'Approved' | 'Pending' | 'Flagged';
  messageEn: string;
  messageBn: string;
  calculatedStandardFare: number | null;
  submittedFare: number;
  fromLocationName: string;
  toLocationName: string;
  transportName: string;
  submittedAt: string;
}

export interface RecentContributionModel {
  id: number;
  fromLocationName: string;
  toLocationName: string;
  transportCode: string;
  transportNameBn: string;
  actualFarePaid: number;
  fareDisplayBn: string;
  distanceKm: number;
  timeAgoBn: string;
  submittedAt: string;
}
