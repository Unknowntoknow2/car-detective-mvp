
import { useState, useCallback } from 'react';

export interface ValuationResult {
  id?: string;
  valuationId?: string;
  estimatedValue?: number;
  confidenceScore?: number;
  price_range?: [number, number] | { low: number; high: number };
  priceRange?: [number, number];
  adjustments?: any[];
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  condition?: string;
  premium_unlocked?: boolean;
  accident_count?: number;
  titleStatus?: string;
  created_at?: string;
  createdAt?: string;
  vin?: string;
}

export const useValuationResult = (valuationId?: string) => {
  const [result, setResult] = useState<ValuationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculateValuation = useCallback(async (vehicleData?: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock valuation calculation
      const mockResult: ValuationResult = {
        id: valuationId || `val_${Date.now()}`,
        estimatedValue: 18500,
        confidenceScore: 85,
        year: vehicleData?.year || 2020,
        make: vehicleData?.make || 'Toyota',
        model: vehicleData?.model || 'Camry',
        vin: vehicleData?.vin,
        mileage: vehicleData?.mileage || 50000,
        condition: vehicleData?.condition || 'good',
        priceRange: [16000, 21000],
        adjustments: [
          { factor: 'Mileage', impact: -5, description: 'Above average mileage' },
          { factor: 'Condition', impact: 3, description: 'Good condition' }
        ],
        createdAt: new Date().toISOString(),
        premium_unlocked: false,
        accident_count: 0,
        titleStatus: 'Clean'
      };
      
      setResult(mockResult);
      setIsLoading(false);
      return mockResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Valuation failed';
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  }, [valuationId]);

  // For compatibility with existing code
  const data = result;

  return {
    result,
    data,
    isLoading,
    error,
    calculateValuation,
    clearResult: () => {
      setResult(null);
      setError(null);
    }
  };
};
