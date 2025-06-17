
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
  // Add missing properties that components are looking for
  vin?: string;
  price_range?: [number, number];
  estimated_value?: number; // For backward compatibility
  confidence_score?: number; // For backward compatibility
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

// Add forecast types
export interface ForecastData {
  trend: 'up' | 'down' | 'stable';
  confidence: number;
  timeframe: number;
  delta: number;
}

export interface ForecastResult {
  forecast: Array<{
    month: string;
    value: number;
  }>;
  analysis?: string;
  percentageChange: string;
  bestTimeToSell?: string;
  confidenceScore: number;
}
