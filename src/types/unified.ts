
// Unified types for the application
export interface Vehicle {
  year: number;
  make: string;
  model: string;
  trim?: string;
  mileage: number;
  condition: string;
  vin?: string;
  zipCode?: string;
}

export interface ValuationAdjustment {
  factor: string;
  impact: number;
  description: string;
  name?: string;
  value?: number;
  percentAdjustment?: number;
}

export interface ValuationData {
  id: string;
  vehicle: Vehicle;
  estimatedValue: number;
  confidenceScore: number;
  priceRange?: [number, number];
  adjustments: ValuationAdjustment[];
  baseValue?: number;
  finalValue?: number;
  isPremium?: boolean;
  createdAt: string;
  updatedAt?: string;
  titleRecallInfo?: TitleRecallInfo;
}

export interface TitleRecallInfo {
  titleStatus: 'Clean' | 'Salvage' | 'Rebuilt' | 'Lemon' | 'Flood' | 'Stolen' | 'Unknown';
  brandedDetails?: string;
  recalls: {
    id: string;
    component: string;
    summary: string;
    riskLevel: 'Critical' | 'Important' | 'Informational';
    recallDate: string;
    resolved?: boolean;
  }[];
  oemRepairLinks?: string[];
  lastChecked: string;
}

export interface UserProfile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  role: 'individual' | 'dealer' | 'admin';
  is_premium_dealer?: boolean;
  premium_expires_at?: string;
}

export interface DealerOffer {
  id: string;
  dealer_id: string;
  valuation_id: string;
  offer_amount: number;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  score?: number;
  label?: string;
  insight?: string;
  created_at: string;
}
