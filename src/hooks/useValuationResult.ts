
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getBestPhotoUrl } from '@/utils/valuation/photoUtils';

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

      // First get the basic valuation data
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

      // Fetch best photo data separately using the utility function
      let bestPhoto = null;
      let bestPhotoUrl = null;
      let photoScore = null;
      let photoExplanation = null;

      try {
        // Get photo data from valuation_photos table
        const { data: photosData, error: photosError } = await supabase
          .from('valuation_photos')
          .select('photo_url, score')
          .eq('valuation_id', valuationId)
          .order('score', { ascending: false })
          .limit(1);
          
        if (!photosError && photosData && photosData.length > 0) {
          bestPhoto = photosData[0];
          bestPhotoUrl = bestPhoto.photo_url;
          photoScore = bestPhoto.score;
          // Default empty explanation if column doesn't exist
          photoExplanation = '';
        }
      } catch (photoErr) {
        console.error('Error fetching photo data:', photoErr);
        // Continue with null photo data
      }

      // Determine condition from condition score
      const condition = valuationData.condition_score ? 
                  (valuationData.condition_score >= 90 ? 'Excellent' : 
                   valuationData.condition_score >= 75 ? 'Good' : 
                   valuationData.condition_score >= 60 ? 'Fair' : 'Poor') : 
                  'Good';

      // Transform the Supabase data to our expected format
      const transformedData: ValuationData = {
        id: valuationData.id,
        make: valuationData.make || '',
        model: valuationData.model || '',
        year: valuationData.year || 0,
        mileage: valuationData.mileage || 0,
        condition: condition,
        zipCode: valuationData.state || '',
        estimatedValue: valuationData.estimated_value || 0,
        confidenceScore: valuationData.confidence_score || 75,
        priceRange: [
          Math.round((valuationData.estimated_value || 0) * 0.95),
          Math.round((valuationData.estimated_value || 0) * 1.05)
        ],
        adjustments: [
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
        
        // Extract additional properties with proper fallbacks
        color: valuationData.color || '',
        bodyStyle: valuationData.body_style || '',
        bodyType: valuationData.body_type || '',
        fuelType: '',
        explanation: '',
        transmission: '',
        bestPhotoUrl: bestPhotoUrl,
        photoScore: photoScore,
        photoExplanation: photoExplanation,
        aiCondition: null
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
