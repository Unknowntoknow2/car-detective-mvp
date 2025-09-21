
import { supabase } from '@/integrations/supabase/client';

interface MakeWithModels {
  make: string;
  models: string[];
}

export async function queryAllMakesWithModels(): Promise<MakeWithModels[]> {
  try {
    
    // First, get all makes
    const { data: makes, error: makesError } = await supabase
      .from('makes')
      .select('id, make_name')
      .order('make_name');

    if (makesError) {
      console.error('❌ Error fetching makes:', makesError);
      throw makesError;
    }

    if (!makes || makes.length === 0) {
      console.warn('⚠️ No makes found in database');
      return [];
    }


    // For each make, get all associated models
    const makesWithModels: MakeWithModels[] = [];

    for (const make of makes) {
      const { data: models, error: modelsError } = await supabase
        .from('models')
        .select('model_name')
        .eq('make_id', make.id)
        .order('model_name');

      if (modelsError) {
        console.error(`❌ Error fetching models for ${make.make_name}:`, modelsError);
        continue;
      }

      const modelNames = models?.map(model => model.model_name) || [];
      
      makesWithModels.push({
        make: make.make_name,
        models: modelNames
      });

    }

    return makesWithModels;
  } catch (error) {
    console.error('❌ Failed to query makes and models:', error);
    throw error;
  }
}

// Execute the query immediately and log results
export async function executeMakesModelsQuery() {
  try {
    const makesWithModels = await queryAllMakesWithModels();
    
    
    makesWithModels.forEach((makeData, index) => {
      makeData.models.forEach((model, modelIndex) => {
      });
    });

    
    return makesWithModels;
  } catch (error) {
    console.error('❌ Query execution failed:', error);
    return [];
  }
}
