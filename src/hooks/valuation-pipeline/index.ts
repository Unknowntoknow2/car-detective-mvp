
export * from './types';
export * from './service';
export * from './useValuationPipeline';

// Add a convenience function to create a state snapshot with common properties
export const getValuationPipelineSnapshot = (state: any) => {
  const currentStep = state.steps ? state.steps[state.currentStepIndex] : null;
  
  return {
    stage: currentStep ? currentStep.id : 'vehicle-identification',
    vehicle: state.data.vehicle || {},
    requiredInputs: state.data.condition || {},
    valuationResult: state.data.result || {},
    error: state.error,
    isLoading: state.isLoading,
    isComplete: state.isComplete,
    currentStep,
    allSteps: state.steps || []
  };
};
