
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { VEHICLE_MAKES, VEHICLE_MODELS, VEHICLE_MODELS_BY_MAKE } from '@/data/vehicle-data';

// Define types for our API responses
export interface MakeData {
  id: string;
  make_name: string;
}

export interface ModelData {
  id: string;
  model_name: string;
  make_id: string;
}

export interface TrimData {
  id: string;
  trim_name: string;
  model_id: string;
}

// Type definition for our hook's return value
interface UseVehicleDataReturn {
  makes: MakeData[];
  models: ModelData[];
  getModelsByMake: (makeName: string) => Promise<ModelData[]>;
  getTrimsByModel: (modelId: string) => Promise<TrimData[]>;
  getYearOptions: (startYear?: number) => number[];
  isLoading: boolean;
  error: Error | string | null;
  counts: {
    makes: number;
    models: number;
  };
  refreshData: (forceRefresh?: boolean) => Promise<{
    success: boolean;
    makeCount: number;
    modelCount: number;
  }>;
}

// Define a type for the VEHICLE_MODELS_BY_MAKE object
type VehicleModelsByMakeType = {
  [key: string]: string[];
};

// Create a properly typed version of the imported object
const typedVehicleModelsByMake: VehicleModelsByMakeType = VEHICLE_MODELS_BY_MAKE;

