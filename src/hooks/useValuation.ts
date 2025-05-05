
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FormData } from '@/types/premium-valuation';

export interface AIConditionOverride {
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  confidenceScore: number;
}

export function useValuation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [predictionResult, setPredictionResult] = useState<any | null>(null);

  const fetchValuationPrediction = async (formData: FormData) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Try to fetch AI condition data if available
      let aiConditionOverride: AIConditionOverride | undefined;
      
      try {
        // valuationId is a required parameter for photo scores
        if (formData.valuationId) {
          const { data: photoScoreData, error: photoScoreError } = await supabase
            .from('photo_scores')
            .select('metadata, score')
            .eq('valuation_id', formData.valuationId)
            .maybeSingle();
          
          if (!photoScoreError && photoScoreData && photoScoreData.metadata) {
            // Safely access condition from metadata which is a JSON object
            const metadata = typeof photoScoreData.metadata === 'string' 
              ? JSON.parse(photoScoreData.metadata)
              : photoScoreData.metadata;
              
            // Map the photo score data to our expected format
            aiConditionOverride = {
              condition: metadata?.condition || 'Fair',
              confidenceScore: Math.round((photoScoreData.score || 0) * 100)
            };
            console.log('Found AI condition override:', aiConditionOverride);
          }
        }
      } catch (photoError) {
        console.error('Error fetching photo score data:', photoError);
        // Continue without AI data if fetch fails
      }

      // Call the car-price-prediction edge function
      const response = await supabase.functions.invoke('car-price-prediction', {
        body: {
          make: formData.make,
          model: formData.model,
          year: formData.year,
          mileage: formData.mileage || 0,
          condition: formData.conditionLabel?.toLowerCase(),
          fuelType: formData.fuelType || 'Gasoline',
          zipCode: formData.zipCode,
          accident: typeof formData.hasAccident === 'string' 
            ? formData.hasAccident 
            : formData.hasAccident ? 'yes' : 'no',
          ...(formData.hasAccident && {
            accidentDetails: {
              count: '1', // Default to 1 for now
              severity: 'minor', // Default to minor
              area: 'general'
            }
          }),
          includeCarfax: false, // Can be expanded in the future
          exteriorColor: formData.exteriorColor,
          interiorColor: formData.interiorColor,
          bodyStyle: formData.bodyStyle,
          trim: formData.trim,
          valuationId: formData.valuationId,
          aiConditionOverride
        }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to get valuation');
      }

      const result = response.data;
      console.log('Prediction result:', result);

      setPredictionResult(result);
      
      return result;
    } catch (err: any) {
      console.error('Valuation prediction error:', err);
      setError(err.message || 'Failed to get vehicle valuation. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    predictionResult,
    fetchValuationPrediction
  };
}
