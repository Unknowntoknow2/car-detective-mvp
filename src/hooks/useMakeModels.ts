
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Raw types from Supabase response
interface RawMake {
  id: string;
  make_name: string;
}

interface RawModel {
  id: string;
  model_name: string;
  make_id: string;
}

// Transformed types for component consumption
export interface Make {
  id: string;
  name: string;
}

export interface Model {
  id: string;
  name: string;
  makeId: string;
}

/**
 * Fetches makes and models from Supabase
 * @returns {Promise<{makes: Make[], models: Model[]}>} Makes and models data
 */
async function fetchMakesModels(): Promise<{ makes: Make[], models: Model[] }> {
  console.log('Fetching makes and models from Supabase...');
  
  // Fetch makes
  const { data: makesData, error: makesError } = await supabase
    .from('makes')
    .select('id, make_name')
    .order('make_name', { ascending: true });
  
  if (makesError) {
    console.error('Error fetching makes:', makesError);
    throw new Error(`Error fetching makes: ${makesError.message}`);
  }
  
  // Fetch models
  const { data: modelsData, error: modelsError } = await supabase
    .from('models')
    .select('id, model_name, make_id')
    .order('model_name', { ascending: true });
  
  if (modelsError) {
    console.error('Error fetching models:', modelsError);
    throw new Error(`Error fetching models: ${modelsError.message}`);
  }
  
  console.log('Raw makes data:', makesData);
  console.log('Raw models data:', modelsData);
  
  // Transform data to match expected interface
  const makes: Make[] = makesData.map((make: RawMake) => ({
    id: make.id,
    name: make.make_name
  }));
  
  const models: Model[] = modelsData.map((model: RawModel) => ({
    id: model.id,
    name: model.model_name,
    makeId: model.make_id
  }));
  
  console.log('Transformed makes:', makes);
  console.log('Transformed models:', models);
  
  return { makes, models };
}

/**
 * React Query hook to fetch and cache makes and models
 * @returns {UseQueryResult<{makes: Make[], models: Model[]}>} Query result with makes and models
 */
export function useMakeModels() {
  return useQuery({
    queryKey: ['makes', 'models'],
    queryFn: fetchMakesModels,
    staleTime: 300_000, // 5 minutes
    retry: 2
  });
}
