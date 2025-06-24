
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Make, Model } from '@/hooks/types/vehicle';

interface VehicleTrim {
  id: string;
  trim_name: string;
  model_id: string;
  year: number;
  msrp?: number;
  engine_type?: string;
  transmission?: string;
  fuel_type?: string;
}

interface UseMakeModelsReturn {
  makes: Make[];
  models: Model[];
  trims: VehicleTrim[];
  isLoading: boolean;
  error: string | null;
  fetchModelsByMakeId: (makeId: string) => Promise<void>;
  fetchTrimsByModelId: (modelId: string, year?: number) => Promise<void>;
  findMakeById: (makeId: string) => Make | undefined;
  findModelById: (modelId: string) => Model | undefined;
  searchMakes: (query: string) => Make[];
  getPopularMakes: () => Make[];
}

export function useMakeModels(): UseMakeModelsReturn {
  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [trims, setTrims] = useState<VehicleTrim[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cache for performance
  const [makesCache, setMakesCache] = useState<Make[]>([]);

  // Fetch makes on mount - ONLY from Supabase
  useEffect(() => {
    fetchMakes();
  }, []);

  const fetchMakes = async () => {
    if (makesCache.length > 0) {
      setMakes(makesCache);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('makes')
        .select('id, make_name')
        .order('make_name');

      if (fetchError) {
        console.error('❌ Supabase makes fetch error:', fetchError);
        throw fetchError;
      }

      const formattedMakes: Make[] = (data || []).map(make => ({
        id: make.id,
        make_name: make.make_name,
        popular: false // We'll implement popular logic later
      }));

      setMakes(formattedMakes);
      setMakesCache(formattedMakes);
    } catch (err: any) {
      console.error('❌ Error fetching makes from Supabase:', err);
      setError('Failed to fetch vehicle makes from database');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchModelsByMakeId = async (makeId: string): Promise<void> => {
    if (!makeId) {
      setModels([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('models')
        .select('id, make_id, model_name')
        .eq('make_id', makeId)
        .order('model_name');

      if (fetchError) {
        console.error('❌ Supabase models fetch error:', fetchError);
        setError(`Failed to fetch models: ${fetchError.message}`);
        setModels([]);
        return;
      }

      if (!data || data.length === 0) {
        setError(`No models found for the selected make`);
        setModels([]);
        return;
      }

      const formattedModels: Model[] = data.map(model => ({
        id: model.id,
        make_id: model.make_id,
        model_name: model.model_name,
        popular: false
      }));

      setModels(formattedModels);
      
      // Clear trims when models change
      setTrims([]);
    } catch (err: any) {
      console.error('❌ Unexpected error in fetchModelsByMakeId:', err);
      setError(`Unexpected error fetching models: ${err.message}`);
      setModels([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrimsByModelId = async (modelId: string, year?: number): Promise<void> => {
    if (!modelId) {
      setTrims([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('model_trims')
        .select('id, trim_name, model_id, year, msrp, engine_type, transmission, fuel_type')
        .eq('model_id', modelId)
        .order('trim_name');

      if (year) {
        query = query.eq('year', year);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('❌ Supabase trims fetch error:', fetchError);
        throw fetchError;
      }

      setTrims(data || []);
    } catch (err: any) {
      console.error('❌ Error fetching trims from Supabase:', err);
      setError('Failed to fetch vehicle trims from database');
      setTrims([]); // Clear trims on error
    } finally {
      setIsLoading(false);
    }
  };

  const findMakeById = (makeId: string): Make | undefined => {
    return makes.find(make => make.id === makeId);
  };

  const findModelById = (modelId: string): Model | undefined => {
    return models.find(model => model.id === modelId);
  };

  const searchMakes = (query: string): Make[] => {
    if (!query.trim()) return makes;
    
    const lowerQuery = query.toLowerCase();
    return makes.filter(make => 
      make.make_name.toLowerCase().includes(lowerQuery)
    );
  };

  const getPopularMakes = (): Make[] => {
    // Return most common/popular makes based on typical usage
    const popularMakeNames = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes-Benz', 'Audi', 'Nissan', 'Hyundai', 'Kia'];
    return makes
      .filter(make => popularMakeNames.includes(make.make_name))
      .slice(0, 10);
  };

  return {
    makes,
    models,
    trims,
    isLoading,
    error,
    fetchModelsByMakeId,
    fetchTrimsByModelId,
    findMakeById,
    findModelById,
    searchMakes,
    getPopularMakes,
  };
}
