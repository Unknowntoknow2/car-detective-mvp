
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';

export type ValuationContextType = {
  isPremium: boolean;
  hasPurchasedReport: boolean;
  purchaseReport: () => Promise<void>;
  downloadPdf: () => Promise<void>;
  isLoading: boolean;
  error: Error | null;
};

// Create context with default values
const ValuationContext = createContext<ValuationContextType>({
  isPremium: false,
  hasPurchasedReport: false,
  purchaseReport: async () => {},
  downloadPdf: async () => {},
  isLoading: false,
  error: null,
});

// Provider component
export const ValuationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [hasPurchasedReport, setHasPurchasedReport] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  return (
    <ValuationContext.Provider
      value={{
        isPremium,
        hasPurchasedReport,
        purchaseReport,
        downloadPdf,
        isLoading,
        error,
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
