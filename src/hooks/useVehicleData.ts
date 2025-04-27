
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Make, Model, VehicleDataHook } from './types/vehicle';
import { getFallbackMakes, getFallbackModels } from '@/utils/vehicle/fallbackData';
import { saveToCache, loadFromCache, clearCache } from '@/utils/vehicle/cacheUtils';
import { fetchVehicleData } from '@/api/vehicleApi';
export const useVehicleData = (): VehicleDataHook => {
  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [modelsByMake, setModelsByMake] = useState<Record<string, Model[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const buildModelsByMake = useCallback((modelsData: Model[]) => {
    const modelsByMakeObj: Record<string, Model[]> = {};
    modelsData.forEach(model => {
      if (!model.make_id) return;
      if (!modelsByMakeObj[model.make_id]) {
        modelsByMakeObj[model.make_id] = [];
      }
      modelsByMakeObj[model.make_id].push(model);
    });
    setModelsByMake(modelsByMakeObj);

    // Debugging counts
    Object.keys(modelsByMakeObj).forEach(makeId => {
      console.log(`Make ID ${makeId}: ${modelsByMakeObj[makeId].length} models`);
    });
  }, []);

  const refreshData = useCallback(async (forceRefresh = false) => {
    try {
      console.log("Refreshing vehicle data from API...");
      setIsLoading(true);

      if (forceRefresh) {
        clearCache();
      }

      const data = await fetchVehicleData();
      console.log(`API returned ${data.makes.length} makes and ${data.models.length} models`);

      if (data.makes.length === 0) {
        throw new Error("API returned 0 makes");
      }

      setMakes(data.makes);
      setModels(data.models);
      buildModelsByMake(data.models);
      saveToCache(data.makes, data.models);
      return { success: true, makeCount: data.makes.length, modelCount: data.models.length };
    } catch (err) {
      console.error('Error refreshing vehicle data:', err);
      toast.error('Failed to load vehicle data. Using cached or fallback data.');
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  }, [buildModelsByMake]);

  const fetchData = useCallback(async () => {
    console.log("Fetching vehicle data...");
    setIsLoading(true);
    setError(null);

    try {
      const cachedData = loadFromCache();
      if (cachedData && cachedData.makes.length > 0) {
        console.log(`Using cached data: ${cachedData.makes.length} makes`);
        setMakes(cachedData.makes);
        setModels(cachedData.models);
        buildModelsByMake(cachedData.models);

        refreshData().catch(console.error);
        return;
      }

      const result = await refreshData();
      if (!result.success) {
        throw new Error('Failed to fetch vehicle data from API');
      }
    } catch (err: any) {
      console.error('Error fetching vehicle data:', err);
      setError(err.message || 'Failed to load vehicle data');

      console.log("Using fallback data...");
      const fallbackMakes = getFallbackMakes();
      setMakes(fallbackMakes);

      const allFallbackModels: Model[] = [];
      fallbackMakes.forEach(make => {
        const makeModels = getFallbackModels(make.id);
        allFallbackModels.push(...makeModels);
      });

      setModels(allFallbackModels);
      buildModelsByMake(allFallbackModels);
      saveToCache(fallbackMakes, allFallbackModels);

      console.log(`Fallback data: ${fallbackMakes.length} makes and ${allFallbackModels.length} models`);
    } finally {
      setIsLoading(false);
    }
  }, [buildModelsByMake, refreshData]);

  const getModelsByMake = useCallback((makeName: string): Model[] => {
    if (!makeName || !Array.isArray(makes)) return [];

    const make = makes.find(m => m.make_name === makeName);
    if (!make) return [];

    const modelsForMake = modelsByMake[make.id] || [];
    return Array.isArray(modelsForMake) ? modelsForMake : [];
  }, [makes, modelsByMake]);

  const getYearOptions = useCallback((startYear: number = 1980): number[] => {
    const currentYear = new Date().getFullYear();
    const endYear = currentYear + 1;
    return Array.from({ length: endYear - startYear + 1 }, (_, i) => endYear - i);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    makes,
    models,
    modelsByMake,
    getModelsByMake,
    getYearOptions,
    isLoading,
    error,
    refreshData,
    counts: {
      makes: makes.length,
      models: models.length,
    },
  };
};

export type { Make, Model };
