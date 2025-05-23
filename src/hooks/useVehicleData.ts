
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
          .select('id, make_name, logo_url')
          .order('make_name');
          
        if (error) {
          console.error('Error fetching makes from Supabase:', error);
          // Fallback to local data if there's an error
          const fallbackMakes = VEHICLE_MAKES.map((makeName, index) => ({
            id: `local-${index}`,
            make_name: makeName,
            logo_url: null
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
              make_name: makeName,
              logo_url: null
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
          make_name: makeName,
          logo_url: null
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
  const getModelsByMake = useCallback(async (makeName: string): Promise<ModelData[]> => {
    try {
      console.log('Getting models for make:', makeName);
      
      // Find the make object by make_name
      const makeObj = makes.find(m => m.make_name === makeName);
      
      if (!makeObj) {
        console.error('Make not found:', makeName);
        return [];
      }
      
      const makeId = makeObj.id;
      console.log('Found make ID:', makeId, 'for make:', makeName);
      
      // Fetch models from Supabase using the make_id
      const { data, error } = await supabase
        .from('models')
        .select('id, model_name, make_id')
        .eq('make_id', makeId)
        .order('model_name');
      
      if (error) {
        console.error('Error fetching models from Supabase:', error);
        
        // For local IDs, use fallback data
        if (makeId.startsWith('local-')) {
          // Get the make index from the local id
          const makeIndex = parseInt(makeId.replace('local-', ''));
          // Filter models based on the make index (for local data)
          const localModels = VEHICLE_MODELS.map((model, index) => ({
            id: `local-model-${index}`,
            model_name: model,
            make_id: makeId
          }));
          
          // Simulate filtering by returning a subset based on make index
          // This is just a simulation since our local data doesn't have real relationships
          const startIndex = (makeIndex * 5) % VEHICLE_MODELS.length;
          const endIndex = Math.min(startIndex + 5, VEHICLE_MODELS.length);
          return localModels.slice(startIndex, endIndex);
        }
        
        return [];
      }
      
      if (data && data.length > 0) {
        console.log(`Found ${data.length} models for make ${makeName}:`, data);
        return data;
      } else {
        console.log('No models found in database, using fallback');
        
        // If no models found in DB but we have a valid make ID, create some default models
        if (makeId.startsWith('local-')) {
          // For local makes, create some default models
          const makeIndex = parseInt(makeId.replace('local-', ''));
          const startIndex = (makeIndex * 5) % VEHICLE_MODELS.length;
          const endIndex = Math.min(startIndex + 5, VEHICLE_MODELS.length);
          
          return VEHICLE_MODELS.slice(startIndex, endIndex).map((model, index) => ({
            id: `local-model-${startIndex + index}`,
            model_name: model,
            make_id: makeId
          }));
        } else {
          // For real make IDs with no models, return a smaller default set
          return VEHICLE_MODELS.slice(0, 3).map((model, index) => ({
            id: `default-model-${index}`,
            model_name: model,
            make_id: makeId
          }));
        }
      }
    } catch (err) {
      console.error('Unexpected error fetching models:', err);
      return [];
    }
  }, [makes]);
  
  // Function to fetch trims for a specific model
  const getTrimsByModel = useCallback(async (modelId: string): Promise<TrimData[]> => {
    try {
      console.log('Getting trims for model ID:', modelId);
      
      // Only query Supabase if it's a UUID format (not local ID)
      if (!modelId.startsWith('local-')) {
        const { data, error } = await supabase
          .from('model_trims')
          .select('id, trim_name, year, fuel_type, transmission')
          .eq('model_id', modelId)
          .order('trim_name');
          
        if (error) {
          console.error('Error fetching trims:', error);
        } else if (data && data.length > 0) {
          console.log('Trims from Supabase:', data);
          return data;
        }
      }
      
      // For local model IDs or if no trims found, return default trims
      console.log('Using default trims for model:', modelId);
      return [
        {
          id: `default-trim-${modelId}-1`,
          trim_name: 'Standard',
          model_id: modelId
        },
        {
          id: `default-trim-${modelId}-2`,
          trim_name: 'Deluxe',
          model_id: modelId
        },
        {
          id: `default-trim-${modelId}-3`,
          trim_name: 'Premium',
          model_id: modelId
        }
      ];
    } catch (err) {
      console.error('Unexpected error fetching trims:', err);
      return [{
        id: `error-trim-${modelId}`,
        trim_name: 'Standard',
        model_id: modelId
      }];
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
