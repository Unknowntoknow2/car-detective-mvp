
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FreeValuationResultProps {
  displayMode?: string;
  vehicleInfo?: {
    make: string;
    model: string;
    year: number;
    mileage: number;
    condition: string;
  };
  estimatedValue?: number;
  confidenceScore?: number;
  priceRange?: [number, number];
  adjustments?: any[];
}

const UnifiedValuationResult: React.FC<FreeValuationResultProps> = ({
  displayMode = 'full',
  vehicleInfo,
  estimatedValue = 0,
  confidenceScore = 85,
  priceRange = [0, 0],
  adjustments = []
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Valuation</CardTitle>
        </CardHeader>
        <CardContent>
          {vehicleInfo && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold">
                {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
              </h3>
              <p>Mileage: {vehicleInfo.mileage.toLocaleString()} miles</p>
              <p>Condition: {vehicleInfo.condition}</p>
            </div>
          )}
          
          <div className="space-y-2">
            <h4 className="text-2xl font-bold text-green-600">
              ${estimatedValue.toLocaleString()}
            </h4>
            <p className="text-muted-foreground">
              Confidence Score: {confidenceScore}%
            </p>
            {priceRange[0] > 0 && priceRange[1] > 0 && (
              <p className="text-sm">
                Range: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
              </p>
            )}
          </div>
          
          {adjustments.length > 0 && (
            <div className="mt-4">
              <h5 className="font-medium mb-2">Value Adjustments</h5>
              <div className="space-y-1">
                {adjustments.map((adj, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium">{adj.factor}:</span> {adj.description}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Comprehensive ValuationResult interface for backward compatibility
export interface ValuationResult {
  // Core properties
  id?: string;
  request_id?: string;
  estimatedValue: number;
  estimated_value?: number;
  confidenceScore: number;
  confidence_score?: number;
  comp_count?: number;
  priceRange?: [number, number];
  price_range?: {
    low: number;
    high: number;
    median: number;
  };
  
  // Status properties
  status?: 'pending' | 'in_progress' | 'completed' | 'failed';
  
  // Vehicle info
  vehicleInfo?: {
    make: string;
    model: string;
    year: number;
    mileage: number;
    condition: string;
  };
  
  // Additional properties for full compatibility
  market_listings?: any[];
  audit_logs?: any[];
  source_breakdown?: Record<string, any>;
  adjustments?: any[];
  finalValue?: number;
  baseValue?: number;
}

export interface ValuationRequest {
  vin?: string;
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  condition?: string;
  zipCode?: string;
  zip_code?: string;
  trim?: string;
  features?: string[];
  requested_by?: string;
  meta?: any;
}

export interface SourceStatus {
  source: string;
  name?: string;
  status: 'pending' | 'completed' | 'failed' | 'active';
  message?: string;
}

export interface AuditLog {
  id?: string;
  timestamp: Date;
  action: string;
  details: string;
  message?: string;
  created_at?: string;
  execution_time_ms?: number;
  raw_data?: any;
}

export class ValuationApiService {
  static async requestValuation(request: ValuationRequest): Promise<ValuationResult> {
    return {
      estimatedValue: 25000,
      confidenceScore: 85,
      priceRange: [22000, 28000]
    };
  }
  
  static async isValidVin(vin: string): Promise<boolean> {
    return vin.length === 17;
  }
  
  static async getCachedValuation(vin: string): Promise<ValuationResult | null> {
    return null;
  }
  
  static async createValuationRequest(request: ValuationRequest): Promise<{success: boolean, request_id?: string, error?: string}> {
    return {
      success: true,
      request_id: 'req_' + Date.now()
    };
  }
  
  static async triggerAggregation(requestId: string): Promise<{success: boolean, error?: string, sources_processed?: number, total_comps?: number}> {
    return {
      success: true,
      sources_processed: 3,
      total_comps: 15
    };
  }
  
  static async getValuationResult(requestId: string): Promise<ValuationResult | null> {
    return null;
  }
  
  static async getSourcesStatus(requestId?: string): Promise<{sources: SourceStatus[]}> {
    return {
      sources: []
    };
  }
  
  static async pollValuationProgress(
    requestId: string, 
    onProgress: (result: any) => void,
    maxAttempts: number = 10,
    interval: number = 1000
  ): Promise<{status: string, comp_count?: number} | null> {
    return {
      status: 'completed',
      comp_count: 5
    };
  }
}

export interface EnhancedValuationParams {
  vin?: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  baseMarketValue?: number;
  features?: string[];
  accidentCount?: number;
  trim?: string;
  bodyType?: string;
  transmission?: string;
  fuelType?: string;
  aiConditionOverride?: any;
}

export interface FinalValuationResult extends ValuationResult {
  baseValue: number;
  finalValue: number;
  adjustments: any[];
}

export interface ValuationParams {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  baseMarketValue?: number;
  features?: string[];
}

export { UnifiedValuationResult };
export default UnifiedValuationResult;
