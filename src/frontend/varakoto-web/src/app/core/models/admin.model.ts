export interface AdminLoginRequestModel {
  username: string;
  password: string;
}

export interface AdminLoginResponseModel {
  token: string;
  username: string;
  displayName: string;
  role: string;
  expiresAt: string;
}

export interface AdminSubmissionModel {
  id: number;
  fromLocationName: string;
  toLocationName: string;
  transportCode: string;
  transportNameBn: string;
  userSubmittedFare: number;
  databaseStandardFare: number | null;
  differenceAmount: number;
  differencePercentage: number;
  distanceKm: number;
  moderationStatus: 'Pending' | 'Approved' | 'Flagged' | 'Rejected';
  deviceHash?: string;
  adminNote?: string;
  timeAgoBn: string;
  submittedAt: string;
  reviewedAt?: string | null;
}

export interface AdminStatsModel {
  totalPending: number;
  totalApproved: number;
  totalFlagged: number;
  totalRejected: number;
  totalSubmissions: number;
}
