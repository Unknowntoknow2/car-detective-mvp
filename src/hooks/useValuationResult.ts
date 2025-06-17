
import { useState, useCallback } from 'react';
import { ValuationResult } from '@/types/valuation';

export const useValuationResult = () => {
  const [result, setResult] = useState<ValuationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateValuation = useCallback(async (vehicleData: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock valuation calculation
      const mockResult: ValuationResult = {
        id: `val_${Date.now()}`,
        estimatedValue: 18500,
        confidenceScore: 85,
        year: vehicleData.year,
        make: vehicleData.make,
        model: vehicleData.model,
        vin: vehicleData.vin,
        mileage: vehicleData.mileage,
        condition: vehicleData.condition,
        priceRange: [16000, 21000],
        adjustments: [
          { factor: 'Mileage', impact: -5, description: 'Above average mileage' },
          { factor: 'Condition', impact: 3, description: 'Good condition' }
        ],
        createdAt: new Date().toISOString()
      };
      
      setResult(mockResult);
      return mockResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Valuation failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    result,
    isLoading,
    error,
    calculateValuation,
    clearResult: () => {
      setResult(null);
      setError(null);
    }
  };
};
