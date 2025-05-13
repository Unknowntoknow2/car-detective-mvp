
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

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
  type?: string;
  value?: string;
  state?: string;
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
  // Add the missing properties
  processFreeValuation: (data: any) => Promise<any>;
  processPremiumValuation: (data: any) => Promise<any>;
  isProcessing: boolean;
}

// Create the context
const ValuationContext = createContext<ValuationContextType | undefined>(undefined);

// Provider component
export const ValuationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [valuation, setValuation] = useState<ValuationData>({});
  const [valuationHistory, setValuationHistory] = useState<ValuationData[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Reset the valuation data
  const resetValuation = () => {
    setValuation({});
  };

  // Process a free valuation
  const processFreeValuation = async (data: any) => {
    setIsProcessing(true);
    console.log("Processing free valuation:", data);
    
    try {
      // Generate a mock valuation ID
      const valuationId = `val_free_${Date.now()}`;
      
      // Create a simple valuation object
      const valuationData = {
        vehicleDetails: {
          make: data.make || (data.type === 'manual' ? JSON.parse(data.value)?.make : undefined),
          model: data.model || (data.type === 'manual' ? JSON.parse(data.value)?.model : undefined),
          year: data.year || (data.type === 'manual' ? JSON.parse(data.value)?.year : undefined),
          zipCode: data.zipCode || (data.type === 'manual' ? JSON.parse(data.value)?.zipCode : undefined),
          condition: data.condition || 'Good',
          vin: data.vin || '',
        },
        marketValue: Math.floor(5000 + Math.random() * 20000), // Random value for demo
        valuationDate: new Date().toISOString(),
        valuationId,
        isPremium: false,
        type: data.type,
        value: data.value,
        state: data.state,
      };
      
      // Save the valuation
      setValuation(valuationData);
      
      // Add to history
      const existingValuationsString = localStorage.getItem('valuationHistory');
      const existingValuations = existingValuationsString 
        ? JSON.parse(existingValuationsString) 
        : [];
      
      const updatedValuations = [valuationData, ...existingValuations];
      localStorage.setItem('valuationHistory', JSON.stringify(updatedValuations));
      setValuationHistory(updatedValuations);
      
      // Return the result
      return {
        valuationId,
        estimatedValue: valuationData.marketValue,
        ...valuationData,
      };
    } catch (error) {
      console.error("Error processing free valuation:", error);
      toast.error("Failed to process free valuation");
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  // Process a premium valuation
  const processPremiumValuation = async (data: any) => {
    setIsProcessing(true);
    console.log("Processing premium valuation:", data);
    
    try {
      // For demo purposes, we'll check if this is an upgrade request
      const isPremiumUpgrade = data.isPremiumUpgrade || false;
      
      if (isPremiumUpgrade && valuation.valuationId) {
        // Just upgrade the existing valuation
        const upgradedValuation = {
          ...valuation,
          isPremium: true,
        };
        
        setValuation(upgradedValuation);
        
        // Update in history
        const existingValuationsString = localStorage.getItem('valuationHistory');
        const existingValuations = existingValuationsString 
          ? JSON.parse(existingValuationsString) 
          : [];
        
        const updatedValuations = existingValuations.map((v: ValuationData) => 
          v.valuationId === valuation.valuationId ? upgradedValuation : v
        );
        
        localStorage.setItem('valuationHistory', JSON.stringify(updatedValuations));
        setValuationHistory(updatedValuations);
        
        return upgradedValuation;
      } else {
        // Generate a mock valuation ID
        const valuationId = `val_premium_${Date.now()}`;
        
        // Create a premium valuation object with some extra data
        const valuationData = {
          vehicleDetails: {
            make: data.make || (data.type === 'manual' ? JSON.parse(data.value)?.make : undefined),
            model: data.model || (data.type === 'manual' ? JSON.parse(data.value)?.model : undefined),
            year: data.year || (data.type === 'manual' ? JSON.parse(data.value)?.year : undefined),
            zipCode: data.zipCode || (data.type === 'manual' ? JSON.parse(data.value)?.zipCode : undefined),
            condition: data.condition || 'Good',
            vin: data.vin || '',
            trim: data.trim || '',
            mileage: data.mileage || 0,
          },
          marketValue: Math.floor(8000 + Math.random() * 25000), // Higher random value for premium
          valuationDate: new Date().toISOString(),
          valuationId,
          isPremium: true,
          type: data.type,
          value: data.value,
          state: data.state,
        };
        
        // Save the valuation
        setValuation(valuationData);
        
        // Add to history
        const existingValuationsString = localStorage.getItem('valuationHistory');
        const existingValuations = existingValuationsString 
          ? JSON.parse(existingValuationsString) 
          : [];
        
        const updatedValuations = [valuationData, ...existingValuations];
        localStorage.setItem('valuationHistory', JSON.stringify(updatedValuations));
        setValuationHistory(updatedValuations);
        
        // Return the result
        return {
          valuationId,
          estimatedValue: valuationData.marketValue,
          ...valuationData,
        };
      }
    } catch (error) {
      console.error("Error processing premium valuation:", error);
      toast.error("Failed to process premium valuation");
      throw error;
    } finally {
      setIsProcessing(false);
    }
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
        processFreeValuation,
        processPremiumValuation,
        isProcessing,
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
