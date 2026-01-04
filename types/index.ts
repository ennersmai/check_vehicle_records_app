export interface Vehicle {
  vrm: string;
  make?: string;
  model?: string;
  year?: number;
  colour?: string;
  fuel_type?: string;
  source_dvla_raw?: any;
  source_paid_raw?: any;
  is_premium_unlocked: boolean;
  mot_expiry?: string;
  tax_status?: string;
  last_updated_at?: string;
}

export interface Profile {
  id: string;
  credits: number;
}

export type ActivityType = 'SEARCH' | 'GARAGE';

export interface UserActivity {
  id: string;
  user_id: string;
  vrm: string;
  type: ActivityType;
  nickname?: string;
  created_at: string;
  vehicle?: Vehicle;
}

export interface VehicleLookupResponse {
  success: boolean;
  data?: Vehicle;
  imageUrl?: string;
  error?: string;
  source: 'cache' | 'dvla' | 'paid' | 'checkcardetails' | 'error';
  errorCode?: 'NOT_FOUND' | 'API_ERROR' | 'INVALID_VRM' | 'UNKNOWN';
}
