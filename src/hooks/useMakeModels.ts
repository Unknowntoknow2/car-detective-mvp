
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
      console.log('🔄 Fetching makes from Supabase...');
      const { data, error: fetchError } = await supabase
        .from('makes')
        .select('id, make_name')
        .order('make_name');

      if (fetchError) {
        console.error('❌ Supabase makes fetch error:', fetchError);
        throw fetchError;
      }

      console.log('✅ Fetched makes from Supabase:', data?.length || 0, 'records');

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
      console.log('⚠️ No makeId provided, clearing models');
      setModels([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Fetching models for make ID:', makeId);
      const { data, error: fetchError } = await supabase
        .from('models')
        .select('id, make_id, model_name')
        .eq('make_id', makeId)
        .order('model_name');

      if (fetchError) {
        console.error('❌ Supabase models fetch error:', fetchError);
        throw fetchError;
      }

      console.log('✅ Fetched models from Supabase:', data?.length || 0, 'records for make:', makeId);

      const formattedModels: Model[] = (data || []).map(model => ({
        id: model.id,
        make_id: model.make_id,
        model_name: model.model_name,
        popular: false
      }));

      setModels(formattedModels);
      
      // Clear trims when models change
      setTrims([]);
    } catch (err: any) {
      console.error('❌ Error fetching models from Supabase:', err);
      setError('Failed to fetch vehicle models from database');
      setModels([]); // Clear models on error
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrimsByModelId = async (modelId: string, year?: number): Promise<void> => {
    if (!modelId) {
      console.log('⚠️ No modelId provided, clearing trims');
      setTrims([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Fetching trims for model ID:', modelId, 'year:', year);
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

      console.log('✅ Fetched trims from Supabase:', data?.length || 0, 'records for model:', modelId);

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
    // For now, return first 10 makes as "popular"
    return makes.slice(0, 10);
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
