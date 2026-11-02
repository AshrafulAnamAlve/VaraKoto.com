export interface LocationDto {
  id?: number | null;
  nameEn: string;
  nameBn: string;
  displayName: string;
  latitude: number;
  longitude: number;
  district?: string | null;
  thana?: string | null;
  isHub: boolean;
  source: string;
}

export type LocationModel = LocationDto;

export interface DistanceResultDto {
  distanceKm: number;
  durationMinutes: number;
  source: string;
  isEstimatedRoute: boolean;
}

export type DistanceResultModel = DistanceResultDto;
