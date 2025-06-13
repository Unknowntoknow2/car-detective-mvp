
import React, { createContext, useContext, ReactNode } from 'react';

interface ValuationContextType {
  valuationData?: any;
  isPremium: boolean;
  isLoading: boolean;
  error?: string | null;
  estimatedValue: number;
  onUpgrade: () => void;
  isDownloading: boolean;
  isEmailSending: boolean;
  onDownloadPdf: () => Promise<void>;
  onEmailPdf: () => Promise<void>;
}

const ValuationContext = createContext<ValuationContextType | undefined>(undefined);

interface ValuationProviderProps {
  children: ReactNode;
  value: ValuationContextType;
}

export function ValuationProvider({ children, value }: ValuationProviderProps) {
  return (
    <ValuationContext.Provider value={value}>
      {children}
    </ValuationContext.Provider>
  );
}

export function useValuationContext() {
  const context = useContext(ValuationContext);
  if (context === undefined) {
    throw new Error('useValuationContext must be used within a ValuationProvider');
  }
  return context;
}

export { ValuationContext };
