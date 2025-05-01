import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { fetchVehicleData, getModelsByMakeId } from '@/api/vehicleApi';
import { Make, Model, VehicleDataHook } from './types/vehicle';
import { toast } from 'sonner';
import { loadFromCache, saveToCache, clearCache } from '@/utils/vehicle/cacheUtils';

export function useVehicleData(): VehicleDataHook {
  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Transform models by make for easier lookup
  const modelsByMake = useMemo(() => {
    const result: Record<string, Model[]> = {};
    
    if (models.length > 0) {
      models.forEach(model => {
        if (!result[model.make_id]) {
          result[model.make_id] = [];
        }
        result[model.make_id].push(model);
      });
    }
    
    return result;
  }, [models]);

  const loadData = useCallback(async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check cache first if we're not forcing a refresh
      if (!forceRefresh) {
        const cachedData = loadFromCache();
        if (cachedData && cachedData.makes.length > 0 && cachedData.models.length > 0) {
          console.log('Using cached vehicle data');
          setMakes(cachedData.makes);
          setModels(cachedData.models);
          setIsLoading(false);
          return;
        }
      }
      
      console.log('Fetching fresh vehicle data from Supabase');
      
      // Direct query approach
      const { data: makesData, error: makesError } = await supabase
        .from('makes')
        .select('*')
        .order('make_name');
      
      if (makesError) {
        throw new Error(`Error fetching makes: ${makesError.message}`);
      }
      
      // Debugging output to see the raw data
      console.log(`Raw makes data count: ${makesData?.length || 0}`);
      if (makesData && makesData.length > 0) {
        console.log(`Sample make: ${JSON.stringify(makesData[0])}`);
      }
      
      // Transform makes data with explicit toString() calls
      const transformedMakes: Make[] = (makesData || []).map(make => ({
        id: make.id?.toString() || '',
        make_name: make.make_name || '',
        logo_url: null,
        country_of_origin: null,
        nhtsa_make_id: make.make_id
      }));
      
      // Fetch all models
      const { data: modelsData, error: modelsError } = await supabase
        .from('models')
        .select('*')
        .order('model_name');
      
      if (modelsError) {
        throw new Error(`Error fetching models: ${modelsError.message}`);
      }
      
      // Debugging output for models
      console.log(`Raw models data count: ${modelsData?.length || 0}`);
      if (modelsData && modelsData.length > 0) {
        console.log(`Sample model: ${JSON.stringify(modelsData[0])}`);
      }
      
      // Transform models data with explicit toString() calls
      const transformedModels: Model[] = (modelsData || []).map(model => ({
        id: model.id?.toString() || '',
        make_id: model.make_id?.toString() || '',
        model_name: model.model_name || '',
        nhtsa_model_id: null
      }));
      
      console.log(`Fetched ${transformedMakes.length} makes and ${transformedModels.length} models from Supabase`);
      
      if (transformedMakes.length === 0 || transformedModels.length === 0) {
        console.warn('Warning: Retrieved empty makes or models data from Supabase');
      }
      
      // Update state with the fetched data
      setMakes(transformedMakes);
      setModels(transformedModels);
      
      // Cache the data for future use if not empty
      if (transformedMakes.length > 0 && transformedModels.length > 0) {
        saveToCache(transformedMakes, transformedModels);
      } else {
        console.log('Not caching empty vehicle data');
      }
      
    } catch (error: any) {
      console.error('Error loading vehicle data:', error);
      setError(error.message || 'Failed to load vehicle data');
      toast.error('Failed to load vehicle data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getModelsByMake = useCallback(async (makeName: string): Promise<Model[]> => {
    try {
      console.log(`Getting models for make: ${makeName}`);
      
      // Find the make ID from the make name
      const make = makes.find(m => m.make_name === makeName);
      
      if (!make) {
        console.warn(`Make not found: ${makeName}`);
        return [];
      }
      
      // Check if we already have models for this make
      if (modelsByMake[make.id] && modelsByMake[make.id].length > 0) {
        console.log(`Using cached models for make: ${makeName}`);
        return modelsByMake[make.id];
      }
      
      // Otherwise fetch from API
      console.log(`Fetching models for make ID: ${make.id}`);
      const fetchedModels = await getModelsByMakeId(make.id);
      
      console.log(`Found ${fetchedModels.length} models for make: ${makeName}`);
      return fetchedModels;
      
    } catch (error) {
      console.error(`Error fetching models for make ${makeName}:`, error);
      return [];
    }
  }, [makes, modelsByMake]);

  const getYearOptions = useCallback((startYear = 1981): number[] => {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    
    // Include next year's models that are sometimes released early
    for (let year = currentYear + 1; year >= startYear; year--) {
      years.push(year);
    }
    
    return years;
  }, []);

  return {
    makes,
    models,
    modelsByMake,
    getModelsByMake,
    getYearOptions,
    isLoading,
    error,
    refreshData: loadData,
    counts: {
      makes: makes.length,
      models: models.length
    }
  };
}

export type { Make, Model };
