
import React, { createContext, useContext } from 'react';

interface ValuationContextType {
  valuationData: any;
  isPremium: boolean;
  isLoading: boolean;
  error: any;
  estimatedValue: number;
  onUpgrade: () => void;
  onDownloadPdf: () => void;
  onEmailPdf: () => void;
  isDownloading: boolean;
  isEmailSending: boolean;
}

// Create a context with default values
const ValuationContext = createContext<ValuationContextType>({
  valuationData: null,
  isPremium: false,
  isLoading: false,
  error: null,
  estimatedValue: 0,
  onUpgrade: () => {},
  onDownloadPdf: () => {},
  onEmailPdf: () => {},
  isDownloading: false,
  isEmailSending: false
});

// Provider component
export const ValuationProvider: React.FC<{ 
  value: ValuationContextType; 
  children: React.ReactNode;
}> = ({ value, children }) => {
  return (
    <ValuationContext.Provider value={value}>
      {children}
    </ValuationContext.Provider>
  );
};

// Hook to use the context
export const useValuation = () => useContext(ValuationContext);
