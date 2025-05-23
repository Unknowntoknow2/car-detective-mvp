
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface MakeData {
  id: string;
  make_name: string;
  logo_url?: string | null;
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
  year?: number;
  fuel_type?: string;
  transmission?: string;
}

export interface VehicleDataCounts {
  makes: number;
  models: number;
}

export const useVehicleData = () => {
  const [makes, setMakes] = useState<MakeData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | Error | null>(null);
  const [counts, setCounts] = useState<VehicleDataCounts>({ makes: 0, models: 0 });
  
  // Add model cache to prevent repeated API calls
  const modelCache = useRef<Record<string, ModelData[]>>({});
  const fetchingMakes = useRef<Record<string, boolean>>({});

  const fetchMakes = useCallback(async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('makes')
        .select('id, make_name')
        .order('make_name');
        
      if (error) throw error;
      
      const makesData: MakeData[] = data?.map(make => ({
        id: make.id,
        make_name: make.make_name
      })) || [];
      
      setMakes(makesData);
      
      const makeCount = makesData.length || 0;
      let modelCount = 0;
      
      if (makeCount > 0) {
        const { count } = await supabase
          .from('models')
          .select('id', { count: 'exact', head: true });
          
        modelCount = count || 0;
      }
      
      setCounts({ makes: makeCount, models: modelCount });
      
      return { 
        success: true, 
        makeCount: makeCount, 
        modelCount: modelCount 
      };
    } catch (err: any) {
      console.error('Error fetching makes:', err);
      setError(err.message || 'Failed to load vehicle makes');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch makes on component mount
  useEffect(() => {
    fetchMakes();
  }, [fetchMakes]);

  // Get models by make name with caching
  const getModelsByMake = async (makeName: string): Promise<ModelData[]> => {
    if (!makeName) return [];
    
    try {
      // Return cached results if available
      if (modelCache.current[makeName]) {
        return modelCache.current[makeName];
      }
      
      // Prevent duplicate requests for the same make
      if (fetchingMakes.current[makeName]) {
        return [];
      }
      
      fetchingMakes.current[makeName] = true;
      console.log('Fetching models for make:', makeName);
      
      // Find the make_id for the given make name
      const { data: makeData, error: makeError } = await supabase
        .from('makes')
        .select('id')
        .eq('make_name', makeName)
        .single();
      
      if (makeError || !makeData) {
        console.error('Error finding make ID:', makeError);
        fetchingMakes.current[makeName] = false;
        return [];
      }
      
      const makeId = makeData.id;
      console.log('Found make ID:', makeId);
      
      // Then fetch models for that make_id
      const { data, error } = await supabase
        .from('models')
        .select('id, model_name, make_id')
        .eq('make_id', makeId)
        .order('model_name');
        
      if (error) {
        console.error('Error fetching models:', error);
        fetchingMakes.current[makeName] = false;
        return [];
      }
      
      const models = data || [];
      console.log(`Found ${models.length} models for make ${makeName}`);
      
      // Store in cache
      modelCache.current[makeName] = models;
      fetchingMakes.current[makeName] = false;
      
      return models;
    } catch (err: any) {
      console.error('Error in getModelsByMake:', err);
      fetchingMakes.current[makeName] = false;
      return [];
    }
  };

  // Get trims by model ID
  const getTrimsByModel = async (modelId: string): Promise<TrimData[]> => {
    if (!modelId) return [];
    
    try {
      console.log('Fetching trims for model ID:', modelId);
      
      const { data, error } = await supabase
        .from('model_trims')
        .select('id, trim_name, model_id, year, fuel_type, transmission')
        .eq('model_id', modelId)
        .order('trim_name');
        
      if (error) {
        console.error('Error fetching trims:', error);
        return [];
      }
      
      console.log(`Found ${data?.length || 0} trims for model ID ${modelId}`);
      return data || [];
    } catch (err: any) {
      console.error('Error in getTrimsByModel:', err);
      return [];
    }
  };

  // Generate years
  const getYearOptions = () => {
    const currentYear = new Date().getFullYear() + 1; // Include next year for new models
    const years: number[] = [];
    
    for (let year = currentYear; year >= 1990; year--) {
      years.push(year);
    }
    
    return years;
  };

  // Refresh data - useful for admin functions
  const refreshData = async (forceRefresh = false) => {
    // Clear model cache on refresh
    modelCache.current = {};
    return await fetchMakes(forceRefresh);
  };

  return {
    makes,
    isLoading,
    error,
    counts,
    getModelsByMake,
    getTrimsByModel,
    getYearOptions,
    refreshData
  };
};
