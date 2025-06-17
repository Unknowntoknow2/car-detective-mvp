
import { useState, useEffect } from 'react';

export interface ValuationResult {
  id?: string;
  valuationId?: string;
  estimatedValue?: number;
  confidenceScore?: number;
  price_range?: [number, number] | { low: number; high: number };
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
}

export const useValuationResult = (valuationId: string) => {
  const [result, setResult] = useState<ValuationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!valuationId) {
      setIsLoading(false);
      return;
    }

    // Mock data for now
    setTimeout(() => {
      setResult({
        id: valuationId,
        estimatedValue: 25000,
        confidenceScore: 85,
        price_range: [23000, 27000],
        adjustments: [],
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        mileage: 50000,
        condition: 'Good'
      });
      setIsLoading(false);
    }, 1000);
  }, [valuationId]);

  return {
    data: result,
    isLoading,
    error
  };
};
