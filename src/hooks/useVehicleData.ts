
import { useEffect, useState, useCallback } from 'react';
import { fetchVehicleData, getModelsByMakeId } from '@/api/vehicleApi';
import { Make, Model } from './types/vehicle';
import { enhancedCache } from '@/utils/vehicle/enhancedCacheUtils';

interface VehicleData {
  makes: Make[];
  models: Model[];
}

export function useVehicleData() {
  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch models by make name
  const getModelsByMake = useCallback(async (makeName: string): Promise<Model[]> => {
    try {
      console.log("useVehicleData: Getting models for make:", makeName);
      
      // Find the make object by name to get the ID
      const makeObj = makes.find(m => m.make_name === makeName);
      
      if (!makeObj) {
        console.warn(`useVehicleData: Make '${makeName}' not found in loaded makes`);
        return [];
      }
      
      console.log(`useVehicleData: Found make ID ${makeObj.id} for make '${makeName}'`);
      
      // Try to get models from cache first
      const cachedModels = enhancedCache?.loadModelsByMake?.(makeObj.id);
      
      if (cachedModels && cachedModels.length > 0) {
        console.log(`useVehicleData: Using ${cachedModels.length} cached models for make '${makeName}'`);
        return cachedModels;
      }
      
      // If not in cache or cache empty, fetch from API
      const fetchedModels = await getModelsByMakeId(makeObj.id);
      
      // Cache the fetched models
      if (fetchedModels && fetchedModels.length > 0 && enhancedCache?.saveModelsByMake) {
        enhancedCache.saveModelsByMake(makeObj.id, fetchedModels);
      }
      
      return fetchedModels;
    } catch (err) {
      console.error("useVehicleData: Error fetching models for make:", makeName, err);
      return [];
    }
  }, [makes]);

  // Add getYearOptions function for year dropdown
  const getYearOptions = useCallback(() => {
    const currentYear = new Date().getFullYear();
    const startYear = 1990;
    const yearOptions = [];
    
    for (let year = currentYear + 1; year >= startYear; year--) {
      yearOptions.push(year);
    }
    
    return yearOptions;
  }, []);

  // Function to refresh vehicle data
  const refreshData = useCallback(async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("useVehicleData: Refreshing vehicle data, force =", forceRefresh);
      
      // Try to get data from cache first, unless force refresh is requested
      if (!forceRefresh && enhancedCache?.loadMakes) {
        const cachedMakes = enhancedCache.loadMakes();
        
        if (cachedMakes && cachedMakes.length > 0) {
          console.log(`useVehicleData: Using ${cachedMakes.length} cached makes`);
          setMakes(cachedMakes);
          setIsLoading(false);
          return { 
            makes: cachedMakes, 
            models: [],
            success: true,
            makeCount: cachedMakes.length,
            modelCount: 0
          };
        }
      }
      
      // Fetch fresh data from API
      const { makes: fetchedMakes, models: fetchedModels } = await fetchVehicleData();
      
      console.log(`useVehicleData: Fetched ${fetchedMakes.length} makes and ${fetchedModels.length} models from API`);
      
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
        modelCount: fetchedModels.length
      };
    } catch (err) {
      console.error("useVehicleData: Failed to refresh vehicle data:", err);
      const errorMsg = err instanceof Error ? err.message : "Failed to load vehicle data";
      setError(errorMsg);
      return { 
        makes: [], 
        models: [],
        success: false,
        makeCount: 0,
        modelCount: 0
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add counts property for VehicleDataInfo component
  const counts = {
    makes: makes.length,
    models: models.length
  };

  useEffect(() => {
    console.log("useVehicleData: Initial loading of vehicle data");
    refreshData();
  }, [refreshData]);

  return { 
    makes, 
    models, 
    getModelsByMake,
    getYearOptions,
    refreshData,
    isLoading, 
    error,
    counts // Added for VehicleDataInfo
  };
}
