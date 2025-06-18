
import { useState, useEffect } from 'react';
import { ValuationResult } from '@/types/valuation';

export const useValuationResult = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ValuationResult | null>(null);

  // Mock valuation data for demonstration purposes
  const mockValuation: ValuationResult = {
    id: '123',
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    mileage: 50000,
    condition: 'Good',
    confidenceScore: 0.85,
    estimatedValue: 18000,
    zipCode: '90210',
    adjustments: [],
    price_range: [17000, 19000]
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setResult(mockValuation);
      setLoading(false);
    }, 500);
  }, []);

  const calculateValuation = async (data: any) => {
    setLoading(true);
    try {
      // Mock calculation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResult({
        ...mockValuation,
        ...data
      });
    } catch (err) {
      setError('Failed to calculate valuation');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    result,
    isLoading: loading,
    calculateValuation,
    valuation: result || mockValuation
  };
};
