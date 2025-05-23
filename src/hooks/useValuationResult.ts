
import { useState, useEffect } from 'react';
import { ValuationResult } from '@/types/valuation';

interface PriceRange {
  low: number;
  high: number;
}

export interface UseValuationResultReturn {
  data: ValuationResult | null;
  isLoading: boolean;
  error: string | null;
  priceRange: PriceRange;
  isError: boolean;
  refetch: () => void;
}

export const useValuationResult = (valuationId: string): UseValuationResultReturn => {
  const [data, setData] = useState<ValuationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock data
      const mockData: ValuationResult = {
        id: valuationId,
        make: 'Toyota',
        model: 'Camry',
        year: 2019,
        mileage: 45000,
        condition: 'Good',
        estimatedValue: 18500,
        confidenceScore: 90,
        valuationId: `vin-${Date.now()}`,
        vin: '1234567890',
        fuelType: 'Gasoline',
        transmission: 'Automatic',
        bodyType: 'Sedan',
        trim: 'LE',
        color: 'Silver',
        isPremium: false,
        price_range: {
          low: 17575,
          high: 19425
        },
        userId: '',
        aiCondition: {
          condition: 'Good',
          confidenceScore: 90,
          issuesDetected: []
        }
      };

      setData(mockData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch valuation result');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (valuationId) {
      fetchData();
    }
  }, [valuationId]);

  // Add refetch function
  const refetch = () => {
    if (valuationId) {
      fetchData();
    }
  };

  // Update the code to handle both array and object price range formats correctly:
  const priceRange = data?.priceRange || data?.price_range;
  const formattedPriceRange = {
    low: Array.isArray(priceRange) 
      ? priceRange[0] 
      : (priceRange?.low || Math.round((data?.estimatedValue || 0) * 0.95)),
    high: Array.isArray(priceRange) 
      ? priceRange[1] 
      : (priceRange?.high || Math.round((data?.estimatedValue || 0) * 1.05))
  };

  return {
    data,
    isLoading,
    error,
    priceRange: formattedPriceRange,
    isError: !!error,
    refetch
  };
};
