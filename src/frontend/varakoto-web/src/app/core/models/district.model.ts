export interface District {
  id: string;
  nameEn: string;
  nameBn: string;
  divisionEn: string;
  divisionBn: string;
  center: {
    lat: number;
    lng: number;
  };
  isPopular?: boolean;
}
