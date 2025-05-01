
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
        if (cachedData) {
          console.log('Using cached vehicle data');
          setMakes(cachedData.makes);
          setModels(cachedData.models);
          setIsLoading(false);
          return;
        }
      }
      
      console.log('Fetching fresh vehicle data from Supabase');
      
      // Fetch makes directly from Supabase
      const { data: makesData, error: makesError } = await supabase
        .from('makes')
        .select('*')
        .order('make_name');
      
      if (makesError) {
        throw new Error(`Error fetching makes: ${makesError.message}`);
      }
      
      // Transform makes data
      const transformedMakes: Make[] = (makesData || []).map(make => ({
        id: make.id,
        make_name: make.make_name,
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
      
      // Transform models data
      const transformedModels: Model[] = (modelsData || []).map(model => ({
        id: model.id,
        make_id: String(model.make_id),
        model_name: model.model_name,
        nhtsa_model_id: null
      }));
      
      console.log(`Fetched ${transformedMakes.length} makes and ${transformedModels.length} models from Supabase`);
      
      // Update state with the fetched data
      setMakes(transformedMakes);
      setModels(transformedModels);
      
      // Cache the data for future use
      saveToCache(transformedMakes, transformedModels);
      
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
      if (modelsByMake[make.id]) {
        console.log(`Using cached models for make: ${makeName}`);
        return modelsByMake[make.id];
      }
      
      // Otherwise fetch from Supabase
      console.log(`Fetching models for make ID: ${make.id}`);
      // Convert make.id to a number if it's stored as a string in the make object
      const numericMakeId = parseInt(make.id, 10);
      
      // Check if conversion was successful
      if (isNaN(numericMakeId)) {
        console.error("Invalid make ID format:", make.id);
        return [];
      }
      
      const { data, error } = await supabase
        .from('models')
        .select('*')
        .eq('make_id', numericMakeId) // Using numeric value now
        .order('model_name');
      
      if (error) {
        throw error;
      }
      
      const fetchedModels = (data || []).map(model => ({
        id: model.id,
        make_id: String(model.make_id),
        model_name: model.model_name,
        nhtsa_model_id: null
      }));
      
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
