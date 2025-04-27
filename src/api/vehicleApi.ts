
import { supabase } from '@/integrations/supabase/client';
import { Make, Model } from '@/hooks/types/vehicle';
import { toast } from 'sonner';

export async function fetchVehicleData() {
  console.log("Fetching vehicle data from Supabase...");
  
  try {
    // First, check if we can directly query the database
    const [makesResult, modelsResult] = await Promise.all([
      supabase.from('makes').select('*').order('make_name'),
      supabase.from('models').select('*').order('model_name')
    ]);

    // Log the results for debugging
    console.log("Makes query result:", makesResult);
    console.log("Models query result:", modelsResult);

    // Check for errors
    if (makesResult.error) {
      console.error("Error fetching makes:", makesResult.error);
      throw makesResult.error;
    }
    
    if (modelsResult.error) {
      console.error("Error fetching models:", modelsResult.error);
      throw modelsResult.error;
    }

    // Check if we have enough data from direct query
    if (makesResult.data && makesResult.data.length > 0 && modelsResult.data && modelsResult.data.length > 0) {
      console.log(`Successfully fetched ${makesResult.data.length} makes and ${modelsResult.data.length} models directly from database`);
      
      // Transform the data to match the Make interface structure
      const makes: Make[] = makesResult.data.map(make => ({
        id: make.id,
        make_name: make.make_name || '', // Use empty string as fallback
        logo_url: make.logo_url || null,
        nhtsa_make_id: make.nhtsa_make_id || null,
        country_of_origin: make.country_of_origin || null,
        description: make.description || null,
        founding_year: make.founding_year || null
      }));
      
      return {
        makes,
        models: modelsResult.data
      };
    }
    
    // If direct query didn't yield enough results, try the edge function
    console.log("Attempting to fetch via edge function to populate database...");
    
    try {
      const { data, error } = await supabase.functions.invoke('fetch-vehicle-data', {
        method: 'GET'
      });
      
      if (error) {
        console.error("Edge function error:", error);
        throw error;
      }
      
      if (data && data.makes && data.makes.length > 0) {
        console.log(`Edge function returned ${data.makes.length} makes and ${data.models?.length || 0} models`);
        return {
          makes: data.makes,
          models: data.models || []
        };
      }
      
      throw new Error("Edge function returned empty dataset");
      
    } catch (funcError) {
      console.error("Error invoking edge function:", funcError);
      toast.error("Couldn't fetch vehicle data from server. Using local data instead.");
      
      // Return what we got from the direct query (may be empty)
      // Transform the data to match the Make interface structure
      const makes: Make[] = (makesResult.data || []).map(make => ({
        id: make.id,
        make_name: make.make_name || '',  // Use empty string as fallback
        logo_url: make.logo_url || null,
        nhtsa_make_id: make.nhtsa_make_id || null,
        country_of_origin: make.country_of_origin || null,
        description: null,
        founding_year: null
      }));
      
      return {
        makes,
        models: modelsResult.data || []
      };
    }
  } catch (error) {
    console.error("Exception in fetchVehicleData:", error);
    throw error;
  }
}

export async function getMakeById(id: string): Promise<Make | null> {
  try {
    const { data, error } = await supabase
      .from('makes')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching make by ID:", error);
    return null;
  }
}

export async function getModelById(id: string): Promise<Model | null> {
  try {
    const { data, error } = await supabase
      .from('models')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching model by ID:", error);
    return null;
  }
}

export async function getModelsByMakeId(makeId: string): Promise<Model[]> {
  try {
    const { data, error } = await supabase
      .from('models')
      .select('*')
      .eq('make_id', makeId)
      .order('model_name');
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching models by make ID:", error);
    return [];
  }
}
