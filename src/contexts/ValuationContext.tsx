
import React, { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';

interface ValuationData {
  type: string;
  value: string;
  state?: string;
  make?: string;
  model?: string;
  year?: number;
  zipCode?: string;
  [key: string]: any;
}

interface ValuationResult {
  valuationId: string;
  estimatedValue?: number;
  success: boolean;
}

interface ValuationContextType {
  processFreeValuation: (data: ValuationData) => Promise<ValuationResult>;
  processPremiumValuation: (data: ValuationData) => Promise<ValuationResult>;
  isLoading: boolean;
}

const ValuationContext = createContext<ValuationContextType | undefined>(undefined);

export const useValuation = () => {
  const context = useContext(ValuationContext);
  if (!context) {
    throw new Error('useValuation must be used within a ValuationProvider');
  }
  return context;
};

export const ValuationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const processFreeValuation = async (data: ValuationData): Promise<ValuationResult> => {
    setIsLoading(true);
    try {
      console.log('Processing free valuation:', data);
      
      // Mock valuation processing - replace with actual Supabase call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResult = {
        valuationId: `val_${Date.now()}`,
        estimatedValue: Math.floor(Math.random() * 50000) + 15000,
        success: true
      };
      
      return mockResult;
    } catch (error) {
      console.error('Free valuation error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const processPremiumValuation = async (data: ValuationData): Promise<ValuationResult> => {
    setIsLoading(true);
    try {
      console.log('Processing premium valuation:', data);
      
      // Mock premium valuation processing - replace with actual Supabase call
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const mockResult = {
        valuationId: `prem_val_${Date.now()}`,
        estimatedValue: Math.floor(Math.random() * 60000) + 20000,
        success: true
      };
      
      return mockResult;
    } catch (error) {
      console.error('Premium valuation error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ValuationContext.Provider value={{
      processFreeValuation,
      processPremiumValuation,
      isLoading
    }}>
      {children}
    </ValuationContext.Provider>
  );
};
