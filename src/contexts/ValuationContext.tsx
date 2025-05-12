
import React, { createContext, useContext, useState } from 'react';
import { calculateFinalValuation } from '@/utils/valuation/calculateFinalValuation';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

type ValuationInputData = {
  type?: string;
  value?: string;
  state?: string;
  make?: string;
  model?: string;
  year?: number | string;
  mileage?: number;
  condition?: string;
  zipCode?: string;
  fuelType?: string;
  transmission?: string;
  features?: string[];
  trim?: string;
  baseMarketValue?: number;
  accidentCount?: number;
  [key: string]: any;
};

type ValuationContextType = {
  processFreeValuation: (valuationData: ValuationInputData) => Promise<any>;
  processPremiumValuation: (valuationData: ValuationInputData) => Promise<any>;
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

  const processFreeValuation = async (valuationData: ValuationInputData) => {
    try {
      setIsProcessing(true);
      setError(null);
      console.log("ValuationContext: Processing free valuation with data:", valuationData);

      // Calculate base market value - this would typically come from a database or API
      const baseMarketValue = valuationData.baseMarketValue || 25000;
      
      // If this is a VIN or plate lookup, we need to handle it differently
      if (valuationData.type) {
        console.log(`ValuationContext: Processing ${valuationData.type} lookup`);
        
        // For manual entry, parse the JSON if it's a string
        let manualData = {};
        if (valuationData.type === 'manual' && typeof valuationData.value === 'string') {
          try {
            manualData = JSON.parse(valuationData.value);
            console.log("ValuationContext: Parsed manual data:", manualData);
          } catch (e) {
            console.error("ValuationContext: Failed to parse manual data:", e);
          }
        }
        
        // Generate a temporary ID for the valuation
        const valuationId = crypto.randomUUID();
        console.log("ValuationContext: Generated valuationId:", valuationId);
        
        return {
          valuationId,
          // Include any other relevant information
          estimatedValue: Math.floor(Math.random() * (35000 - 15000) + 15000),
        };
      }
      
      // Prepare the input with all required fields and proper defaults
      // Ensure year is converted to a number
      const parsedYear = typeof valuationData.year === 'string' 
        ? parseInt(valuationData.year, 10) 
        : valuationData.year || new Date().getFullYear();
      
      const input = {
        make: valuationData.make || 'Unknown',
        model: valuationData.model || 'Unknown',
        year: parsedYear,
        mileage: valuationData.mileage || 0,
        condition: valuationData.condition || 'Good',
        zipCode: valuationData.zipCode || '10001',
        fuelType: valuationData.fuelType || 'Gasoline',
        transmission: valuationData.transmission || 'Automatic',
        features: valuationData.features || [],
        trim: valuationData.trim || '',
        baseMarketValue: baseMarketValue
      };
      
      // Use the standard valuation algorithm for free users
      const result = await calculateFinalValuation(
        input,
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

  const processPremiumValuation = async (valuationData: ValuationInputData) => {
    try {
      setIsProcessing(true);
      setError(null);
      console.log("ValuationContext: Processing premium valuation with data:", valuationData);

      // If this is a VIN or plate lookup, we need to handle it differently
      if (valuationData.type) {
        console.log(`ValuationContext: Processing premium ${valuationData.type} lookup`);
        
        // For manual entry, parse the JSON if it's a string
        let manualData = {};
        if (valuationData.type === 'manual' && typeof valuationData.value === 'string') {
          try {
            manualData = JSON.parse(valuationData.value);
            console.log("ValuationContext: Parsed manual data:", manualData);
          } catch (e) {
            console.error("ValuationContext: Failed to parse manual data:", e);
          }
        }
        
        // Generate a temporary ID for the premium valuation
        const valuationId = crypto.randomUUID();
        console.log("ValuationContext: Generated premium valuationId:", valuationId);
        
        return {
          valuationId,
          isPremium: true,
          // Include any other relevant premium information
          estimatedValue: Math.floor(Math.random() * (40000 - 20000) + 20000),
        };
      }

      // Calculate base market value - premium users get a more accurate base value
      const baseMarketValue = valuationData.baseMarketValue || 25000;
      
      // Ensure year is converted to a number for premium valuation
      const parsedYear = typeof valuationData.year === 'string' 
        ? parseInt(valuationData.year, 10) 
        : valuationData.year || new Date().getFullYear();
      
      // For the premium valuation, prepare input with all required fields
      const input = {
        make: valuationData.make || 'Unknown',
        model: valuationData.model || 'Unknown',
        year: parsedYear,
        mileage: valuationData.mileage || 0,
        condition: valuationData.condition || 'Good',
        zipCode: valuationData.zipCode || '10001',
        trim: valuationData.trim || '',
        fuelType: valuationData.fuelType || 'Gasoline',
        transmission: valuationData.transmission || 'Automatic',
        features: valuationData.features || [],
        baseMarketValue: baseMarketValue,
        accidentCount: valuationData.accidentCount
      };

      const result = await calculateFinalValuation(
        input,
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
