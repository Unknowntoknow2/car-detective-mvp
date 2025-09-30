
import { useState, useEffect } from 'react';
import { LegacyValuationResult } from '@/types/valuation';
import { getValuationById } from '@/utils/valuation';

export const useValuationResult = (valuationId?: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LegacyValuationResult | null>(null);

  useEffect(() => {
    if (valuationId) {
      fetchValuation(valuationId);
    }
  }, [valuationId]);

  const fetchValuation = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getValuationById(id);
      if (data) {
        setResult({
          id: data.id,
          make: data.make,
          model: data.model,
          year: data.year,
          mileage: data.mileage,
          condition: data.condition,
          estimatedValue: data.estimated_value,
          confidenceScore: data.confidence_score,
          priceRange: [
            Math.floor(data.estimated_value * 0.95),
            Math.ceil(data.estimated_value * 1.05)
          ],
          adjustments: [],
          zipCode: data.state
        });
      }
    } catch {
      setError('Failed to fetch valuation');
    } finally {
      setLoading(false);
    }
  };

  const calculateValuation = async (data: any) => {
    setLoading(true);
    setError(null);
    
    try {
      // This would integrate with actual valuation service
      const result = await fetchValuation(data.id);
      return result;
    } catch {
      setError('Failed to calculate valuation');
      return null;
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
    valuation: result
  };
};
