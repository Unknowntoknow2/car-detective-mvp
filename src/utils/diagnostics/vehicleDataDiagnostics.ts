
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
    return diagnostics;
    
  } catch (error) {
    throw error;
  }
}

export function logDiagnosticsReport(diagnostics: VehicleDataDiagnostics) {
  console.group('🔍 Vehicle Data Diagnostics Report');
  if (diagnostics.makesWithoutModels.length > 0) {
    console.group('Makes without models:');
    console.groupEnd();
  }
  if (diagnostics.orphanedModels.length > 0) {
    console.group('Orphaned models:');
    console.groupEnd();
  }
  
  console.group('🔧 Recommended Actions:');
  console.groupEnd();
  
  console.groupEnd();
}
