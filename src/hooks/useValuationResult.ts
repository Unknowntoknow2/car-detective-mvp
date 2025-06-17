import { useState, useEffect } from 'react';
import { ValuationResult } from '@/types/valuation';

export const useValuationResult = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    adjustments: []
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  return {
    loading,
    error,
    valuation: {
      ...mockValuation,
      // Remove vin property if it's causing issues, or ensure ValuationResult includes it
      id: mockValuation.id,
      make: mockValuation.make,
      model: mockValuation.model,
      year: mockValuation.year,
      mileage: mockValuation.mileage,
      condition: mockValuation.condition,
      confidenceScore: mockValuation.confidenceScore,
      estimatedValue: mockValuation.estimatedValue,
      zipCode: mockValuation.zipCode,
      adjustments: mockValuation.adjustments
    }
  };
};
