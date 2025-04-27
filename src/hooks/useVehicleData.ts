
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types for our hook
export type Make = {
  id: string;
  make_name: string;
  logo_url: string | null;
  country_of_origin: string | null;
};

export type Model = {
  id: string;
  model_name: string;
  make_id: string;
  popular: boolean;
};

export type ModelsByMake = {
  [key: string]: Model[];
};

// Local storage keys for caching
const CACHE_KEY_MAKES = 'vehicle_makes_cache';
const CACHE_KEY_MODELS = 'vehicle_models_cache';
const CACHE_EXPIRY = 'vehicle_cache_expiry';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const useVehicleData = () => {
  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [modelsByMake, setModelsByMake] = useState<ModelsByMake>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Build models by make mapping
  const buildModelsByMake = useCallback((modelsList: Model[]) => {
    const mapping: ModelsByMake = {};
    
    modelsList.forEach(model => {
      const makeName = makes.find(make => make.id === model.make_id)?.make_name || '';
      
      if (!mapping[makeName]) {
        mapping[makeName] = [];
      }
      
      mapping[makeName].push(model);
    });
    
    setModelsByMake(mapping);
  }, [makes]);

  // Cache handling functions
  const saveToCache = (makesData: Make[], modelsData: Model[]) => {
    try {
      localStorage.setItem(CACHE_KEY_MAKES, JSON.stringify(makesData));
      localStorage.setItem(CACHE_KEY_MODELS, JSON.stringify(modelsData));
      localStorage.setItem(CACHE_EXPIRY, String(Date.now() + CACHE_DURATION));
    } catch (err) {
      console.warn('Failed to cache vehicle data:', err);
    }
  };

  const loadFromCache = (): { makes: Make[], models: Model[] } | null => {
    try {
      const expiry = localStorage.getItem(CACHE_EXPIRY);
      
      if (!expiry || Number(expiry) < Date.now()) {
        clearCache();
        return null;
      }
      
      const cachedMakes = localStorage.getItem(CACHE_KEY_MAKES);
      const cachedModels = localStorage.getItem(CACHE_KEY_MODELS);
      
      if (!cachedMakes || !cachedModels) {
        return null;
      }
      
      return {
        makes: JSON.parse(cachedMakes),
        models: JSON.parse(cachedModels)
      };
    } catch (err) {
      console.warn('Failed to load cached vehicle data:', err);
      return null;
    }
  };

  const clearCache = () => {
    try {
      localStorage.removeItem(CACHE_KEY_MAKES);
      localStorage.removeItem(CACHE_KEY_MODELS);
      localStorage.removeItem(CACHE_EXPIRY);
    } catch (err) {
      console.warn('Failed to clear vehicle data cache:', err);
    }
  };

  const refreshData = useCallback(async (forceRefresh = false) => {
    try {
      console.log("Refreshing vehicle data from Supabase...");
      setIsLoading(true);
      
      if (forceRefresh) {
        clearCache();
      }
      
      // Fetch makes and models directly from Supabase
      const { data: makesData, error: makesError } = await supabase
        .from('makes')
        .select('*');

      const { data: modelsData, error: modelsError } = await supabase
        .from('models')
        .select('*');

      if (makesError || modelsError) {
        throw new Error('Error fetching makes/models from Supabase');
      }

      if (!makesData || makesData.length === 0) {
        throw new Error("Supabase returned 0 makes");
      }

      setMakes(makesData);
      setModels(modelsData || []);
      buildModelsByMake(modelsData || []);
      saveToCache(makesData, modelsData || []);
      
      return { success: true, makeCount: makesData.length, modelCount: modelsData?.length || 0 };
    } catch (err) {
      console.error('Error refreshing vehicle data from Supabase:', err);
      toast.error('Failed to load vehicle data. Using cached or fallback data.');
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  }, [buildModelsByMake]);

  // Get models for a specific make
  const getModelsByMake = useCallback((makeName: string): Model[] => {
    return modelsByMake[makeName] || [];
  }, [modelsByMake]);

  // Initialize data loading
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // First try to load from cache
        const cachedData = loadFromCache();
        
        if (cachedData) {
          console.log('Using cached vehicle data');
          setMakes(cachedData.makes);
          setModels(cachedData.models);
          buildModelsByMake(cachedData.models);
          setIsLoading(false);
          
          // Refresh in background after loading from cache
          refreshData(false).catch(console.error);
          return;
        }
        
        // If no cache, load from API
        const result = await refreshData(true);
        
        if (!result.success) {
          throw new Error('Failed to load vehicle data');
        }
      } catch (err) {
        console.error('Error initializing vehicle data:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
        toast.error('Failed to load vehicle data');
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeData();
  }, [buildModelsByMake, refreshData]);

  // Get available years for vehicles
  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    
    // Add years from current year down to 1990
    for (let year = currentYear; year >= 1990; year--) {
      years.push(year);
    }
    
    return years;
  };

  return {
    makes,
    models,
    isLoading,
    error,
    refreshData,
    getModelsByMake,
    getYearOptions
  };
};
