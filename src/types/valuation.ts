
export interface AdjustmentBreakdown {
  factor: string;
  impact: number;
  name?: string;
  value?: number;
  description: string;
  percentAdjustment?: number;
}

export interface ValuationResult {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  confidenceScore: number;
  estimatedValue: number;
  zipCode?: string;
  color?: string;
  bodyType?: string;
  premium_unlocked?: boolean;
  adjustments?: AdjustmentBreakdown[];
}

export interface SavedValuation {
  id: string;
  user_id: string;
  saved_at: string;
  valuationDetails: {
    year: number;
    make: string;
    model: string;
    trim?: string;
    estimatedValue: number;
    confidenceScore: number;
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ValuationPipeline {
  status: 'processing' | 'completed' | 'error';
  data: any;
}

export interface DealerInsights {
  totalOffers: number;
  averageOfferValue: number;
  responseRate: number;
}

export interface ModificationDetails {
  hasModifications: boolean;
  types: string[];
  modified: boolean;
  reversible: boolean | null;
}
