
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ValuationResult {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  estimatedValue: number;
  confidenceScore: number;
  priceRange?: [number, number];
  adjustments?: any[];
  createdAt: string;
}

export function useValuationResult(id: string) {
  const [data, setData] = useState<ValuationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchValuation = async () => {
    if (!id) {
      setError(new Error('No valuation ID provided'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data: valuationData, error: fetchError } = await supabase
        .from('valuations')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (!valuationData) {
        throw new Error('Valuation not found');
      }

      // Transform data to expected format
      const result: ValuationResult = {
        id: valuationData.id,
        make: valuationData.make || '',
        model: valuationData.model || '',
        year: valuationData.year || 0,
        mileage: valuationData.mileage || 0,
        condition: getConditionText(valuationData.condition_score || 0),
        zipCode: valuationData.state || '',
        estimatedValue: valuationData.estimated_value || 0,
        confidenceScore: valuationData.confidence_score || 75,
        createdAt: valuationData.created_at,
        // Generate a price range for display purposes
        priceRange: [
          Math.round(valuationData.estimated_value * 0.93),
          Math.round(valuationData.estimated_value * 1.07)
        ],
        // Mock adjustments for now
        adjustments: generateMockAdjustments(valuationData)
      };

      setData(result);
    } catch (err) {
      console.error('Error fetching valuation:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch valuation data'));
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when ID changes
  useEffect(() => {
    if (id) {
      fetchValuation();
    } else {
      setData(null);
      setError(null);
    }
  }, [id]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchValuation
  };
}

// Helper function to convert condition score to text
function getConditionText(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Poor';
}

// Helper function to generate mock adjustment data for display
function generateMockAdjustments(valuationData: any) {
  const adjustments = [];
  
  // Mileage adjustment
  const mileage = valuationData.mileage || 50000;
  const avgMileage = 12000 * (new Date().getFullYear() - valuationData.year);
  const mileageDiff = mileage - avgMileage;
  
  if (Math.abs(mileageDiff) > 5000) {
    adjustments.push({
      factor: 'Mileage',
      description: mileageDiff > 0 ? 'Above average mileage' : 'Below average mileage',
      impact: mileageDiff > 0 ? -Math.round(mileageDiff / 5000) : Math.round(Math.abs(mileageDiff) / 10000),
    });
  }
  
  // Condition adjustment
  const conditionScore = valuationData.condition_score || 70;
  if (conditionScore >= 90) {
    adjustments.push({
      factor: 'Condition',
      description: 'Excellent condition',
      impact: 5,
    });
  } else if (conditionScore <= 50) {
    adjustments.push({
      factor: 'Condition',
      description: 'Below average condition',
      impact: -7,
    });
  }
  
  // Market demand adjustment (random for now)
  adjustments.push({
    factor: 'Market Demand',
    description: 'Current market conditions',
    impact: Math.floor(Math.random() * 7) - 3,
  });
  
  return adjustments;
}
