
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
        
        // First, get all makes
        const { data: allMakes, error: makesError } = await supabase
          .from('makes')
          .select('id, make_name')
          .neq('make_name', 'Unknown Make')
          .order('make_name');
          
        if (makesError) {
          console.error('Supabase error fetching makes:', makesError);
          throw makesError;
        }
        
        // Check which makes have models
        const { data: makesWithModels, error: modelsCountError } = await supabase
          .from('models')
          .select('make_id')
          .not('make_id', 'is', null);
          
        if (modelsCountError) {
          console.error('Error checking makes with models:', modelsCountError);
          // Continue with all makes if this fails
        }
        
        const makeIdsWithModels = new Set(makesWithModels?.map(m => m.make_id) || []);
        
        // Filter makes to only include those with models, or show all if debugging
        const filteredMakes = allMakes?.filter(make => {
          const hasModels = makeIdsWithModels.has(make.id);
          if (!hasModels) {
            console.warn(`Make "${make.make_name}" (${make.id}) has no models`);
          }
          return hasModels; // Only include makes that have models
        }) || [];
        
        console.log(`Total makes: ${allMakes?.length || 0}, Makes with models: ${filteredMakes.length}`);
        
        const typedData: VehicleMake[] = filteredMakes.map(make => ({
          id: make.id,
          make_name: make.make_name,
          logo_url: null
        }));
        
        console.log('Fetched makes with models:', typedData.length, typedData.slice(0, 5));
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
      const { data, error } = await supabase
        .from('models')
        .select('id, make_id, model_name')
        .eq('make_id', makeId)
        .not('make_id', 'is', null)
        .order('model_name');
        
      if (error) {
        console.error('Supabase error fetching models:', error);
        throw error;
      }
      
      const modelsList = data || [];
      console.log('Fetched models:', modelsList.length, modelsList.slice(0, 5));
      
      if (modelsList.length === 0) {
        console.warn('No models found for make ID:', makeId);
        // Check if the make exists
        const { data: makeData } = await supabase
          .from('makes')
          .select('make_name')
          .eq('id', makeId)
          .single();
        
        if (makeData) {
          console.warn(`Make "${makeData.make_name}" exists but has no models`);
        }
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
