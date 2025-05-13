
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

// Define the interface for the valuation data
interface ValuationData {
  vehicleDetails?: {
    make?: string;
    model?: string;
    year?: number;
    mileage?: number;
    zipCode?: string;
    vin?: string;
    condition?: string;
    trim?: string;
  };
  marketValue?: number;
  valuationDate?: string;
  valuationId?: string;
  isPremium?: boolean;
}

// Define the context type
interface ValuationContextType {
  valuation: ValuationData;
  setValuation: React.Dispatch<React.SetStateAction<ValuationData>>;
  resetValuation: () => void;
  saveValuation: () => Promise<string | undefined>;
  valuationHistory: ValuationData[];
  loadingHistory: boolean;
  fetchValuationHistory: () => Promise<void>;
}

// Create the context
const ValuationContext = createContext<ValuationContextType | undefined>(undefined);

// Provider component
export const ValuationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [valuation, setValuation] = useState<ValuationData>({});
  const [valuationHistory, setValuationHistory] = useState<ValuationData[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Reset the valuation data
  const resetValuation = () => {
    setValuation({});
  };

  // Save the valuation to local storage or database
  const saveValuation = async (): Promise<string | undefined> => {
    // Generate a unique ID for the valuation
    const valuationId = `val_${Date.now()}`;
    
    // Add date and ID to the valuation
    const valuationToSave = {
      ...valuation,
      valuationDate: new Date().toISOString(),
      valuationId,
    };
    
    // Save to local storage for now
    try {
      // Get existing valuations
      const existingValuationsString = localStorage.getItem('valuationHistory');
      const existingValuations = existingValuationsString 
        ? JSON.parse(existingValuationsString) 
        : [];
      
      // Add new valuation
      const updatedValuations = [valuationToSave, ...existingValuations];
      
      // Save back to local storage
      localStorage.setItem('valuationHistory', JSON.stringify(updatedValuations));
      
      // Update state
      setValuationHistory(updatedValuations);
      setValuation(valuationToSave);
      
      // If user is logged in, save to user profile
      if (user) {
        await saveValuationToUserProfile(valuationToSave);
      }
      
      return valuationId;
    } catch (error) {
      console.error('Error saving valuation:', error);
      return undefined;
    }
  };

  // Mock function to save valuation to user profile
  const saveValuationToUserProfile = async (valuationData: ValuationData) => {
    console.log('Saving valuation to user profile:', user?.id, valuationData);
    // This would normally save to a database
    return Promise.resolve();
  };

  // Fetch valuation history
  const fetchValuationHistory = async () => {
    setLoadingHistory(true);
    try {
      // In a real app, we'd fetch from a database if the user is logged in
      const historyString = localStorage.getItem('valuationHistory');
      const history = historyString ? JSON.parse(historyString) : [];
      setValuationHistory(history);
    } catch (error) {
      console.error('Error fetching valuation history:', error);
      setValuationHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  return (
    <ValuationContext.Provider
      value={{
        valuation,
        setValuation,
        resetValuation,
        saveValuation,
        valuationHistory,
        loadingHistory,
        fetchValuationHistory,
      }}
    >
      {children}
    </ValuationContext.Provider>
  );
};

// Custom hook to use the valuation context
export const useValuation = () => {
  const context = useContext(ValuationContext);
  if (context === undefined) {
    throw new Error('useValuation must be used within a ValuationProvider');
  }
  return context;
};
