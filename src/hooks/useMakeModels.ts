
import { useState, useEffect, useCallback } from 'react';
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
        
        console.log('Fetching makes from database...');
        const { data, error } = await supabase
          .from('makes')
          .select('id, make_name')
          .order('make_name');
          
        if (error) {
          console.error('Supabase error fetching makes:', error);
          throw error;
        }
        
        const typedData: VehicleMake[] = data ? data.map(make => ({
          id: make.id,
          make_name: make.make_name,
          logo_url: null
        })) : [];
        
        console.log('Fetched makes:', typedData.length, typedData.slice(0, 5));
        setMakes(typedData);
      } catch (err: any) {
        console.error('Error fetching makes:', err);
        setError('Failed to load vehicle makes: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchMakes();
  }, []);

  // Stabilized function to fetch models for a specific make using useCallback
  const getModelsByMake = useCallback(async (makeName: string) => {
    if (!makeName || makes.length === 0) {
      console.log('No make name provided or makes not loaded, clearing models');
      setModels([]);
      return [];
    }

    try {
      setError(null);
      
      // Find the make ID from the make name
      const selectedMake = makes.find(make => make.make_name === makeName);
      if (!selectedMake) {
        console.log('Make not found:', makeName);
        setModels([]);
        return [];
      }
      
      console.log('Fetching models for make:', makeName, 'with ID:', selectedMake.id);
      const { data, error } = await supabase
        .from('models')
        .select('id, make_id, model_name')
        .eq('make_id', selectedMake.id)
        .order('model_name');
        
      if (error) {
        console.error('Supabase error fetching models:', error);
        throw error;
      }
      
      const modelsList = data || [];
      console.log('Fetched models:', modelsList.length, modelsList.slice(0, 5));
      setModels(modelsList);
      return modelsList;
    } catch (err: any) {
      console.error('Error fetching models:', err);
      setError('Failed to load vehicle models: ' + err.message);
      setModels([]);
      return [];
    }
  }, [makes]); // Only depend on makes array

  // Legacy function for backward compatibility - now uses make ID directly
  const getModelsByMakeId = useCallback(async (makeId: string) => {
    if (!makeId) {
      console.log('No makeId provided, clearing models');
      setModels([]);
      return [];
    }

    try {
      setError(null);
      
      console.log('Fetching models for make ID:', makeId);
      const { data, error } = await supabase
        .from('models')
        .select('id, make_id, model_name')
        .eq('make_id', makeId)
        .order('model_name');
        
      if (error) {
        console.error('Supabase error fetching models:', error);
        throw error;
      }
      
      const modelsList = data || [];
      console.log('Fetched models:', modelsList.length, modelsList.slice(0, 5));
      setModels(modelsList);
      return modelsList;
    } catch (err: any) {
      console.error('Error fetching models:', err);
      setError('Failed to load vehicle models: ' + err.message);
      setModels([]);
      return [];
    }
  }, []);

  // Function to fetch trims for a specific model
  const getTrimsByModelId = useCallback(async (modelId: string) => {
    if (!modelId) {
      console.log('No modelId provided, clearing trims');
      setTrims([]);
      return [];
    }

    try {
      setError(null);
      
      console.log('Fetching trims for model ID:', modelId);
      const { data, error } = await supabase
        .from('model_trims')
        .select('id, model_id, trim_name, year, fuel_type, transmission')
        .eq('model_id', modelId)
        .order('trim_name');
        
      if (error) {
        console.error('Supabase error fetching trims:', error);
        throw error;
      }
      
      const trimsList = data || [];
      console.log('Fetched trims:', trimsList.length, trimsList);
      setTrims(trimsList);
      return trimsList;
    } catch (err: any) {
      console.error('Error fetching trims:', err);
      setError('Failed to load vehicle trims: ' + err.message);
      setTrims([]);
      return [];
    }
  }, []);

  return {
    makes,
    models,
    trims,
    isLoading,
    error,
    getModelsByMakeId,
    getModelsByMake, // Now stabilized with useCallback
    getTrimsByModelId,
  };
}
