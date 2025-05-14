
import React, { createContext, useContext, ReactNode } from 'react';
import { ValuationResult } from '@/types/valuation';

interface ValuationContextType {
  valuationData: ValuationResult | null;
  isPremium: boolean;
  isLoading: boolean;
  error: Error | string | null;
  estimatedValue: number;
  onUpgrade: () => void;
  onDownloadPdf: () => Promise<void>;
  onEmailPdf: () => Promise<void>;
  isDownloading: boolean;
  isEmailSending: boolean;
}

const ValuationContext = createContext<ValuationContextType | undefined>(undefined);

interface ValuationProviderProps {
  children: ReactNode;
  value: ValuationContextType;
}

export const ValuationProvider: React.FC<ValuationProviderProps> = ({ children, value }) => {
  return (
    <ValuationContext.Provider value={value}>
      {children}
    </ValuationContext.Provider>
  );
};

export const useValuation = (): ValuationContextType => {
  const context = useContext(ValuationContext);
  if (context === undefined) {
    throw new Error('useValuation must be used within a ValuationProvider');
  }
  return context;
};
