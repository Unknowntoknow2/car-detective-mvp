
import { supabase } from '@/integrations/supabase/client';

interface MakeWithModels {
  make: string;
  models: string[];
}

export async function queryAllMakesWithModels(): Promise<MakeWithModels[]> {
  try {
    console.log('🔍 Fetching all makes and their models from Supabase...');
    
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

    console.log(`✅ Found ${makes.length} makes`);

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

      console.log(`📋 ${make.make_name}: ${modelNames.length} models`);
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
    
    console.log('\n🎯 COMPLETE MAKES AND MODELS DATA:');
    console.log('====================================');
    
    makesWithModels.forEach((makeData, index) => {
      console.log(`\n${index + 1}. ${makeData.make} (${makeData.models.length} models):`);
      makeData.models.forEach((model, modelIndex) => {
        console.log(`   ${modelIndex + 1}. ${model}`);
      });
    });

    console.log('\n📊 SUMMARY:');
    console.log(`Total Makes: ${makesWithModels.length}`);
    console.log(`Total Models: ${makesWithModels.reduce((sum, make) => sum + make.models.length, 0)}`);
    
    return makesWithModels;
  } catch (error) {
    console.error('❌ Query execution failed:', error);
    return [];
  }
}
