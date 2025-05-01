
import { supabase } from '@/integrations/supabase/client';
import { Make, Model } from '@/hooks/types/vehicle';
import { toast } from 'sonner';

export async function fetchVehicleData() {
  console.log("Fetching vehicle data from Supabase...");
  
  try {
    // Fetch makes
    const { data: makes, error: makesError } = await supabase
      .from('makes')
      .select('*')
      .order('make_name');
    
    if (makesError) {
      throw new Error(`Error fetching makes: ${makesError.message}`);
    }
    
    // Fetch all models
    const { data: models, error: modelsError } = await supabase
      .from('models')
      .select('*')
      .order('model_name');
    
    if (modelsError) {
      throw new Error(`Error fetching models: ${modelsError.message}`);
    }
    
    // Transform data to match expected format
    const transformedMakes: Make[] = (makes || []).map(make => ({
      id: make.id,
      make_name: make.make_name,
      logo_url: null,
      country_of_origin: null,
      nhtsa_make_id: make.make_id
    }));
    
    const transformedModels: Model[] = (models || []).map(model => ({
      id: model.id,
      make_id: String(model.make_id),
      model_name: model.model_name,
      nhtsa_model_id: null
    }));
    
    console.log(`Fetched ${transformedMakes.length} makes and ${transformedModels.length} models from Supabase`);
    
    return {
      makes: transformedMakes,
      models: transformedModels
    };
  } catch (error) {
    console.error("Exception in fetchVehicleData:", error);
    toast.error("Couldn't fetch vehicle data");
    throw error; // No fallback - let the error propagate
  }
}

export async function getMakeById(id: string): Promise<Make | null> {
  try {
    const { data, error } = await supabase
      .from('makes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      console.error("Error fetching make by ID:", error);
      return null;
    }
    
    return {
      id: data.id,
      make_name: data.make_name,
      logo_url: null,
      country_of_origin: null,
      nhtsa_make_id: data.make_id
    };
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
    
    if (error || !data) {
      console.error("Error fetching model by ID:", error);
      return null;
    }
    
    return {
      id: data.id,
      make_id: String(data.make_id),
      model_name: data.model_name,
      nhtsa_model_id: null
    };
  } catch (error) {
    console.error("Error fetching model by ID:", error);
    return null;
  }
}

export async function getModelsByMakeId(makeId: string): Promise<Model[]> {
  try {
    console.log(`Fetching models for make ID: ${makeId}`);
    
    const { data, error } = await supabase
      .from('models')
      .select('*')
      .eq('make_id', makeId)
      .order('model_name');
    
    if (error) {
      console.error("Error fetching models by make ID:", error);
      return [];
    }
    
    const models = (data || []).map(model => ({
      id: model.id,
      make_id: String(model.make_id),
      model_name: model.model_name,
      nhtsa_model_id: null
    }));
    
    console.log(`Found ${models.length} models for make ID: ${makeId}`);
    return models;
  } catch (error) {
    console.error("Error fetching models by make ID:", error);
    return [];
  }
}
