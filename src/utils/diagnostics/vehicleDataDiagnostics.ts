
import { supabase } from '@/integrations/supabase/client';

export interface VehicleDataDiagnostics {
  totalMakes: number;
  makesWithModels: number;
  makesWithoutModels: string[];
  totalModels: number;
  modelsWithoutMake: number;
  orphanedModels: string[];
  recommendedActions: string[];
}

export async function diagnoseVehicleData(): Promise<VehicleDataDiagnostics> {
  console.log('🔍 Starting vehicle data diagnostics...');
  
  try {
    // Get all makes
    const { data: allMakes, error: makesError } = await supabase
      .from('makes')
      .select('id, make_name')
      .neq('make_name', 'Unknown Make');
    
    if (makesError) throw makesError;
    
    // Get all models
    const { data: allModels, error: modelsError } = await supabase
      .from('models')
      .select('id, model_name, make_id');
    
    if (modelsError) throw modelsError;
    
    // Analyze data
    const makeIds = new Set(allMakes?.map(m => m.id) || []);
    const modelMakeIds = new Set(allModels?.map(m => m.make_id).filter(Boolean) || []);
    
    const makesWithModels = Array.from(makeIds).filter(makeId => modelMakeIds.has(makeId));
    const makesWithoutModels = (allMakes || [])
      .filter(make => !modelMakeIds.has(make.id))
      .map(make => `${make.make_name} (${make.id})`);
    
    const orphanedModels = (allModels || [])
      .filter(model => model.make_id && !makeIds.has(model.make_id))
      .map(model => `${model.model_name} (make_id: ${model.make_id})`);
    
    const modelsWithoutMake = (allModels || []).filter(model => !model.make_id).length;
    
    // Generate recommendations
    const recommendations: string[] = [];
    
    if (makesWithoutModels.length > 0) {
      recommendations.push(`Remove ${makesWithoutModels.length} makes that have no models`);
    }
    
    if (orphanedModels.length > 0) {
      recommendations.push(`Fix ${orphanedModels.length} models with invalid make references`);
    }
    
    if (modelsWithoutMake > 0) {
      recommendations.push(`Fix ${modelsWithoutMake} models with null make_id`);
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Data integrity looks good!');
    }
    
    const diagnostics: VehicleDataDiagnostics = {
      totalMakes: allMakes?.length || 0,
      makesWithModels: makesWithModels.length,
      makesWithoutModels,
      totalModels: allModels?.length || 0,
      modelsWithoutMake,
      orphanedModels,
      recommendedActions: recommendations
    };
    
    console.log('📊 Vehicle Data Diagnostics:', diagnostics);
    
    return diagnostics;
    
  } catch (error) {
    console.error('❌ Error running diagnostics:', error);
    throw error;
  }
}

export function logDiagnosticsReport(diagnostics: VehicleDataDiagnostics) {
  console.group('🔍 Vehicle Data Diagnostics Report');
  console.log(`📊 Total Makes: ${diagnostics.totalMakes}`);
  console.log(`✅ Makes with Models: ${diagnostics.makesWithModels}`);
  console.log(`❌ Makes without Models: ${diagnostics.makesWithoutModels.length}`);
  
  if (diagnostics.makesWithoutModels.length > 0) {
    console.group('Makes without models:');
    diagnostics.makesWithoutModels.forEach(make => console.log(`  - ${make}`));
    console.groupEnd();
  }
  
  console.log(`📊 Total Models: ${diagnostics.totalModels}`);
  console.log(`❌ Orphaned Models: ${diagnostics.orphanedModels.length}`);
  
  if (diagnostics.orphanedModels.length > 0) {
    console.group('Orphaned models:');
    diagnostics.orphanedModels.forEach(model => console.log(`  - ${model}`));
    console.groupEnd();
  }
  
  console.group('🔧 Recommended Actions:');
  diagnostics.recommendedActions.forEach(action => console.log(`  - ${action}`));
  console.groupEnd();
  
  console.groupEnd();
}
