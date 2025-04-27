
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Make, Model, VehicleDataHook } from './types/vehicle';
import { getFallbackMakes, getFallbackModels } from '@/utils/vehicle/fallbackData';
import { saveToCache, loadFromCache } from '@/utils/vehicle/cacheUtils';

export const useVehicleData = (): VehicleDataHook => {
  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [modelsByMake, setModelsByMake] = useState<Record<string, Model[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    console.log("Fetching vehicle data...");
    setIsLoading(true);
    setError(null);
    
    try {
      // Try to load from cache first
      const cachedData = loadFromCache();
      if (cachedData) {
        setMakes(cachedData.makes);
        setModels(cachedData.models);
        buildModelsByMake(cachedData.models);
        setIsLoading(false);
        
        // Refresh data in background
        refreshData().catch(console.error);
        return;
      }

      const freshData = await refreshData();
      if (!freshData) {
        throw new Error("Failed to load vehicle data");
      }
    } catch (err: any) {
      console.error('Error fetching vehicle data:', err);
      setError(err.message || 'Failed to load vehicle data');
      
      // Use fallback data
      const fallbackMakes = getFallbackMakes();
      if (fallbackMakes.length > 0) {
        setMakes(fallbackMakes);
        const allFallbackModels = fallbackMakes.flatMap(make => getFallbackModels(make.id));
        setModels(allFallbackModels);
        buildModelsByMake(allFallbackModels);
        saveToCache(fallbackMakes, allFallbackModels);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

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
  }, []);

  const refreshData = useCallback(async () => {
    try {
      const [makesResult, modelsResult] = await Promise.all([
        supabase.from('makes').select('*').order('make_name'),
        supabase.from('models').select('*').order('model_name')
      ]);

      if (makesResult.error) throw makesResult.error;
      if (modelsResult.error) throw modelsResult.error;

      const validMakesData = makesResult.data || [];
      const validModelsData = modelsResult.data || [];

      setMakes(validMakesData);
      setModels(validModelsData);
      buildModelsByMake(validModelsData);
      saveToCache(validMakesData, validModelsData);

      return { makes: validMakesData, models: validModelsData };
    } catch (err) {
      console.error('Error refreshing vehicle data:', err);
      toast.error('Failed to load vehicle data. Using cached data if available.');
      return null;
    }
  }, [buildModelsByMake]);

  const getModelsByMake = useCallback((makeName: string): Model[] => {
    if (!makeName || !Array.isArray(makes)) {
      return [];
    }
    
    const make = makes.find(m => m.make_name === makeName);
    if (!make) return [];
    
    if (modelsByMake[make.id]) {
      return modelsByMake[make.id];
    }
    
    return getFallbackModels(make.id);
  }, [makes, modelsByMake]);

  const getYearOptions = useCallback((startYear: number = 1980): number[] => {
    const currentYear = new Date().getFullYear();
    const endYear = currentYear + 1;
    return Array.from(
      { length: endYear - startYear + 1 },
      (_, i) => endYear - i
    );
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
    refreshData
  };
};

export type { Make, Model };
