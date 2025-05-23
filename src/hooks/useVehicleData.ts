
import { useState, useCallback } from 'react';
import { VEHICLE_MODELS_BY_MAKE } from '@/data/vehicle-data';

// Define our interfaces
export interface MakeData {
  id: string;
  make_name: string;
}

export interface ModelData {
  id: string;
  model_name: string;
}

export interface TrimData {
  id: string;
  trim_name: string;
}

export interface UseVehicleDataReturn {
  isLoading: boolean;
  makes: MakeData[];
  models: ModelData[]; // This property is now officially supported
  getModelsByMake: (makeId: string) => ModelData[];
  getYearOptions: (startYear: number) => number[];
  getTrimsByModel: (modelId: string) => Promise<TrimData[]>;
  counts: {
    makes: number;
    models: number;
    years: number;
  };
  refreshData: () => Promise<{success: boolean, makeCount: number, modelCount: number}>;
  error?: string;
}

export function useVehicleData(): UseVehicleDataReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [models, setModels] = useState<ModelData[]>([]); // State for models
  
  // Convert makes to MakeData format
  const makes: MakeData[] = Object.keys(VEHICLE_MODELS_BY_MAKE).map((makeName, index) => ({
    id: index.toString(),
    make_name: makeName
  }));
  
  // Get models by make
  const getModelsByMake = useCallback((makeId: string): ModelData[] => {
    const makeName = makes.find(m => m.id === makeId)?.make_name;
    if (!makeName || !VEHICLE_MODELS_BY_MAKE[makeName as keyof typeof VEHICLE_MODELS_BY_MAKE]) {
      return [];
    }
    
    const modelsList = VEHICLE_MODELS_BY_MAKE[makeName as keyof typeof VEHICLE_MODELS_BY_MAKE].map((modelName, index) => ({
      id: `${makeId}_${index}`,
      model_name: modelName
    }));
    
    // Update the models state
    setModels(modelsList);
    
    return modelsList;
  }, [makes]);
  
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
  const refreshData = useCallback(async (): Promise<{success: boolean, makeCount: number, modelCount: number}> => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
    
    return {
      success: true,
      makeCount: makes.length,
      modelCount: Object.values(VEHICLE_MODELS_BY_MAKE).flat().length
    };
  }, [makes]);
  
  return {
    isLoading,
    makes,
    models, // Return the models state
    getModelsByMake,
    getYearOptions,
    getTrimsByModel,
    counts: {
      makes: Object.keys(VEHICLE_MODELS_BY_MAKE).length,
      models: Object.values(VEHICLE_MODELS_BY_MAKE).flat().length,
      years: getYearOptions(1990).length
    },
    refreshData,
    error
  };
}
