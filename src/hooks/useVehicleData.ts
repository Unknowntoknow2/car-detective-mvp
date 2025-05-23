
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

// Type definition for our hook's return value
interface UseVehicleDataReturn {
  makes: MakeData[];
  models: ModelData[];
  getModelsByMake: (makeName: string) => Promise<ModelData[]>;
  isLoading: boolean;
  error: Error | string | null;
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
          const makeModels = typedVehicleModelsByMake[makeName] || VEHICLE_MODELS;
          
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
        const fallbackModels = typedVehicleModelsByMake[makeName] || [];
        
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
          const fallbackModels = typedVehicleModelsByMake[makeName] || [];
          
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

  return {
    makes,
    models,
    getModelsByMake,
    isLoading,
    error
  };
}
