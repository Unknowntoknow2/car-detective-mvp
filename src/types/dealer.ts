export interface Valuation {
  id: string;
  make: string;
  model: string;
  year: number;
  estimated_value: number;
  confidence_score: number;
  mileage?: number;
  condition?: string;
  fuel_type?: string;
  zip_code?: string;
  body_type: string;
  color: string;
  condition_score: number;
  created_at: string;
  is_vin_lookup: boolean;
  vin?: string;
}

export interface DealerSignupData {
  email: string;
  password: string;
  business_name: string;
  contact_name: string;
  phone?: string;
}

export interface Dealer {
  id: string;
  business_name: string;
  contact_name: string;
  phone?: string;
  email: string;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface DealerOffer {
  id: string;
  report_id: string;
  user_id: string;
  dealer_id: string;
  offer_amount: number;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  created_at: string;
  updated_at: string;
}
