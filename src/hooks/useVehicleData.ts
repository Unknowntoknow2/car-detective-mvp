
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Make {
  id: string;
  make_name: string;
  logo_url: string;
}

interface Model {
  id: string;
  model_name: string;
  make_id: string;
}

export function useVehicleData() {
  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMakesAndModels = async () => {
      try {
        // Fetch makes
        const { data: makesData, error: makesError } = await supabase
          .from('makes')
          .select('*')
          .order('make_name');

        if (makesError) throw makesError;

        // Fetch all models
        const { data: modelsData, error: modelsError } = await supabase
          .from('models')
          .select('*');

        if (modelsError) throw modelsError;

        setMakes(makesData || []);
        setModels(modelsData || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load vehicle data';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMakesAndModels();
  }, []);

  const getModelsByMake = (makeId: string) => {
    return models.filter(model => model.make_id === makeId);
  };

  const getCurrentYear = () => new Date().getFullYear();
  const getYearOptions = () => {
    const currentYear = getCurrentYear();
    return Array.from({ length: currentYear - 1989 }, (_, i) => currentYear - i);
  };

  return {
    makes,
    models,
    getModelsByMake,
    getYearOptions,
    isLoading,
    error,
  };
}
