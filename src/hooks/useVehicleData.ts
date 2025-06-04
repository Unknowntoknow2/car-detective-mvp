<<<<<<< HEAD

import { useState, useCallback } from 'react';
import { VEHICLE_MODELS_BY_MAKE } from '@/data/vehicle-data';
=======
import { useCallback, useEffect, useState } from "react";
import { fetchVehicleData, getModelsByMakeId } from "@/api/vehicleApi";
import { Make, Model } from "./types/vehicle";
import { enhancedCache } from "@/utils/vehicle/enhancedCacheUtils";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

// Define our interfaces
export interface MakeData {
  id: string;
  make_name: string;
}

export interface ModelData {
  id: string;
  model_name: string;
}

<<<<<<< HEAD
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
    
=======
  // Function to fetch models by make name
  const getModelsByMake = useCallback(
    async (makeName: string): Promise<Model[]> => {
      try {
        console.log("useVehicleData: Getting models for make:", makeName);

        // Find the make object by name to get the ID
        const makeObj = makes.find((m) => m.make_name === makeName);

        if (!makeObj) {
          console.warn(
            `useVehicleData: Make '${makeName}' not found in loaded makes`,
          );
          return [];
        }

        console.log(
          `useVehicleData: Found make ID ${makeObj.id} for make '${makeName}'`,
        );

        // Try to get models from cache first
        const cachedModels = enhancedCache?.loadModelsByMake?.(makeObj.id);

        if (cachedModels && cachedModels.length > 0) {
          console.log(
            `useVehicleData: Using ${cachedModels.length} cached models for make '${makeName}'`,
          );
          return cachedModels;
        }

        // If not in cache or cache empty, fetch from API
        const fetchedModels = await getModelsByMakeId(makeObj.id);

        // Cache the fetched models
        if (
          fetchedModels && fetchedModels.length > 0 &&
          enhancedCache?.saveModelsByMake
        ) {
          enhancedCache.saveModelsByMake(makeObj.id, fetchedModels);
        }

        return fetchedModels;
      } catch (err) {
        console.error(
          "useVehicleData: Error fetching models for make:",
          makeName,
          err,
        );
        return [];
      }
    },
    [makes],
  );

  // Add getYearOptions function for year dropdown
  const getYearOptions = useCallback(() => {
    const currentYear = new Date().getFullYear();
    const startYear = 1990;
    const yearOptions = [];

>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    for (let year = currentYear + 1; year >= startYear; year--) {
      years.push(year);
    }
<<<<<<< HEAD
    
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
=======

    return yearOptions;
  }, []);

  // Function to refresh vehicle data
  const refreshData = useCallback(async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log(
        "useVehicleData: Refreshing vehicle data, force =",
        forceRefresh,
      );

      // Try to get data from cache first, unless force refresh is requested
      if (!forceRefresh && enhancedCache?.loadMakes) {
        const cachedMakes = enhancedCache.loadMakes();

        if (cachedMakes && cachedMakes.length > 0) {
          console.log(
            `useVehicleData: Using ${cachedMakes.length} cached makes`,
          );
          setMakes(cachedMakes);
          setIsLoading(false);
          return {
            makes: cachedMakes,
            models: [],
            success: true,
            makeCount: cachedMakes.length,
            modelCount: 0,
          };
        }
      }

      // Fetch fresh data from API
      const { makes: fetchedMakes, models: fetchedModels } =
        await fetchVehicleData();

      console.log(
        `useVehicleData: Fetched ${fetchedMakes.length} makes and ${fetchedModels.length} models from API`,
      );

      // Save to cache if available
      if (fetchedMakes.length > 0 && enhancedCache?.saveMakes) {
        enhancedCache.saveMakes(fetchedMakes);
      }

      if (fetchedModels.length > 0 && enhancedCache?.saveModels) {
        enhancedCache.saveModels(fetchedModels);
      }

      setMakes(fetchedMakes);
      setModels(fetchedModels);

      return {
        makes: fetchedMakes,
        models: fetchedModels,
        success: true,
        makeCount: fetchedMakes.length,
        modelCount: fetchedModels.length,
      };
    } catch (err) {
      console.error("useVehicleData: Failed to refresh vehicle data:", err);
      const errorMsg = err instanceof Error
        ? err.message
        : "Failed to load vehicle data";
      setError(errorMsg);
      return {
        makes: [],
        models: [],
        success: false,
        makeCount: 0,
        modelCount: 0,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add counts property for VehicleDataInfo component
  const counts = {
    makes: makes.length,
    models: models.length,
  };

  useEffect(() => {
    console.log("useVehicleData: Initial loading of vehicle data");
    refreshData();
  }, [refreshData]);

  return {
    makes,
    models,
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    getModelsByMake,
    getYearOptions,
    getTrimsByModel,
    counts: {
      makes: Object.keys(VEHICLE_MODELS_BY_MAKE).length,
      models: Object.values(VEHICLE_MODELS_BY_MAKE).flat().length,
      years: getYearOptions(1990).length
    },
    refreshData,
<<<<<<< HEAD
    error
=======
    isLoading,
    error,
    counts, // Added for VehicleDataInfo
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  };
}
