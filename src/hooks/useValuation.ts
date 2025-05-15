
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { ValuationInput } from '@/types/valuation';

// Mock valuation generation function
async function generateValuationMock(input: ValuationInput) {
  console.log('VALUATION: Generating valuation for', input);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Create a mock valuation ID
  const valuationId = uuidv4();
  
  // Calculate a confidence score based on the provided data
  let confidenceScore = 75; // Base score
  
  // More data = higher confidence
  if (input.mileage) confidenceScore += 5;
  if (input.condition) confidenceScore += 5;
  if (input.zipCode) confidenceScore += 5;
  if (input.vin) confidenceScore += 10;
  if (input.isPremium) confidenceScore += 10;
  
  // Cap at 100
  confidenceScore = Math.min(confidenceScore, 100);
  
  console.log('VALUATION: Generated valuation with ID:', valuationId, 'and confidence:', confidenceScore);
  
  return {
    success: true,
    valuationId,
    confidenceScore,
  };
}

interface UseValuationResult {
  generateValuation: (input: ValuationInput) => Promise<any>;
  isLoading: boolean;
  error: string | null;
}

export function useValuation(): UseValuationResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const generateValuation = useCallback(async (input: ValuationInput) => {
    try {
      console.log('VALUATION: Starting valuation process for:', input);
      setIsLoading(true);
      setError(null);
      
      // Validate required fields
      if (!input.zipCode) {
        throw new Error('ZIP code is required');
      }
      
      // Generate the valuation
      const result = await generateValuationMock(input);
      
      if (result.success) {
        console.log('VALUATION: Successfully generated valuation');
        toast.success('Valuation generated successfully!');
        return result;
      } else {
        throw new Error(result.error || 'Failed to generate valuation');
      }
    } catch (err: any) {
      console.error('VALUATION: Error generating valuation:', err);
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  return {
    generateValuation,
    isLoading,
    error
  };
}
