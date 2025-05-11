
export interface DealerSignupData {
  email: string;
  password: string;
  dealership_name: string;
  contact_name: string;
  phone?: string;
}

export interface Dealer {
  id: string;
  dealership_name: string;
  contact_name: string;
  phone?: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface DealerOffer {
  id: string;
  dealer_id: string;
  user_id: string;
  report_id: string;
  offer_amount: number;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Valuation {
  id: string;
  user_id: string;
  year: number;
  make: string;
  model: string;
  estimated_value: number;
  condition_score: number;
  confidence_score: number;
  created_at: string;
  mileage?: number;
  state?: string;
  vin?: string;
}

export interface ValuationWithCondition extends Valuation {
  aiCondition?: {
    condition: string;
    confidenceScore: number;
    issuesDetected?: string[];
    aiSummary?: string;
  } | null;
}
