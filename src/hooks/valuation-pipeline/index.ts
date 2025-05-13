
import { useReducer, useCallback } from 'react';
import { ValuationPipelineState, ValuationPipelineAction, ValuationConditionData } from './types';

// Define initial steps for the valuation pipeline
const initialSteps = [
  {
    id: 'vehicle-identification',
    name: 'Vehicle Identification',
    description: 'Identify your vehicle',
    component: 'VehicleIdentificationStep',
    isCompleted: false,
    isActive: true,
    data: {}
  },
  {
    id: 'vehicle-condition',
    name: 'Vehicle Condition',
    description: 'Provide details about your vehicle condition',
    component: 'VehicleConditionStep',
    isCompleted: false,
    isActive: false,
    data: {}
  },
  {
    id: 'features',
    name: 'Features',
    description: 'Select vehicle features',
    component: 'FeaturesStep',
    isCompleted: false,
    isActive: false,
    data: {}
  },
  {
    id: 'photos',
    name: 'Photos',
    description: 'Upload vehicle photos',
    component: 'PhotosStep',
    isCompleted: false,
    isActive: false,
    data: {}
  },
  {
    id: 'location',
    name: 'Location',
    description: 'Provide your location',
    component: 'LocationStep',
    isCompleted: false,
    isActive: false,
    data: {}
  },
  {
    id: 'result',
    name: 'Result',
    description: 'View your valuation result',
    component: 'ResultStep',
    isCompleted: false,
    isActive: false,
    data: {}
  }
];

// Initial state
const initialState: ValuationPipelineState = {
  steps: initialSteps,
  currentStepIndex: 0,
  data: {
    vehicle: {},
    condition: {},
    features: [],
    location: {},
    photos: [],
    result: {}
  },
  isComplete: false,
  isLoading: false,
  error: undefined
};

// Reducer function to handle state updates
function valuationPipelineReducer(state: ValuationPipelineState, action: ValuationPipelineAction): ValuationPipelineState {
  switch (action.type) {
    case 'NEXT_STEP':
      if (state.currentStepIndex >= state.steps.length - 1) {
        return state;
      }
      
      return {
        ...state,
        currentStepIndex: state.currentStepIndex + 1,
        steps: state.steps.map((step, index) => ({
          ...step,
          isActive: index === state.currentStepIndex + 1
        }))
      };
      
    case 'PREVIOUS_STEP':
      if (state.currentStepIndex <= 0) {
        return state;
      }
      
      return {
        ...state,
        currentStepIndex: state.currentStepIndex - 1,
        steps: state.steps.map((step, index) => ({
          ...step,
          isActive: index === state.currentStepIndex - 1
        }))
      };
      
    case 'GO_TO_STEP':
      if (action.payload < 0 || action.payload >= state.steps.length) {
        return state;
      }
      
      return {
        ...state,
        currentStepIndex: action.payload,
        steps: state.steps.map((step, index) => ({
          ...step,
          isActive: index === action.payload
        }))
      };
      
    case 'SET_STEP_COMPLETED':
      return {
        ...state,
        steps: state.steps.map(step => 
          step.id === action.payload.stepId 
            ? { ...step, isCompleted: action.payload.isCompleted }
            : step
        )
      };
      
    case 'SET_VEHICLE_DATA':
      return {
        ...state,
        data: {
          ...state.data,
          vehicle: action.payload
        }
      };
      
    case 'SET_CONDITION_DATA':
      return {
        ...state,
        data: {
          ...state.data,
          condition: action.payload
        }
      };
      
    case 'SET_FEATURES_DATA':
      return {
        ...state,
        data: {
          ...state.data,
          features: action.payload
        }
      };
      
    case 'SET_LOCATION_DATA':
      return {
        ...state,
        data: {
          ...state.data,
          location: action.payload
        }
      };
      
    case 'SET_PHOTOS_DATA':
      return {
        ...state,
        data: {
          ...state.data,
          photos: action.payload
        }
      };
      
    case 'SET_RESULT_DATA':
      return {
        ...state,
        data: {
          ...state.data,
          result: action.payload
        },
        isComplete: true
      };
      
    case 'RESET_PIPELINE':
      return initialState;
      
    case 'START_LOADING':
      return {
        ...state,
        isLoading: true,
        error: undefined
      };
      
    case 'STOP_LOADING':
      return {
        ...state,
        isLoading: false
      };
      
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
      
    default:
      return state;
  }
}

export function useValuationPipeline() {
  const [state, dispatch] = useReducer(valuationPipelineReducer, initialState);
  
  // Create action handlers
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
  
  // Additional action functions for more advanced operations
  const runLookup = useCallback(async (type: string, identifier: string, state?: string, manualData?: any) => {
    dispatch({ type: 'START_LOADING' });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Set vehicle data based on lookup type
      let vehicleData = {};
      
      if (type === 'manual' && manualData) {
        // Use provided manual data
        vehicleData = manualData;
      } else {
        // Mock data for other lookup types
        vehicleData = {
          make: type === 'vin' ? 'Toyota' : 'Honda',
          model: type === 'vin' ? 'Camry' : 'Accord',
          year: 2020,
          trim: 'SE',
          vin: type === 'vin' ? identifier : undefined,
          plate: type === 'plate' ? identifier : undefined,
          state: state || undefined
        };
      }
      
      dispatch({ type: 'SET_VEHICLE_DATA', payload: vehicleData });
      dispatch({ type: 'SET_STEP_COMPLETED', payload: { stepId: 'vehicle-identification', isCompleted: true } });
      
      // Auto advance to next step
      dispatch({ type: 'NEXT_STEP' });
      
      dispatch({ type: 'STOP_LOADING' });
      return vehicleData;
    } catch (err) {
      console.error('Error during lookup:', err);
      dispatch({ type: 'SET_ERROR', payload: err instanceof Error ? err.message : 'Unknown error during lookup' });
      throw err;
    }
  }, []);
  
  const submitValuation = useCallback(async (data: any) => {
    dispatch({ type: 'START_LOADING' });
    
    try {
      // Add condition data
      if (data) {
        dispatch({ type: 'SET_CONDITION_DATA', payload: {
          mileage: data.mileage || 0,
          accidents: data.accidents || 0,
          year: data.year || state.data.vehicle?.year || 0,
          titleStatus: data.titleStatus || 'Clean',
          exteriorGrade: data.exteriorGrade,
          interiorGrade: data.interiorGrade,
          mechanicalGrade: data.mechanicalGrade,
          tireCondition: data.tireCondition
        }});
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
      throw err;
    }
  }, [state.steps, state.data.vehicle]);
  
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

  // Determine the current step based on the index
  const currentStep = state.steps[state.currentStepIndex];
  const stage = currentStep ? currentStep.id : 'vehicle-identification';
  
  // Extract convenience properties that make hooks easier to use
  const vehicle = state.data.vehicle || {};
  const requiredInputs = state.data.condition || {};
  const valuationResult = state.data.result || {};
  const error = state.error;
  const isLoading = state.isLoading;

  return {
    state,
    actions,
    // Expose convenience properties
    stage,
    vehicle,
    requiredInputs,
    valuationResult,
    error,
    isLoading,
    // Expose pipeline action methods
    runLookup,
    submitValuation,
    reset: resetPipeline
  };
}

// Also export state and action types
export type { ValuationPipelineState, ValuationPipelineAction, ValuationConditionData };
