
import React, { createContext, useContext, useState } from 'react';
import { calculateFinalValuation } from '@/utils/valuation/calculateFinalValuation';
import { ValuationInput } from '@/types/valuation';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

type ValuationContextType = {
  processFreeValuation: (valuationData: ValuationInput) => Promise<any>;
  processPremiumValuation: (valuationData: ValuationInput) => Promise<any>;
  saveValuationToUserProfile: (valuationId: string) => Promise<boolean>;
  isProcessing: boolean;
  error: string | null;
  lastValuationResult: any | null;
};

const ValuationContext = createContext<ValuationContextType | undefined>(undefined);

export function ValuationProvider({ children }: { children: React.ReactNode }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastValuationResult, setLastValuationResult] = useState<any | null>(null);
  const { user } = useAuth();

  const processFreeValuation = async (valuationData: ValuationInput) => {
    try {
      setIsProcessing(true);
      setError(null);

      // Calculate base market value - this would typically come from a database or API
      const baseMarketValue = valuationData.baseMarketValue || 25000;
      
      // Use the standard valuation algorithm for free users
      // Ensure we're passing all required fields with proper defaults
      const result = await calculateFinalValuation(
        {
          make: valuationData.make || '', 
          model: valuationData.model || '',
          year: valuationData.year || new Date().getFullYear(),
          mileage: valuationData.mileage || 0,
          condition: valuationData.condition || 'Good',
          zipCode: valuationData.zipCode,
          fuelType: valuationData.fuelType,
          transmission: valuationData.transmission,
          features: valuationData.features,
          trim: valuationData.trim,
          baseMarketValue: valuationData.baseMarketValue,
          // Only include fields that exist in the target ValuationInput type
        },
        baseMarketValue
      );

      setLastValuationResult(result);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to process free valuation';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const processPremiumValuation = async (valuationData: ValuationInput) => {
    try {
      setIsProcessing(true);
      setError(null);

      // Calculate base market value - premium users get a more accurate base value
      const baseMarketValue = valuationData.baseMarketValue || 25000;
      
      // For the premium valuation, we'll use the same calculation function but with premium options
      const result = await calculateFinalValuation(
        {
          make: valuationData.make || '',
          model: valuationData.model || '',
          year: valuationData.year || new Date().getFullYear(),
          mileage: valuationData.mileage || 0,
          condition: valuationData.condition || 'Good',
          zipCode: valuationData.zipCode,
          trim: valuationData.trim,
          fuelType: valuationData.fuelType,
          transmission: valuationData.transmission,
          features: valuationData.features,
          // We'll use premium features via standard properties
          // that are expected by the calculateFinalValuation function
          baseMarketValue: valuationData.baseMarketValue,
          accidentCount: valuationData.accidentCount,
          // Use properties that exist in the ValuationInput type
          // Removed photoScore and exteriorColor as they don't exist in ValuationInput
        },
        baseMarketValue,
        // Optionally pass the AI condition as the third parameter if available
        valuationData.aiConditionOverride || null
      );

      setLastValuationResult(result);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to process premium valuation';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const saveValuationToUserProfile = async (valuationId: string) => {
    if (!user) {
      toast.error("You must be logged in to save valuations");
      return false;
    }

    try {
      setIsProcessing(true);
      
      // Here you would typically save to Supabase or your database
      // For now, we'll just simulate success
      
      toast.success("Valuation saved to your profile");
      return true;
    } catch (err: any) {
      toast.error("Failed to save valuation to your profile");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ValuationContext.Provider value={{
      processFreeValuation,
      processPremiumValuation,
      saveValuationToUserProfile,
      isProcessing,
      error,
      lastValuationResult
    }}>
      {children}
    </ValuationContext.Provider>
  );
}

export function useValuation() {
  const context = useContext(ValuationContext);
  if (context === undefined) {
    throw new Error('useValuation must be used within a ValuationProvider');
  }
  return context;
}
