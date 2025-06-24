
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
  debugInfo: {
    lastMakeQuery: string | null;
    lastModelQueryResult: any;
    queryExecutionTime: number | null;
  };
}

export function useMakeModels(): UseMakeModelsReturn {
  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [trims, setTrims] = useState<VehicleTrim[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debug info for troubleshooting
  const [debugInfo, setDebugInfo] = useState({
    lastMakeQuery: null as string | null,
    lastModelQueryResult: null as any,
    queryExecutionTime: null as number | null,
  });

  // Cache for performance
  const [makesCache, setMakesCache] = useState<Make[]>([]);

  // Fetch makes on mount
  useEffect(() => {
    fetchMakes();
  }, []);

  const fetchMakes = async () => {
    if (makesCache.length > 0) {
      console.log('📦 Using cached makes:', makesCache.length);
      setMakes(makesCache);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Fetching makes from Supabase...');
      const startTime = Date.now();
      
      const { data, error: fetchError } = await supabase
        .from('makes')
        .select('id, make_name')
        .order('make_name');

      const queryTime = Date.now() - startTime;
      console.log(`⏱️ Makes query completed in ${queryTime}ms`);

      if (fetchError) {
        console.error('❌ Supabase makes fetch error:', fetchError);
        throw fetchError;
      }

      console.log('✅ Makes fetched successfully:', {
        count: data?.length || 0,
        sample: data?.slice(0, 3)?.map(m => ({ id: m.id, name: m.make_name }))
      });

      const formattedMakes: Make[] = (data || []).map(make => ({
        id: make.id,
        make_name: make.make_name,
        popular: false
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
      console.log('🔍 No makeId provided, clearing models');
      setModels([]);
      setDebugInfo(prev => ({ ...prev, lastMakeQuery: null, lastModelQueryResult: null }));
      return;
    }

    console.log('🔍 Fetching models for makeId:', makeId);
    
    // Find and log the make name for better debugging
    const selectedMake = makes.find(make => make.id === makeId);
    console.log('📝 Selected make:', selectedMake?.make_name || 'Unknown');
    
    setIsLoading(true);
    setError(null);
    
    // Clear previous models immediately to show loading state
    setModels([]);
    
    try {
      const startTime = Date.now();
      console.log('🔍 Executing models query with makeId:', makeId);
      
      const { data, error: fetchError, count } = await supabase
        .from('models')
        .select('id, make_id, model_name', { count: 'exact' })
        .eq('make_id', makeId)
        .order('model_name');

      const queryTime = Date.now() - startTime;
      
      // Update debug info
      setDebugInfo({
        lastMakeQuery: makeId,
        lastModelQueryResult: { data, error: fetchError, count, queryTime },
        queryExecutionTime: queryTime,
      });

      console.log('📊 Models query result:', {
        makeId,
        makeName: selectedMake?.make_name,
        count: count,
        dataLength: data?.length || 0,
        queryTime: queryTime + 'ms',
        error: fetchError?.message || 'none',
        sampleData: data?.slice(0, 3)
      });

      if (fetchError) {
        console.error('❌ Supabase models fetch error:', fetchError);
        setError(`Database error: ${fetchError.message}`);
        return;
      }

      if (!data) {
        console.warn('⚠️ No data returned from models query');
        setError('No data returned from database');
        return;
      }

      if (data.length === 0) {
        console.warn('⚠️ Zero models found for makeId:', makeId, 'Make:', selectedMake?.make_name);
        setError(`No models found for ${selectedMake?.make_name || 'the selected make'}`);
        return;
      }

      console.log('✅ Models loaded successfully:', {
        count: data.length,
        makeName: selectedMake?.make_name,
        modelNames: data.slice(0, 5).map(m => m.model_name)
      });

      const formattedModels: Model[] = data.map(model => ({
        id: model.id,
        make_id: model.make_id,
        model_name: model.model_name,
        popular: false
      }));

      setModels(formattedModels);
      setTrims([]); // Clear trims when models change
      
    } catch (err: any) {
      console.error('❌ Unexpected error in fetchModelsByMakeId:', err);
      setError(`Unexpected error: ${err.message}`);
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

    console.log('🔍 Fetching trims for modelId:', modelId, 'year:', year);
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

      console.log('✅ Trims loaded:', data?.length || 0, 'trims');
      setTrims(data || []);
    } catch (err: any) {
      console.error('❌ Error fetching trims from Supabase:', err);
      setError('Failed to fetch vehicle trims from database');
      setTrims([]);
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
    debugInfo,
  };
}
