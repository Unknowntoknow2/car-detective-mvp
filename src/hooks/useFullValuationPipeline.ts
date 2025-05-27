
import { useState, useCallback } from 'react';
import { useValuationPipeline } from './valuation-pipeline';

// Define the interface for what the hook returns
interface FullValuationPipelineReturn {
  stage: string;
  vehicle: any;
  requiredInputs: any;
  valuationResult: any;
  error: string | undefined;
  isLoading: boolean;
  runLookup: (type: string, identifier: string, state?: string) => Promise<any>;
  submitValuation: (data: any) => Promise<any>;
}

export function useFullValuationPipeline(): FullValuationPipelineReturn {
  const { state, actions } = useValuationPipeline();
  
  // Extract the current step based on currentStepIndex
  const currentStep = state.steps[state.currentStepIndex];
  const stage = currentStep ? currentStep.id : 'vehicle-identification';
  
  // Get vehicle data from state
  const vehicle = state.data.vehicle || {};
  
  // Create requiredInputs as an alias for condition data
  const requiredInputs = state.data.condition || {};
  
  // Create valuationResult as an alias for result data
  const valuationResult = state.data.result || {};
  
  // Proxy the isLoading and error states
  const isLoading = state.isLoading;
  const error = state.error;
  
  // Helper function to simulate lookup functionality
  const runLookup = useCallback(async (type: string, identifier: string, state?: string) => {
    actions.startLoading();
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Set some mock vehicle data
      const vehicleData = {
        make: type === 'vin' ? 'Toyota' : 'Honda',
        model: type === 'vin' ? 'Camry' : 'Accord',
        year: 2020,
        trim: 'SE',
        vin: type === 'vin' ? identifier : undefined,
        plate: type === 'plate' ? identifier : undefined,
        state: state || undefined
      };
      
      actions.setVehicleData(vehicleData);
      actions.setStepCompleted('vehicle-identification', true);
      
      // Auto advance to next step
      actions.nextStep();
      
      actions.stopLoading();
      return vehicleData;
    } catch (err) {
      console.error('Error during lookup:', err);
      actions.setError(err instanceof Error ? err.message : 'Unknown error during lookup');
      actions.stopLoading();
      throw err;
    }
  }, [actions]);
  
  // Helper function to simulate valuation submission
  const submitValuation = useCallback(async (data: any) => {
    actions.startLoading();
    
    try {
      // Add any additional fields from the data parameter to the condition data
      if (data.mileage || data.accidents || data.titleStatus) {
        actions.setConditionData({
          mileage: data.mileage || requiredInputs.mileage || 50000,
          accidents: data.accidents || requiredInputs.accidents || 0,
          year: data.year || vehicle.year || 2020,
          titleStatus: data.titleStatus || requiredInputs.titleStatus || 'Clean',
          exteriorGrade: data.exteriorGrade || requiredInputs.exteriorGrade,
          interiorGrade: data.interiorGrade || requiredInputs.interiorGrade,
          mechanicalGrade: data.mechanicalGrade || requiredInputs.mechanicalGrade,
          tireCondition: data.tireCondition || requiredInputs.tireCondition
        });
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Set mock result data
      const resultData = {
        estimatedValue: 25000,
        confidenceScore: 85,
        priceRange: [23500, 26500] as [number, number],
        valuationId: `val-${Date.now().toString(36)}`
      };
      
      actions.setResultData(resultData);
      actions.setStepCompleted('vehicle-condition', true);
      
      // Auto advance to result step when valuation is complete
      const resultStepIndex = state.steps.findIndex((step: any) => step.id === 'result');
      if (resultStepIndex !== -1) {
        actions.goToStep(resultStepIndex);
      }
      
      actions.stopLoading();
      return resultData;
    } catch (err) {
      console.error('Error during valuation submission:', err);
      actions.setError(err instanceof Error ? err.message : 'Unknown error during valuation');
      actions.stopLoading();
      throw err;
    }
  }, [actions, state.steps, vehicle, requiredInputs]);
  
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
