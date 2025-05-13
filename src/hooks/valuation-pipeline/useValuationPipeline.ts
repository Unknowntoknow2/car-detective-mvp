
import { useReducer, useCallback } from 'react';
import { initialValuationPipelineState, valuationPipelineReducer } from './service';
import { ValuationConditionData, ValuationPipelineState, PipelineActions } from './types';

interface ValuationPipelineHook {
  state: ValuationPipelineState;
  actions: PipelineActions;
  // Additional exported properties for backward compatibility
  stage?: string;
  vehicle?: any;
  requiredInputs?: any;
  valuationResult?: any;
  error?: string;
  isLoading?: boolean;
  runLookup: (type: string, identifier: string, state?: string, manualData?: any) => Promise<any>;
  submitValuation: (data: any) => Promise<any>;
  reset: () => void;
}

export function useValuationPipeline(): ValuationPipelineHook {
  const [state, dispatch] = useReducer(valuationPipelineReducer, initialValuationPipelineState);

  // Extract the current step based on currentStepIndex
  const currentStep = state.steps[state.currentStepIndex];
  const stage = currentStep ? currentStep.id : 'vehicle-identification';
  
  // Get vehicle data from state
  const vehicle = state.data.vehicle || {};
  
  // Create requiredInputs as an alias for condition data
  const requiredInputs = state.data.condition || {};
  
  // Create valuationResult as an alias for result data
  const valuationResult = state.data.result || {};

  const nextStep = useCallback(() => {
    dispatch({ type: 'NEXT_STEP' });
  }, []);

  const previousStep = useCallback(() => {
    dispatch({ type: 'PREVIOUS_STEP' });
  }, []);

  const goToStep = useCallback((stepIndex: number) => {
    dispatch({ type: 'GO_TO_STEP', payload: stepIndex });
  }, []);

  const setStepCompleted = useCallback((stepId: string, isCompleted: boolean) => {
    dispatch({ type: 'SET_STEP_COMPLETED', payload: { stepId, isCompleted } });
  }, []);

  const setVehicleData = useCallback((data: any) => {
    dispatch({ type: 'SET_VEHICLE_DATA', payload: data });
  }, []);

  const setConditionData = useCallback((data: ValuationConditionData) => {
    dispatch({ type: 'SET_CONDITION_DATA', payload: data });
  }, []);

  const setFeaturesData = useCallback((data: string[]) => {
    dispatch({ type: 'SET_FEATURES_DATA', payload: data });
  }, []);

  const setLocationData = useCallback((data: any) => {
    dispatch({ type: 'SET_LOCATION_DATA', payload: data });
  }, []);

  const setPhotosData = useCallback((data: File[]) => {
    dispatch({ type: 'SET_PHOTOS_DATA', payload: data });
  }, []);

  const setResultData = useCallback((data: any) => {
    dispatch({ type: 'SET_RESULT_DATA', payload: data });
  }, []);

  const resetPipeline = useCallback(() => {
    dispatch({ type: 'RESET_PIPELINE' });
  }, []);

  const startLoading = useCallback(() => {
    dispatch({ type: 'START_LOADING' });
  }, []);

  const stopLoading = useCallback(() => {
    dispatch({ type: 'STOP_LOADING' });
  }, []);

  const setError = useCallback((error: string) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  // Helper function to simulate lookup functionality
  const runLookup = useCallback(async (type: string, identifier: string, state?: string, manualData?: any) => {
    dispatch({ type: 'START_LOADING' });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Use manual data if provided, otherwise create mock data
      const vehicleData = manualData || {
        make: type === 'vin' ? 'Toyota' : 'Honda',
        model: type === 'vin' ? 'Camry' : 'Accord',
        year: 2020,
        trim: 'SE',
        vin: type === 'vin' ? identifier : undefined,
        plate: type === 'plate' ? identifier : undefined,
        state: state || undefined
      };
      
      dispatch({ type: 'SET_VEHICLE_DATA', payload: vehicleData });
      dispatch({ type: 'SET_STEP_COMPLETED', payload: { stepId: 'vehicle-identification', isCompleted: true } });
      
      // Auto advance to next step
      dispatch({ type: 'NEXT_STEP' });
      
      dispatch({ type: 'STOP_LOADING' });
      return vehicleData;
    } catch (err) {
      console.error('Error during lookup:', err);
      dispatch({ type: 'SET_ERROR', payload: err instanceof Error ? err.message : 'Unknown error during lookup' });
      dispatch({ type: 'STOP_LOADING' });
      throw err;
    }
  }, []);
  
  // Helper function to simulate valuation submission
  const submitValuation = useCallback(async (data: any) => {
    dispatch({ type: 'START_LOADING' });
    
    try {
      // Add any additional fields from the data parameter to the condition data
      if (data.mileage || data.accidents || data.titleStatus) {
        dispatch({ 
          type: 'SET_CONDITION_DATA', 
          payload: {
            mileage: data.mileage || requiredInputs.mileage || 50000,
            accidents: data.accidents || requiredInputs.accidents || 0,
            year: data.year || vehicle.year || 2020,
            titleStatus: data.titleStatus || requiredInputs.titleStatus || 'Clean',
            exteriorGrade: data.exteriorGrade || requiredInputs.exteriorGrade,
            interiorGrade: data.interiorGrade || requiredInputs.interiorGrade,
            mechanicalGrade: data.mechanicalGrade || requiredInputs.mechanicalGrade,
            tireCondition: data.tireCondition || requiredInputs.tireCondition
          }
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
      
      dispatch({ type: 'SET_RESULT_DATA', payload: resultData });
      dispatch({ type: 'SET_STEP_COMPLETED', payload: { stepId: 'vehicle-condition', isCompleted: true } });
      
      // Auto advance to result step when valuation is complete
      const resultStepIndex = state.steps.findIndex(step => step.id === 'result');
      if (resultStepIndex !== -1) {
        dispatch({ type: 'GO_TO_STEP', payload: resultStepIndex });
      }
      
      dispatch({ type: 'STOP_LOADING' });
      return resultData;
    } catch (err) {
      console.error('Error during valuation submission:', err);
      dispatch({ type: 'SET_ERROR', payload: err instanceof Error ? err.message : 'Unknown error during valuation' });
      dispatch({ type: 'STOP_LOADING' });
      throw err;
    }
  }, [state.steps, vehicle, requiredInputs]);

  // Add alias for resetPipeline to match what's expected in ValuationPage
  const reset = resetPipeline;
  
  const actions = {
    nextStep,
    previousStep,
    goToStep,
    setStepCompleted,
    setVehicleData,
    setConditionData,
    setFeaturesData,
    setLocationData,
    setPhotosData,
    setResultData,
    resetPipeline,
    startLoading,
    stopLoading,
    setError
  };

  return {
    state,
    actions,
    // Directly expose these for backward compatibility
    stage,
    vehicle,
    requiredInputs,
    valuationResult,
    error: state.error,
    isLoading: state.isLoading,
    runLookup,
    submitValuation,
    reset
  };
}
