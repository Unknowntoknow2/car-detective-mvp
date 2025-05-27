
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useValuationPipeline } from './valuation-pipeline';

interface RealValuationPipelineReturn {
  stage: string;
  vehicle: any;
  requiredInputs: any;
  valuationResult: any;
  error: string | undefined;
  isLoading: boolean;
  runLookup: (type: string, identifier: string, state?: string) => Promise<any>;
  submitValuation: (data: any) => Promise<any>;
}

export function useRealValuationPipeline(): RealValuationPipelineReturn {
  const { state, actions } = useValuationPipeline();
  
  const currentStep = state.steps[state.currentStepIndex];
  const stage = currentStep ? currentStep.id : 'vehicle-identification';
  
  const vehicle = state.data.vehicle || {};
  const requiredInputs = state.data.condition || {};
  const valuationResult = state.data.result || {};
  
  const isLoading = state.isLoading;
  const error = state.error;
  
  const runLookup = useCallback(async (type: string, identifier: string, state?: string) => {
    actions.startLoading();
    
    try {
      let result;
      
      if (type === 'vin') {
        const { data, error } = await supabase.functions.invoke('decode-vin', {
          body: { vin: identifier }
        });
        
        if (error) throw error;
        result = data;
      } else if (type === 'plate') {
        const { data, error } = await supabase.functions.invoke('fetch-vehicle-history', {
          body: { plate: identifier, state, type: 'plate_decode' }
        });
        
        if (error) throw error;
        result = data;
      }
      
      if (result?.vehicle) {
        actions.setVehicleData(result.vehicle);
        actions.setStepCompleted('vehicle-identification', true);
        actions.nextStep();
      }
      
      actions.stopLoading();
      return result;
    } catch (err) {
      console.error('Lookup error:', err);
      actions.setError(err instanceof Error ? err.message : 'Lookup failed');
      actions.stopLoading();
      throw err;
    }
  }, [actions]);
  
  const submitValuation = useCallback(async (data: any) => {
    actions.startLoading();
    
    try {
      const { data: result, error } = await supabase.functions.invoke('car-price-prediction', {
        body: {
          make: vehicle.make || data.make,
          model: vehicle.model || data.model,
          year: vehicle.year || data.year,
          mileage: data.mileage,
          condition: data.condition || 'good',
          zipCode: data.zipCode,
          fuelType: vehicle.fuelType || data.fuelType,
          transmission: vehicle.transmission || data.transmission,
          accident: data.accidents ? 'yes' : 'no',
          accidentDetails: data.accidents ? {
            count: data.accidents.toString(),
            severity: data.accidentSeverity || 'minor'
          } : undefined
        }
      });
      
      if (error) throw error;
      
      actions.setResultData(result);
      actions.setStepCompleted('vehicle-condition', true);
      
      const resultStepIndex = state.steps.findIndex((step: any) => step.id === 'result');
      if (resultStepIndex !== -1) {
        actions.goToStep(resultStepIndex);
      }
      
      actions.stopLoading();
      return result;
    } catch (err) {
      console.error('Valuation error:', err);
      actions.setError(err instanceof Error ? err.message : 'Valuation failed');
      actions.stopLoading();
      throw err;
    }
  }, [actions, state.steps, vehicle]);
  
  return {
    stage,
    vehicle,
    requiredInputs,
    valuationResult,
    error,
    isLoading,
    runLookup,
    submitValuation
  };
}
