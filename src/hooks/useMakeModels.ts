
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
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [isLoadingTrims, setIsLoadingTrims] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Load makes on initial component mount
  useEffect(() => {
    async function fetchMakes() {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Fetching makes from database...');
        
        const { data: allMakes, error: makesError } = await supabase
          .from('makes')
          .select('id, make_name')
          .neq('make_name', 'Unknown Make')
          .order('make_name');
          
        if (makesError) {
          console.error('Supabase error fetching makes:', makesError);
          throw makesError;
        }
        
        const typedData: VehicleMake[] = (allMakes || []).map(make => ({
          id: make.id,
          make_name: make.make_name,
          logo_url: null
        }));
        
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

  // Function to fetch models for a specific make ID
  const getModelsByMakeId = useCallback(async (makeId: string) => {
    if (!makeId) {
      console.log('No makeId provided, clearing models');
      setModels([]);
      setTrims([]);
      return [];
    }

    try {
      setIsLoadingModels(true);
      setError(null);
      
      console.log('Fetching models for make ID:', makeId);
      
      // First, let's check if the make exists
      const { data: makeCheck } = await supabase
        .from('makes')
        .select('make_name')
        .eq('id', makeId)
        .single();
      
      console.log('Make check result:', makeCheck);
      
      // Now fetch models with explicit filtering
      const { data: modelsData, error: modelsError } = await supabase
        .from('models')
        .select('id, make_id, model_name')
        .eq('make_id', makeId)
        .order('model_name');
        
      if (modelsError) {
        console.error('Supabase error fetching models:', modelsError);
        throw modelsError;
      }
      
      console.log('Raw models query result:', modelsData);
      
      const modelsList = modelsData || [];
      console.log('Processed models list:', modelsList);
      
      // If no models found, let's also check the total count in the models table
      if (modelsList.length === 0) {
        const { count } = await supabase
          .from('models')
          .select('*', { count: 'exact', head: true });
        
        console.log('Total models in database:', count);
        
        // Check if there are any models with this make_id (case-insensitive check)
        const { data: debugModels } = await supabase
          .from('models')
          .select('id, make_id, model_name')
          .limit(5);
        
        console.log('Sample models for debugging:', debugModels);
      }
      
      setModels(modelsList);
      setTrims([]); // Clear trims when models change
      return modelsList;
    } catch (err: any) {
      console.error('Error fetching models:', err);
      setError('Failed to load vehicle models: ' + err.message);
      setModels([]);
      setTrims([]);
      return [];
    } finally {
      setIsLoadingModels(false);
    }
  }, []);

  // Function to fetch trims for a specific model ID
  const getTrimsByModelId = useCallback(async (modelId: string) => {
    if (!modelId) {
      console.log('No modelId provided, clearing trims');
      setTrims([]);
      return [];
    }

    try {
      setIsLoadingTrims(true);
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
    } finally {
      setIsLoadingTrims(false);
    }
  }, []);

  const findMakeById = useCallback((makeId: string) => {
    return makes.find(make => make.id === makeId);
  }, [makes]);

  const findModelById = useCallback((modelId: string) => {
    return models.find(model => model.id === modelId);
  }, [models]);

  return {
    makes,
    models,
    trims,
    isLoading,
    isLoadingModels,
    isLoadingTrims,
    error,
    getModelsByMakeId,
    getTrimsByModelId,
    findMakeById,
    findModelById,
  };
}
