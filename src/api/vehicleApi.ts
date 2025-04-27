
import { supabase } from '@/integrations/supabase/client';
import { Make, Model } from '@/hooks/types/vehicle';

export async function fetchVehicleData() {
  console.log("Fetching vehicle data from Supabase...");
  
  try {
    const [makesResult, modelsResult] = await Promise.all([
      supabase.from('makes').select('*').order('make_name'),
      supabase.from('models').select('*').order('model_name')
    ]);

    console.log("Makes query result:", makesResult);
    console.log("Models query result:", modelsResult);

    if (makesResult.error) {
      console.error("Error fetching makes:", makesResult.error);
      throw makesResult.error;
    }
    
    if (modelsResult.error) {
      console.error("Error fetching models:", modelsResult.error);
      throw modelsResult.error;
    }

    console.log(`Successfully fetched ${makesResult.data?.length || 0} makes and ${modelsResult.data?.length || 0} models`);
    
    return {
      makes: makesResult.data || [],
      models: modelsResult.data || []
    };
  } catch (error) {
    console.error("Exception in fetchVehicleData:", error);
    throw error;
  }
}
