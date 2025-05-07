
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ValuationData {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  estimatedValue: number;
  confidenceScore: number;
  priceRange: [number, number];
  adjustments?: { factor: string; impact: number; description: string }[];
  createdAt: string;
  aiCondition?: any;
  isPremium?: boolean;
  // Add missing properties for PremiumValuationPage
  color?: string;
  bodyStyle?: string;
  bodyType?: string;
  fuelType?: string;
  explanation?: string;
  transmission?: string;
  bestPhotoUrl?: string;
  photoScore?: number;
  photoExplanation?: string;
}

export function useValuationResult(valuationId: string) {
  const [data, setData] = useState<ValuationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isError, setIsError] = useState(false);

  const fetchValuation = async () => {
    if (!valuationId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setIsError(false);

      const { data: valuationData, error: valuationError } = await supabase
        .from('valuations')
        .select('*')
        .eq('id', valuationId)
        .single();

      if (valuationError) {
        throw new Error(valuationError.message);
      }

      if (!valuationData) {
        throw new Error('Valuation not found');
      }

      // Extract data from JSONB field or use defaults
      const jsonData = valuationData.data || {};

      // Transform the Supabase data to our expected format
      const transformedData: ValuationData = {
        id: valuationData.id,
        make: valuationData.make || '',
        model: valuationData.model || '',
        year: valuationData.year || 0,
        mileage: valuationData.mileage || 0,
        // Use condition from database directly or derive it from condition_score
        condition: valuationData.condition_score ? 
                    (valuationData.condition_score >= 90 ? 'Excellent' : 
                     valuationData.condition_score >= 75 ? 'Good' : 
                     valuationData.condition_score >= 60 ? 'Fair' : 'Poor') : 
                    'Good',
        zipCode: valuationData.state || '',
        estimatedValue: valuationData.estimated_value || 0,
        confidenceScore: valuationData.confidence_score || 75,
        priceRange: [
          Math.round((valuationData.estimated_value || 0) * 0.95),
          Math.round((valuationData.estimated_value || 0) * 1.05)
        ],
        adjustments: jsonData.adjustments || [
          { 
            factor: 'Base Condition', 
            impact: 0, 
            description: 'Baseline vehicle value' 
          },
          { 
            factor: 'Market Demand', 
            impact: 1.5, 
            description: 'Current market conditions' 
          }
        ],
        createdAt: valuationData.created_at,
        isPremium: valuationData.premium_unlocked || false,
        
        // Extract additional properties from valuation and JSONB data field with proper fallbacks
        color: valuationData.color || jsonData.color || '',
        bodyStyle: valuationData.body_style || jsonData.body_style || '',
        bodyType: valuationData.body_type || jsonData.body_type || '',
        fuelType: jsonData.fuel_type || '',
        explanation: jsonData.explanation || '',
        transmission: jsonData.transmission || '',
        bestPhotoUrl: jsonData.best_photo_url || null,
        photoScore: jsonData.photo_score || null,
        photoExplanation: jsonData.photo_explanation || null,
        aiCondition: jsonData.ai_condition || null
      };

      setData(transformedData);
    } catch (err) {
      console.error('Error fetching valuation:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch valuation data'));
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchValuation();
  }, [valuationId]);

  return {
    data,
    isLoading,
    error,
    isError,
    refetch: fetchValuation
  };
}
