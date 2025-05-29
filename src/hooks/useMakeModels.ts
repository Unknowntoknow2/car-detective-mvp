
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch makes on mount
  useEffect(() => {
    fetchMakes();
  }, []);

  const fetchMakes = async () => {
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
  };

  const fetchModelsByMakeId = async (makeId: string) => {
    if (!makeId) {
      setModels([]);
      return [];
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
      
      const modelsList = data || [];
      setModels(modelsList);
      return modelsList;
    } catch (err: any) {
      console.error('Error fetching models:', err);
      setError('Failed to load vehicle models');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    makes,
    models,
    isLoading,
    error,
    fetchModelsByMakeId
  };
}
