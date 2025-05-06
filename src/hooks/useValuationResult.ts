
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ValuationResult } from '@/types/valuation';
import { convertLegacyAdjustmentsToNewFormat } from '@/utils/formatters/adjustment-formatter';
import { getRegionalMarketMultiplierAsync } from '@/utils/adjustments/locationAdjustments';

export function useValuationResult(valuationId: string) {
  const [data, setData] = useState<ValuationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!valuationId) {
      setIsLoading(false);
      setIsError(true);
      setError(new Error('No valuation ID provided'));
      return;
    }

    async function fetchValuationData() {
      setIsLoading(true);
      setError(null);
      setIsError(false);

      try {
        // Fetch the valuation record
        const { data: valuationData, error: valuationError } = await supabase
          .from('valuations')
          .select('*')
          .eq('id', valuationId)
          .single();

        if (valuationError) {
          throw new Error(`Failed to fetch valuation: ${valuationError.message}`);
        }

        if (!valuationData) {
          throw new Error('Valuation not found');
        }

        // Get the market multiplier for the ZIP code
        const zipCode = valuationData.state || '';
        const marketMultiplier = await getRegionalMarketMultiplierAsync(zipCode);
        
        // Calculate market adjustment value
        const marketAdjustmentValue = valuationData.estimated_value * marketMultiplier;
        
        // Transform the data to match the ValuationResult interface
        const result: ValuationResult = {
          id: valuationData.id,
          make: valuationData.make,
          model: valuationData.model,
          year: valuationData.year,
          mileage: valuationData.mileage,
          condition: valuationData.condition_score ? 
            (valuationData.condition_score >= 80 ? 'Excellent' : 
             valuationData.condition_score >= 70 ? 'Good' : 
             valuationData.condition_score >= 50 ? 'Fair' : 'Poor') : 'Good',
          confidenceScore: valuationData.confidence_score || 75,
          zipCode: valuationData.state || '',
          estimatedValue: valuationData.estimated_value,
          priceRange: [
            Math.round(valuationData.estimated_value * 0.95),
            Math.round(valuationData.estimated_value * 1.05)
          ],
          adjustments: convertLegacyAdjustmentsToNewFormat([
            { name: 'Base Value', value: 0, percentage: 0 },
            { name: 'Condition Adjustment', value: Math.round(valuationData.estimated_value * 0.01), percentage: 0.01 },
            { 
              name: 'Location Adjustment', 
              value: Math.round(marketAdjustmentValue), 
              percentage: marketMultiplier 
            }
          ]),
          createdAt: valuationData.created_at
        };

        setData(result);
      } catch (err: any) {
        console.error('Error fetching valuation data:', err);
        setError(err instanceof Error ? err : new Error(err.message || 'Unknown error'));
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchValuationData();
  }, [valuationId]);

  const refetch = async () => {
    if (!valuationId) return;
    
    setIsLoading(true);
    setError(null);
    setIsError(false);
    
    try {
      // Fetch the valuation record
      const { data: valuationData, error: valuationError } = await supabase
        .from('valuations')
        .select('*')
        .eq('id', valuationId)
        .single();

      if (valuationError) {
        throw new Error(`Failed to fetch valuation: ${valuationError.message}`);
      }

      if (!valuationData) {
        throw new Error('Valuation not found');
      }

      // Get the market multiplier for the ZIP code
      const zipCode = valuationData.state || '';
      const marketMultiplier = await getRegionalMarketMultiplierAsync(zipCode);
      
      // Calculate market adjustment value
      const marketAdjustmentValue = valuationData.estimated_value * marketMultiplier;

      // Transform the data to match the ValuationResult interface
      const result: ValuationResult = {
        id: valuationData.id,
        make: valuationData.make,
        model: valuationData.model,
        year: valuationData.year,
        mileage: valuationData.mileage,
        condition: valuationData.condition_score ? 
          (valuationData.condition_score >= 80 ? 'Excellent' : 
           valuationData.condition_score >= 70 ? 'Good' : 
           valuationData.condition_score >= 50 ? 'Fair' : 'Poor') : 'Good',
        confidenceScore: valuationData.confidence_score || 75,
        zipCode: valuationData.state || '',
        estimatedValue: valuationData.estimated_value,
        priceRange: [
          Math.round(valuationData.estimated_value * 0.95),
          Math.round(valuationData.estimated_value * 1.05)
        ],
        adjustments: convertLegacyAdjustmentsToNewFormat([
          { name: 'Base Value', value: 0, percentage: 0 },
          { name: 'Condition Adjustment', value: Math.round(valuationData.estimated_value * 0.01), percentage: 0.01 },
          { 
            name: 'Location Adjustment', 
            value: Math.round(marketAdjustmentValue), 
            percentage: marketMultiplier 
          }
        ]),
        createdAt: valuationData.created_at
      };

      setData(result);
    } catch (err: any) {
      console.error('Error fetching valuation data:', err);
      setError(err instanceof Error ? err : new Error(err.message || 'Unknown error'));
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, isError, refetch };
}
