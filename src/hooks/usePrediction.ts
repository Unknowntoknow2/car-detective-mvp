
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function usePrediction() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrediction = async (valuationId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First check if prediction already exists in database
      const { data: existingPrediction, error: fetchError } = await supabase
        .from('valuations')
        .select('*')
        .eq('id', valuationId)
        .single();
      
      if (!fetchError && existingPrediction) {
        // Return existing prediction
        setIsLoading(false);
        return {
          estimatedValue: existingPrediction.base_price,
          confidenceScore: 0.85,
          priceRange: [
            existingPrediction.base_price * 0.95,
            existingPrediction.base_price * 1.05
          ],
          adjustments: [
            { name: 'Mileage', value: -500, percentage: -0.02 },
            { name: 'Condition', value: 1200, percentage: 0.05 },
            { name: 'Market Demand', value: 300, percentage: 0.01 }
          ]
        };
      }
      
      // If not found, we'd typically call a backend API
      // For now, let's return mock data
      
      // In a real app, you would fetch from your API:
      // const response = await fetch(`/api/predictions/${valuationId}`);
      // const data = await response.json();
      
      // Mock prediction data
      const mockPrediction = {
        estimatedValue: 22500,
        confidenceScore: 0.85,
        priceRange: [21375, 23625],
        adjustments: [
          { name: 'Mileage', value: -500, percentage: -0.02 },
          { name: 'Condition', value: 1200, percentage: 0.05 },
          { name: 'Market Demand', value: 300, percentage: 0.01 }
        ]
      };
      
      // In a real app, you would store this in the database
      // For now, we'll log it to the console
      console.log('Generated prediction for', valuationId, mockPrediction);
      
      setIsLoading(false);
      return mockPrediction;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch prediction';
      setError(errorMessage);
      setIsLoading(false);
      toast.error(errorMessage);
      
      console.error('Prediction error:', err);
      return null;
    }
  };

  return {
    fetchPrediction,
    isLoading,
    error
  };
}
