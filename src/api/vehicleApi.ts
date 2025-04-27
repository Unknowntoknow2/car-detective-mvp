
import { supabase } from '@/integrations/supabase/client';
import { Make, Model } from '@/hooks/types/vehicle';

export async function fetchVehicleData() {
  const [makesResult, modelsResult] = await Promise.all([
    supabase.from('makes').select('*').order('make_name'),
    supabase.from('models').select('*').order('model_name')
  ]);

  if (makesResult.error) throw makesResult.error;
  if (modelsResult.error) throw modelsResult.error;

  return {
    makes: makesResult.data || [],
    models: modelsResult.data || []
  };
}
