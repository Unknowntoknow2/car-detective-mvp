
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

export type ValuationContextType = {
  isPremium: boolean;
  hasPurchasedReport: boolean;
  purchaseReport: () => Promise<void>;
  downloadPdf: () => Promise<void>;
  isLoading: boolean;
  isProcessing: boolean;
  error: Error | null;
  processFreeValuation: (valuationData: any) => Promise<{ valuationId?: string; estimatedValue?: number; confidenceScore?: number } | null>;
  processPremiumValuation: (valuationData: any) => Promise<{ valuationId?: string } | null>;
};

// Create context with default values
const ValuationContext = createContext<ValuationContextType>({
  isPremium: false,
  hasPurchasedReport: false,
  purchaseReport: async () => {},
  downloadPdf: async () => {},
  isLoading: false,
  isProcessing: false,
  error: null,
  processFreeValuation: async () => null,
  processPremiumValuation: async () => null,
});

// Provider component
export const ValuationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [hasPurchasedReport, setHasPurchasedReport] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Mock functions for demonstration
  const purchaseReport = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setHasPurchasedReport(true);
      toast.success('Report purchased successfully!');
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to purchase report'));
      toast.error('Failed to purchase report');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPdf = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('PDF downloaded successfully!');
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to download PDF'));
      toast.error('Failed to download PDF');
    } finally {
      setIsLoading(false);
    }
  };

  // Process a free valuation
  const processFreeValuation = async (valuationData: any) => {
    console.log('Processing free valuation:', valuationData);
    setIsProcessing(true);
    
    try {
      // Simulate API call to process valuation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a mock valuation ID
      const valuationId = `free-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const estimatedValue = Math.floor(15000 + Math.random() * 10000);
      const confidenceScore = Math.floor(70 + Math.random() * 25);
      
      return { valuationId, estimatedValue, confidenceScore };
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to process free valuation'));
      toast.error('Failed to process valuation');
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  // Process a premium valuation
  const processPremiumValuation = async (valuationData: any) => {
    console.log('Processing premium valuation:', valuationData);
    setIsProcessing(true);
    
    try {
      // Check if user has premium access
      if (!isPremium && !hasPurchasedReport) {
        toast.info('Premium access required for this feature');
        return null;
      }
      
      // Simulate API call to process premium valuation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a mock valuation ID
      const valuationId = `premium-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      return { valuationId };
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to process premium valuation'));
      toast.error('Failed to process premium valuation');
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ValuationContext.Provider
      value={{
        isPremium,
        hasPurchasedReport,
        purchaseReport,
        downloadPdf,
        isLoading,
        isProcessing,
        error,
        processFreeValuation,
        processPremiumValuation,
      }}
    >
      {children}
    </ValuationContext.Provider>
  );
};

// Hook to use the context
export const useValuation = () => {
  const context = useContext(ValuationContext);
  if (context === undefined) {
    throw new Error('useValuation must be used within a ValuationProvider');
  }
  return context;
};
