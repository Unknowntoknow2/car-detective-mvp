
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { VEHICLE_MAKES, VEHICLE_MODELS } from '@/data/vehicle-data';

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

export function useVehicleData() {
  const [makes, setMakes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load makes on initial component mount
  useEffect(() => {
    async function fetchMakes() {
      try {
        setIsLoading(true);
        
        // Try to fetch makes from Supabase
        const { data, error } = await supabase
          .from('makes')
          .select('make_name')
          .order('make_name');
          
        if (error) {
          console.error('Error fetching makes from Supabase:', error);
          // Fallback to local data if there's an error
          setMakes(VEHICLE_MAKES);
        } else {
          // Extract make names from the data
          const makeNames = data.map(item => item.make_name);
          if (makeNames.length > 0) {
            setMakes(makeNames);
          } else {
            // Fallback to local data if no makes were returned
            setMakes(VEHICLE_MAKES);
          }
        }
      } catch (err) {
        console.error('Unexpected error fetching makes:', err);
        // Fallback to local data
        setMakes(VEHICLE_MAKES);
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
      setIsLoading(true);
      
      // First, try to get the make_id for the selected make
      const { data: makeData, error: makeError } = await supabase
        .from('makes')
        .select('id')
        .eq('make_name', make)
        .single();
        
      if (makeError) {
        console.error('Error fetching make_id:', makeError);
        // Fallback to local data
        return VEHICLE_MODELS.map((model, index) => ({
          id: `local-${index}`,
          model_name: model
        }));
      }
      
      // Use the make_id to get models
      const { data, error } = await supabase
        .from('models')
        .select('id, model_name')
        .eq('make_id', makeData.id)
        .order('model_name');
        
      if (error) {
        console.error('Error fetching models:', error);
        // Fallback to local data
        return VEHICLE_MODELS.map((model, index) => ({
          id: `local-${index}`,
          model_name: model
        }));
      }
      
      return data || [];
    } catch (err) {
      console.error('Unexpected error fetching models:', err);
      // Fallback to local data
      return VEHICLE_MODELS.map((model, index) => ({
        id: `local-${index}`,
        model_name: model
      }));
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Function to fetch trims for a specific model
  const getTrimsByModel = useCallback(async (modelId: string): Promise<TrimData[]> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('model_trims')
        .select('id, trim_name, year, fuel_type, transmission')
        .eq('model_id', modelId)
        .order('trim_name');
        
      if (error) {
        console.error('Error fetching trims:', error);
        return [];
      }
      
      return data || [];
    } catch (err) {
      console.error('Unexpected error fetching trims:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    makes,
    isLoading,
    error,
    getModelsByMake,
    getTrimsByModel
  };
}
