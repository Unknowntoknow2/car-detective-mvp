
import { useState, useCallback, useEffect } from 'react';
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

      console.log('✅ Fetched makes:', data?.length || 0);
      setMakes(data || []);
    } catch (err: any) {
      console.error('❌ Error fetching makes:', err);
      setError('Failed to load vehicle makes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch models by make ID
  const fetchModelsByMakeId = useCallback(async (makeId: string) => {
    if (!makeId) {
      setModels([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log('🔍 Fetching models for make_id:', makeId);

      const { data, error } = await supabase
        .from('models')
        .select('id, model_name, make_id')
        .eq('make_id', makeId)
        .order('model_name');

      if (error) throw error;

      console.log('✅ Fetched models for make:', data?.length || 0, 'models');
      if (data && data.length > 0) {
        console.log('📋 Sample models:', data.slice(0, 3).map(m => m.model_name));
      }

      setModels(data || []);
    } catch (err: any) {
      console.error('❌ Error fetching models:', err);
      setError('Failed to load vehicle models');
      setModels([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize makes on first load
  useEffect(() => {
    fetchMakes();
  }, [fetchMakes]);

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
    isLoading,
    error,
    fetchMakes,
    fetchModelsByMakeId,
    findMakeById,
    findModelById,
  };
}
