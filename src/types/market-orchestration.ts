// Unified types for market orchestration system

export interface VehicleParams {
  year: number;
  make: string;
  model: string;
  trim?: string;
  mileage?: number;
  zip_code?: string;
  condition?: string;
  vin?: string;
}

export interface OrchestrationRequest {
  request_id: string;
  vehicle_params: VehicleParams;
  sources?: string[];
}

export interface MarketComp {
  id: string;
  valuation_request_id: string;
  source: string;
  source_type: string;
  vin?: string;
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  price: number;
  mileage?: number;
  condition: string;
  dealer_name?: string;
  location?: string;
  listing_url: string;
  is_cpo: boolean;
  incentives?: string;
  features: Record<string, any>;
  confidence_score: number;
  raw_data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface OrchestrationResult {
  success: boolean;
  request_id: string;
  total_comps: number;
  sources_processed: number;
  comp_summary: CompSummary;
  source_results: Record<string, SourceResult>;
  execution_time_ms: number;
  error?: string;
}

export interface CompSummary {
  total_comps: number;
  median_price: number;
  mean_price: number;
  price_range: {
    min: number;
    max: number;
  };
  confidence_score: number;
  source_distribution: Record<string, SourceDistribution>;
  price_distribution: {
    q1: number;
    q3: number;
    stddev: number;
  };
}

export interface SourceResult {
  count: number;
  success: boolean;
  comps?: any[];
  error?: string;
}

export interface SourceDistribution {
  count: number;
  avg_price: number;
}

export interface MarketSource {
  name: string;
  type: string;
  searchPattern: string;
  priority: number;
}