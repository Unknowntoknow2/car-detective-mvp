
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface VehicleMake {
  id: string;
  make_name: string;
  logo_url?: string | null;
}

export interface VehicleModel {
  id: string;
  make_id: string;
  model_name: string;
}

export interface VehicleTrim {
  id: string;
  model_id: string;
  trim_name: string;
  year?: number;
  fuel_type?: string;
  transmission?: string;
}

export function useMakeModels() {
  const [makes, setMakes] = useState<VehicleMake[]>([]);
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [trims, setTrims] = useState<VehicleTrim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load makes on initial component mount
  useEffect(() => {
    async function fetchMakes() {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('makes')
          .select('id, make_name')
          .order('make_name');
          
        if (error) throw error;
        
        // Update the type handling to match the actual structure of the makes table
        // which appears to not have a logo_url column
        const typedData: VehicleMake[] = data ? data.map(make => ({
          id: make.id,
          make_name: make.make_name,
          logo_url: null // Set logo_url to null since it doesn't exist in the database
        })) : [];
        
        setMakes(typedData);
      } catch (err: any) {
        console.error('Error fetching makes:', err);
        setError('Failed to load vehicle makes');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchMakes();
  }, []);

  // Function to fetch models for a specific make
  const getModelsByMakeId = async (makeId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('models')
        .select('id, make_id, model_name')
        .eq('make_id', makeId)
        .order('model_name');
        
      if (error) throw error;
      
      setModels(data || []);
      return data || [];
    } catch (err: any) {
      console.error('Error fetching models:', err);
      setError('Failed to load vehicle models');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch trims for a specific model
  const getTrimsByModelId = async (modelId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('model_trims')
        .select('id, model_id, trim_name, year, fuel_type, transmission')
        .eq('model_id', modelId)
        .order('trim_name');
        
      if (error) throw error;
      
      setTrims(data || []);
      return data || [];
    } catch (err: any) {
      console.error('Error fetching trims:', err);
      setError('Failed to load vehicle trims');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    makes,
    models,
    trims,
    isLoading,
    error,
    getModelsByMakeId,
    getTrimsByModelId,
  };
}
