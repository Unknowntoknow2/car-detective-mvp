
import { useState, useEffect, useCallback } from 'react';
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

  const fetchMakes = useCallback(async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Only select fields that actually exist in the database
      const { data, error } = await supabase
        .from('makes')
        .select('id, make_name')
        .order('make_name');
        
      if (error) throw error;
      
      // Map the database results to our interface
      const makesData: MakeData[] = data?.map(make => ({
        id: make.id,
        make_name: make.make_name
      })) || [];
      
      setMakes(makesData);
      
      // Update counts
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

  // Get models by make ID (not make name)
  const getModelsByMake = async (makeName: string): Promise<ModelData[]> => {
    if (!makeName) return [];
    
    try {
      console.log('Fetching models for make:', makeName);
      
      // First, find the make_id for the given make name
      const { data: makeData, error: makeError } = await supabase
        .from('makes')
        .select('id')
        .eq('make_name', makeName)
        .single();
      
      if (makeError || !makeData) {
        console.error('Error finding make ID:', makeError);
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
        return [];
      }
      
      console.log(`Found ${data?.length || 0} models for make ${makeName}`);
      console.log('Fetched models for make:', makeName, data);
      return data || [];
    } catch (err: any) {
      console.error('Error in getModelsByMake:', err);
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
