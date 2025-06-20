
export interface Dealer {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone?: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DealerOffer {
  id: string;
  dealerId: string;
  userId: string;
  reportId: string;
  offerAmount: number;
  message?: string;
  status: 'pending' | 'accepted' | 'declined';
  score?: number;
  insight?: string;
  label?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DealerValuation {
  id: string;
  dealerId: string;
  vehicleData: any;
  estimatedValue: number;
  offerAmount: number;
  confidence: number;
  createdAt: string;
}

export interface ValuationWithCondition extends DealerValuation {
  condition: string;
}

export interface Valuation {
  id: string;
  vehicleData: any;
  estimatedValue: number;
  confidence: number;
  createdAt: string;
  condition?: string;
}