export function useVehicleData(): UseVehicleDataReturn {
  const [makes, setMakes] = useState<MakeData[]>([]);
  const [models, setModels] = useState<ModelData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | string | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [cachedModels, setCachedModels] = useState<Record<string, ModelData[]>>({});
  const [cachedTrims, setCachedTrims] = useState<Record<string, TrimData[]>>({});

  // Initialize with fallback data
  useEffect(() => {
    if (!initialized) {
      try {
        // Initialize with fallback data from the constants
        const fallbackMakes: MakeData[] = VEHICLE_MAKES.map((makeName, index) => ({
          id: `make-${index}`,
          make_name: makeName
        }));

        setMakes(fallbackMakes);
        
        // Create fallback models for all makes
        const allFallbackModels: ModelData[] = [];
        
        VEHICLE_MAKES.forEach((makeName, makeIndex) => {
          // Get models for this make, either from the by-make object or the generic list
          const makeModels = typedVehicleModelsByMake[makeName as keyof typeof typedVehicleModelsByMake] || VEHICLE_MODELS;
          
          const modelsForMake = makeModels.map((modelName: string, index: number) => ({
            id: `model-${makeIndex}-${index}`,
            model_name: modelName,
            make_id: `make-${makeIndex}`
          }));
          
          allFallbackModels.push(...modelsForMake);
        });
        
        setModels(allFallbackModels);
        setInitialized(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing with fallback data:", error);
        setError("Failed to initialize vehicle data");
        setIsLoading(false);
      }
    }
  }, [initialized]);

  // Function to get models for a specific make
  const getModelsByMake = useCallback(async (makeName: string): Promise<ModelData[]> => {
    if (!makeName) {
      return [];
    }
    
    // Check if we already have models cached for this make
    if (cachedModels[makeName]) {
      console.log(`Using cached models for make: ${makeName}`);
      return cachedModels[makeName];
    }
    
    try {
      // For this example, we'll use our fallback data
      // In a real app, this would make an API call
      console.log(`Fetching models for make: ${makeName}`);
      
      // Find the make ID
      const make = makes.find(m => m.make_name === makeName);
      if (make) {
        console.log(`Found make ID: ${make.id}`);
      }
      
      // Get models for this make from our models array
      const filteredModels = models.filter(
        model => makes.find(m => m.id === model.make_id)?.make_name === makeName
      );
      
      // If no models found, try to use fallback data from the constants
      if (filteredModels.length === 0) {
        // Get models for this make from our constants
        const fallbackModels = typedVehicleModelsByMake[makeName as keyof typeof typedVehicleModelsByMake] || [];
        
        if (make && fallbackModels.length > 0) {
          console.log(`Using fallback models for make: ${makeName}`);
          
          const modelsList = fallbackModels.map((modelName: string, index: number) => ({
            id: `model-fallback-${index}`,
            model_name: modelName,
            make_id: make.id
          }));
          
          // Cache these models for future use
          setCachedModels(prev => ({
            ...prev,
            [makeName]: modelsList
          }));
          
          return modelsList;
        } else {
          console.log(`Found 0 models for make ${makeName}`);
        }
      }
      
      // Cache these models for future use
      setCachedModels(prev => ({
        ...prev,
        [makeName]: filteredModels
      }));
      
      console.log(`Fetched models for make: ${makeName}`, filteredModels);
      return filteredModels;
    } catch (error) {
      console.error(`Error fetching models for make ${makeName}:`, error);
      
      // On error, try to use fallback data
      if (makes.length > 0) {
        const make = makes.find(m => m.make_name === makeName);
        
        if (make) {
          const fallbackModels = typedVehicleModelsByMake[makeName as keyof typeof typedVehicleModelsByMake] || [];
          
          const modelsList = fallbackModels.map((modelName: string, index: number) => ({
            id: `model-error-${index}`,
            model_name: modelName,
            make_id: make.id
          }));
          
          return modelsList;
        }
      }
      
      return [];
    }
  }, [makes, models, cachedModels]);

  // Function to get trims for a specific model
  const getTrimsByModel = useCallback(async (modelId: string): Promise<TrimData[]> => {
    if (!modelId) {
      return [];
    }
    
    // Check if we already have trims cached for this model
    if (cachedTrims[modelId]) {
      console.log(`Using cached trims for model: ${modelId}`);
      return cachedTrims[modelId];
    }
    
    try {
      // For this example, we'll create some dummy trim data
      console.log(`Fetching trims for model: ${modelId}`);
      
      const model = models.find(m => m.id === modelId);
      if (!model) {
        return [];
      }
      
      // Create some basic trim levels
      const trimLevels = ['Base', 'LE', 'XLE', 'Limited', 'Sport', 'Touring'];
      const trims: TrimData[] = trimLevels.map((trim, index) => ({
        id: `trim-${modelId}-${index}`,
        trim_name: trim,
        model_id: modelId
      }));
      
      // Cache these trims for future use
      setCachedTrims(prev => ({
        ...prev,
        [modelId]: trims
      }));
      
      console.log(`Created dummy trims for model: ${modelId}`, trims);
      return trims;
    } catch (error) {
      console.error(`Error creating trims for model ${modelId}:`, error);
      return [];
    }
  }, [models, cachedTrims]);

  // Function to get year options
  const getYearOptions = useCallback((startYear: number = 1990): number[] => {
    const currentYear = new Date().getFullYear() + 1; // Include next year for new models
    const years: number[] = [];
    
    for (let year = currentYear; year >= startYear; year--) {
      years.push(year);
    }
    
    return years;
  }, []);

  // Function to refresh data
  const refreshData = useCallback(async (forceRefresh: boolean = false): Promise<{
    success: boolean;
    makeCount: number;
    modelCount: number;
  }> => {
    try {
      setIsLoading(true);
      
      // In a real app, this would make API calls to refresh data
      // For this example, we'll just use our fallback data again
      
      if (forceRefresh || !initialized) {
        // Reset everything and initialize again
        setInitialized(false);
        setCachedModels({});
        setCachedTrims({});
        
        // Wait a moment to simulate a network call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Initialize with fallback data from the constants
        const fallbackMakes: MakeData[] = VEHICLE_MAKES.map((makeName, index) => ({
          id: `make-${index}-${Date.now()}`, // Add timestamp to ensure new IDs
          make_name: makeName
        }));

        setMakes(fallbackMakes);
        
        // Create fallback models for all makes
        const allFallbackModels: ModelData[] = [];
        
        VEHICLE_MAKES.forEach((makeName, makeIndex) => {
          // Get models for this make, either from the by-make object or the generic list
          const makeModels = typedVehicleModelsByMake[makeName as keyof typeof typedVehicleModelsByMake] || VEHICLE_MODELS;
          
          const modelsForMake = makeModels.map((modelName: string, index: number) => ({
            id: `model-${makeIndex}-${index}-${Date.now()}`, // Add timestamp to ensure new IDs
            model_name: modelName,
            make_id: `make-${makeIndex}-${Date.now()}`
          }));
          
          allFallbackModels.push(...modelsForMake);
        });
        
        setModels(allFallbackModels);
        setInitialized(true);
        
        return {
          success: true,
          makeCount: fallbackMakes.length,
          modelCount: allFallbackModels.length
        };
      }
      
      return {
        success: true,
        makeCount: makes.length,
        modelCount: models.length
      };
    } catch (error) {
      console.error("Error refreshing vehicle data:", error);
      setError("Failed to refresh vehicle data");
      
      return {
        success: false,
        makeCount: makes.length,
        modelCount: models.length
      };
    } finally {
      setIsLoading(false);
    }
  }, [initialized, makes.length, models.length]);

  return {
    makes,
    models,
    getModelsByMake,
    getTrimsByModel,
    getYearOptions,
    isLoading,
    error,
    counts: {
      makes: makes.length,
      models: models.length
    },
    refreshData
  };
}
