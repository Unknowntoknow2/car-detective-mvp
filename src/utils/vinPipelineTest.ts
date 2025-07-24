/**
 * PHASE 1 COMPLETION: Comprehensive VIN Pipeline Testing & Validation
 * 
 * This utility provides real-time testing and validation of the complete VIN decode pipeline
 */

import { supabase } from '@/integrations/supabase/client';
import { fetchVehicleByVin } from '@/services/vehicleLookupService';
import { decodeVin, getDecodedVehicle, needsDecoding } from '@/services/valuation/vehicleDecodeService';

export interface PipelineTestResult {
  step: string;
  success: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

export interface CompletePipelineTest {
  vin: string;
  overallSuccess: boolean;
  steps: PipelineTestResult[];
  summary: {
    edgeFunctionWorking: boolean;
    databaseSaving: boolean;
    decodedVehicleTable: boolean;
    followUpIntegration: boolean;
    completePipeline: boolean;
  };
}

/**
 * Test the complete VIN decode pipeline
 */
export async function testVinPipeline(vin: string): Promise<CompletePipelineTest> {
  console.log('🧪 [PIPELINE TEST] Starting comprehensive test for VIN:', vin);
  
  const results: PipelineTestResult[] = [];
  const summary = {
    edgeFunctionWorking: false,
    databaseSaving: false,
    decodedVehicleTable: false,
    followUpIntegration: false,
    completePipeline: false
  };

  // Step 1: Test VIN validation
  try {
    if (!vin || vin.length !== 17) {
      throw new Error('Invalid VIN format');
    }
    results.push({
      step: 'VIN Validation',
      success: true,
      data: { vin, length: vin.length },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    results.push({
      step: 'VIN Validation',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
    return { vin, overallSuccess: false, steps: results, summary };
  }

  // Step 2: Test direct edge function call
  try {
    console.log('🧪 [PIPELINE TEST] Testing direct edge function call...');
    const { data, error } = await supabase.functions.invoke('unified-decode', {
      body: { vin: vin.toUpperCase() }
    });

    if (error) {
      throw new Error(`Edge function error: ${JSON.stringify(error)}`);
    }

    if (!data || !data.success) {
      throw new Error(`Edge function failed: ${data?.error || 'Unknown error'}`);
    }

    summary.edgeFunctionWorking = true;
    results.push({
      step: 'Edge Function Call',
      success: true,
      data: { success: data.success, hasDecoded: !!data.decoded },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    results.push({
      step: 'Edge Function Call',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }

  // Step 3: Test database saving verification
  try {
    console.log('🧪 [PIPELINE TEST] Testing database save verification...');
    const { data: dbData, error: dbError } = await supabase
      .from('decoded_vehicles')
      .select('*')
      .eq('vin', vin.toUpperCase())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (dbError) {
      throw new Error(`Database query error: ${dbError.message}`);
    }

    if (dbData) {
      summary.databaseSaving = true;
      summary.decodedVehicleTable = true;
      results.push({
        step: 'Database Save Verification',
        success: true,
        data: { 
          vehicleId: dbData.id, 
          make: dbData.make, 
          model: dbData.model, 
          year: dbData.year,
          createdAt: dbData.created_at
        },
        timestamp: new Date().toISOString()
      });
    } else {
      results.push({
        step: 'Database Save Verification',
        success: false,
        error: 'No vehicle record found in database',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    results.push({
      step: 'Database Save Verification',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }

  // Step 4: Test vehicleLookupService integration
  try {
    console.log('🧪 [PIPELINE TEST] Testing vehicleLookupService...');
    const vehicleInfo = await fetchVehicleByVin(vin);
    
    if (!vehicleInfo || !vehicleInfo.make || !vehicleInfo.model) {
      throw new Error('Invalid vehicle info returned');
    }

    results.push({
      step: 'VehicleLookupService',
      success: true,
      data: { 
        make: vehicleInfo.make, 
        model: vehicleInfo.model, 
        year: vehicleInfo.year,
        confidenceScore: vehicleInfo.confidenceScore
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    results.push({
      step: 'VehicleLookupService',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }

  // Step 5: Test decode service integration
  try {
    console.log('🧪 [PIPELINE TEST] Testing decode service integration...');
    const decodeResult = await decodeVin(vin);
    
    if (!decodeResult.success) {
      throw new Error(decodeResult.error || 'Decode service failed');
    }

    results.push({
      step: 'Decode Service Integration',
      success: true,
      data: { 
        hasVehicle: !!decodeResult.vehicle,
        vehicleData: decodeResult.vehicle
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    results.push({
      step: 'Decode Service Integration',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }

  // Step 6: Test follow-up integration
  try {
    console.log('🧪 [PIPELINE TEST] Testing follow-up integration...');
    const needsDecode = await needsDecoding(vin);
    const decodedVehicle = await getDecodedVehicle(vin);
    
    summary.followUpIntegration = !!decodedVehicle;
    
    results.push({
      step: 'Follow-up Integration',
      success: true,
      data: { 
        needsDecoding: needsDecode,
        hasDecodedVehicle: !!decodedVehicle,
        decodedVehicleId: decodedVehicle?.id
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    results.push({
      step: 'Follow-up Integration',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }

  // Calculate overall success
  const successfulSteps = results.filter(r => r.success).length;
  const totalSteps = results.length;
  summary.completePipeline = successfulSteps === totalSteps && summary.edgeFunctionWorking && summary.databaseSaving;

  const overallSuccess = summary.completePipeline;

  console.log('🧪 [PIPELINE TEST] Test completed:', {
    vin,
    overallSuccess,
    successfulSteps,
    totalSteps,
    summary
  });

  return {
    vin,
    overallSuccess,
    steps: results,
    summary
  };
}

/**
 * Quick validation test for production use
 */
export async function quickPipelineCheck(vin: string): Promise<boolean> {
  try {
    const result = await testVinPipeline(vin);
    return result.overallSuccess;
  } catch (error) {
    console.error('❌ [QUICK CHECK] Pipeline test failed:', error);
    return false;
  }
}

/**
 * Development utility to test the pipeline with a known VIN
 */
export async function runDevelopmentTest(): Promise<CompletePipelineTest> {
  const testVin = '2C3CDZAG5HH658653'; // Known test VIN
  console.log('🧪 [DEV TEST] Running development pipeline test...');
  return await testVinPipeline(testVin);
}