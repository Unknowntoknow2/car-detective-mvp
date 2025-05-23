
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { VEHICLE_MAKES, VEHICLE_MODELS } from '@/data/vehicle-data';

export interface MakeData {
  id: string;
  make_name: string;
  logo_url?: string | null;
}

export interface ModelData {
  id: string;
  model_name: string;
  make_id?: string;
}

export interface TrimData {
  id: string;
  trim_name: string;
  model_id?: string;
  year?: number;
  fuel_type?: string;
  transmission?: string;
}

interface VehicleDataCounts {
  makes: number;
  models: number;
}

export function useVehicleData() {
  const [makes, setMakes] = useState<MakeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [counts, setCounts] = useState<VehicleDataCounts>({ makes: 0, models: 0 });

  // Load makes on initial component mount
  useEffect(() => {
    async function fetchMakes() {
      try {
        setIsLoading(true);
        
        // Try to fetch makes from Supabase
        const { data, error } = await supabase
          .from('makes')
          .select('id, make_name')
          .order('make_name');
          
        if (error) {
          console.error('Error fetching makes from Supabase:', error);
          // Fallback to local data if there's an error
          const fallbackMakes = VEHICLE_MAKES.map((makeName, index) => ({
            id: `local-${index}`,
            make_name: makeName
          }));
          setMakes(fallbackMakes);
          setCounts({ makes: fallbackMakes.length, models: VEHICLE_MODELS.length });
        } else {
          // Use the data from Supabase
          if (data && data.length > 0) {
            setMakes(data);
            setCounts(prev => ({ ...prev, makes: data.length }));
          } else {
            // Fallback to local data if no makes were returned
            const fallbackMakes = VEHICLE_MAKES.map((makeName, index) => ({
              id: `local-${index}`,
              make_name: makeName
            }));
            setMakes(fallbackMakes);
            setCounts({ makes: fallbackMakes.length, models: VEHICLE_MODELS.length });
          }
        }
      } catch (err) {
        console.error('Unexpected error fetching makes:', err);
        // Fallback to local data
        const fallbackMakes = VEHICLE_MAKES.map((makeName, index) => ({
          id: `local-${index}`,
          make_name: makeName
        }));
        setMakes(fallbackMakes);
        setCounts({ makes: fallbackMakes.length, models: VEHICLE_MODELS.length });
        setError('Failed to load vehicle makes');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchMakes();
  }, []);

  // Function to fetch models for a specific make
  const getModelsByMake = useCallback(async (make: string): Promise<ModelData[]> => {
    try {
      console.log('Getting models for make:', make);
      // First, try to get the make_id for the selected make
      const makeItem = makes.find(m => m.make_name === make);
      
      if (!makeItem) {
        console.error('Make not found:', make);
        return [];
      }
      
      const makeId = makeItem.id;
      console.log('Found make ID:', makeId);
      
      // Use the make_id to get models
      const { data, error } = await supabase
        .from('models')
        .select('id, model_name')
        .eq('make_id', makeId)
        .order('model_name');
        
      if (error) {
        console.error('Error fetching models from Supabase:', error);
        // Fallback to local data
        return VEHICLE_MODELS.map((model, index) => ({
          id: `local-model-${index}`,
          model_name: model,
          make_id: makeId
        }));
      }
      
      if (data && data.length > 0) {
        console.log('Models from Supabase:', data);
        return data;
      } else {
        console.log('No models found, using fallback data');
        // Fallback to local data if no models were returned
        return VEHICLE_MODELS.map((model, index) => ({
          id: `local-model-${index}`,
          model_name: model,
          make_id: makeId
        }));
      }
    } catch (err) {
      console.error('Unexpected error fetching models:', err);
      // Fallback to local data
      return VEHICLE_MODELS.map((model, index) => ({
        id: `local-model-${index}`,
        model_name: model
      }));
    }
  }, [makes]);
  
  // Function to fetch trims for a specific model
  const getTrimsByModel = useCallback(async (modelId: string): Promise<TrimData[]> => {
    try {
      console.log('Getting trims for model ID:', modelId);
      
      const { data, error } = await supabase
        .from('model_trims')
        .select('id, trim_name, year, fuel_type, transmission')
        .eq('model_id', modelId)
        .order('trim_name');
        
      if (error) {
        console.error('Error fetching trims:', error);
        return [];
      }
      
      if (data && data.length > 0) {
        console.log('Trims from Supabase:', data);
        return data;
      } else {
        // Default fallback with at least "Standard" trim
        return [{
          id: `default-trim-${modelId}`,
          trim_name: 'Standard',
          model_id: modelId
        }];
      }
    } catch (err) {
      console.error('Unexpected error fetching trims:', err);
      return [];
    }
  }, []);

  // Function to get year options
  const getYearOptions = useCallback(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 35 }, (_, i) => currentYear - i);
  }, []);

  // Function to refresh data (for VehicleDataInfo component)
  const refreshData = useCallback(async (forceRefresh: boolean = false) => {
    try {
      setIsLoading(true);
      // Implementation would fetch fresh data from the API/database
      // For now, just simulate a refresh
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return some stats about the refresh
      return {
        success: true,
        makeCount: makes.length,
        modelCount: counts.models || 0
      };
    } catch (err) {
      console.error('Error refreshing data:', err);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, [makes.length, counts.models]);

  return {
    makes,
    isLoading,
    error,
    getModelsByMake,
    getTrimsByModel,
    getYearOptions,
    refreshData,
    counts
  };
}
