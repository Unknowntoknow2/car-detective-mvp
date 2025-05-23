
import { useState, useCallback } from 'react';

// Define our interfaces
export interface TrimData {
  id: string;
  trim_name: string;
}

export interface UseVehicleDataReturn {
  isLoading: boolean;
  getYearOptions: (startYear: number) => number[];
  getTrimsByModel: (modelId: string) => Promise<TrimData[]>;
  counts: {
    makes: number;
    models: number;
    years: number;
  };
  refreshData: () => Promise<void>;
}

// Fallback vehicle data
const fallbackMakesModels = {
  'Acura': ['ILX', 'MDX', 'RDX', 'TLX'],
  'Audi': ['A3', 'A4', 'Q5', 'Q7'],
  'BMW': ['3 Series', '5 Series', 'X3', 'X5'],
  'Chevrolet': ['Cruze', 'Equinox', 'Malibu', 'Silverado'],
  'Ford': ['Edge', 'Escape', 'F-150', 'Explorer'],
  'Honda': ['Accord', 'Civic', 'CR-V', 'Pilot'],
  'Hyundai': ['Elantra', 'Santa Fe', 'Sonata', 'Tucson'],
  'Lexus': ['ES', 'NX', 'RX', 'IS'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'GLE', 'GLC'],
  'Nissan': ['Altima', 'Maxima', 'Rogue', 'Sentra'],
  'Tesla': ['Model 3', 'Model S', 'Model X', 'Model Y'],
  'Toyota': ['Camry', 'Corolla', 'RAV4', 'Tacoma']
};

// Define types for the makes/models data structure
type MakesModelsType = {
  [key: string]: string[];
};

export function useVehicleData(): UseVehicleDataReturn {
  const [isLoading, setIsLoading] = useState(false);
  
  // Generate years from startYear to current year + 1
  const getYearOptions = useCallback((startYear: number): number[] => {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    
    for (let year = currentYear + 1; year >= startYear; year--) {
      years.push(year);
    }
    
    return years;
  }, []);
  
  // Mock function to get trims by model
  const getTrimsByModel = useCallback(async (modelId: string): Promise<TrimData[]> => {
    // In a real app, this would make an API call
    // For now, return mock data
    return [
      { id: '1', trim_name: 'Base' },
      { id: '2', trim_name: 'Sport' },
      { id: '3', trim_name: 'Limited' },
      { id: '4', trim_name: 'Premium' }
    ];
  }, []);
  
  // Mock function to refresh data
  const refreshData = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
  }, []);
  
  return {
    isLoading,
    getYearOptions,
    getTrimsByModel,
    counts: {
      makes: Object.keys(fallbackMakesModels).length,
      models: Object.values(fallbackMakesModels).flat().length,
      years: getYearOptions(1990).length
    },
    refreshData
  };
}
