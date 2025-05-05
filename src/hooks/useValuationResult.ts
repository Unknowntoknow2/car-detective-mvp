
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ValuationResultData {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  estimatedValue: number;
  confidenceScore?: number;
  priceRange?: [number, number];
  adjustments?: Array<{
    factor: string;
    impact: number;
    description?: string;
  }>;
}

export function useValuationResult(valuationId: string) {
  const [data, setData] = useState<ValuationResultData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchValuationResult = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: valuationData, error: valuationError } = await supabase
        .from('valuations')
        .select('*')
        .eq('id', valuationId)
        .single();
        
      if (valuationError) throw new Error(valuationError.message);
      
      if (valuationData) {
        // Transform the data to the expected format with camelCase properties
        // Create adjustments array from valuation data
        const formattedAdjustments = [];
        
        // Add condition adjustment if available
        if (valuationData.condition_score) {
          formattedAdjustments.push({
            factor: 'Condition',
            impact: calculateConditionImpact(valuationData.condition_score),
            description: `Vehicle condition score: ${valuationData.condition_score}`
          });
        }
        
        // Add mileage adjustment if available
        if (valuationData.mileage) {
          formattedAdjustments.push({
            factor: 'Mileage',
            impact: calculateMileageImpact(valuationData.mileage),
            description: `Vehicle mileage: ${valuationData.mileage.toLocaleString()} miles`
          });
        }
        
        // Add market adjustment if available
        if (valuationData.zip_demand_factor) {
          formattedAdjustments.push({
            factor: 'Market',
            impact: Math.round((valuationData.zip_demand_factor - 1) * 100),
            description: 'Based on local market demand'
          });
        }
        
        setData({
          id: valuationData.id,
          make: valuationData.make || '',
          model: valuationData.model || '',
          year: valuationData.year || 0,
          mileage: valuationData.mileage || 0,
          condition: getConditionLabel(valuationData.condition_score),
          zipCode: valuationData.state || '',
          estimatedValue: valuationData.estimated_value || 0,
          confidenceScore: valuationData.confidence_score,
          priceRange: calculatePriceRange(valuationData.estimated_value),
          adjustments: formattedAdjustments
        });
      }
    } catch (err) {
      console.error('Error fetching valuation result:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch valuation data'));
    } finally {
      setIsLoading(false);
    }
  }, [valuationId]);
  
  useEffect(() => {
    if (valuationId) {
      fetchValuationResult();
    }
  }, [valuationId, fetchValuationResult]);
  
  return { 
    data, 
    isLoading, 
    error,
    isError: !!error,
    refetch: fetchValuationResult
  };
}

// Helper function to calculate price range based on estimated value
function calculatePriceRange(value: number | null | undefined): [number, number] {
  if (!value) return [0, 0];
  return [
    Math.round(value * 0.95), // Lower bound: 95% of estimated value
    Math.round(value * 1.05)  // Upper bound: 105% of estimated value
  ];
}

// Helper function to convert condition score to label
function getConditionLabel(score: number | null | undefined): string {
  if (!score) return 'Unknown';
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Poor';
}

// Helper function to calculate condition impact
function calculateConditionImpact(score: number | null | undefined): number {
  if (!score) return 0;
  if (score >= 85) return 10;     // Excellent: +10%
  if (score >= 70) return 5;      // Good: +5%
  if (score >= 50) return 0;      // Fair: 0%
  return -10;                     // Poor: -10%
}

// Helper function to calculate mileage impact
function calculateMileageImpact(mileage: number | null | undefined): number {
  if (!mileage) return 0;
  if (mileage < 10000) return 15;          // Very low: +15%
  if (mileage < 30000) return 10;          // Low: +10%
  if (mileage < 60000) return 5;           // Below average: +5%
  if (mileage < 100000) return 0;          // Average: 0%
  if (mileage < 150000) return -5;         // Above average: -5%
  if (mileage < 200000) return -10;        // High: -10%
  return -20;                             // Very high: -20%
}
