
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface Make {
  id: string;
  make_name: string;
}

export interface Model {
  id: string;
  model_name: string;
  make_id: string;
}

export function useMakeModels() {
  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [modelListVersion, setModelListVersion] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all makes on hook initialization
  const fetchMakes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('makes')
        .select('id, make_name')
        .order('make_name');

      if (error) throw error;

      setMakes(data || []);
    } catch (err: any) {
      console.error('Error fetching makes:', err);
      setError('Failed to load vehicle makes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch models by make ID - now guaranteed to work with foreign key constraint
  const fetchModelsByMakeId = useCallback(async (makeId: string) => {
    if (!makeId) {
      setModels([]);
      setModelListVersion(prev => prev + 1);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('models')
        .select('id, model_name, make_id')
        .eq('make_id', makeId)
        .order('model_name');

      if (error) throw error;

      setModels(data || []);
      setModelListVersion(prev => prev + 1);
    } catch (err: any) {
      console.error('Error fetching models:', err);
      setError('Failed to load vehicle models');
      setModels([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize makes on first load
  useState(() => {
    fetchMakes();
  });

  // Helper functions for finding records by ID
  const findMakeById = useCallback((makeId: string): Make | undefined => {
    return makes.find(make => make.id === makeId);
  }, [makes]);

  const findModelById = useCallback((modelId: string): Model | undefined => {
    return models.find(model => model.id === modelId);
  }, [models]);

  return {
    makes,
    models,
    modelListVersion,
    isLoading,
    error,
    fetchMakes,
    fetchModelsByMakeId,
    findMakeById,
    findModelById,
  };
}
