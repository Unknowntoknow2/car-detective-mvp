import { ValuationPipelineState, ValuationPipelineReducerAction } from './types';

// Initial state for the valuation pipeline
export const initialValuationPipelineState: ValuationPipelineState = {
  steps: [
    {
      id: 'vehicle-identification',
      title: 'Vehicle Identification',
      description: 'Identify your vehicle using VIN, license plate, or manual entry',
      isCompleted: false,
      isActive: true
    },
    {
      id: 'vehicle-condition',
      title: 'Vehicle Condition',
      description: 'Assess the condition of your vehicle',
      isCompleted: false,
      isActive: false
    },
    {
      id: 'features',
      title: 'Features',
      description: 'Select additional features your vehicle has',
      isCompleted: false,
      isActive: false
    },
    {
      id: 'photos',
      title: 'Photos',
      description: 'Upload photos of your vehicle for a more accurate valuation',
      isCompleted: false,
      isActive: false
    },
    {
      id: 'location',
      title: 'Location',
      description: 'Provide your location for regional price adjustments',
      isCompleted: false,
      isActive: false
    },
    {
      id: 'result',
      title: 'Valuation Result',
      description: 'View your vehicle valuation results',
      isCompleted: false,
      isActive: false
    }
  ],
  currentStepIndex: 0,
  data: {},
  isLoading: false,
  isComplete: false
};

// Reducer for the valuation pipeline
export function valuationPipelineReducer(
  state: ValuationPipelineState,
  action: ValuationPipelineReducerAction
): ValuationPipelineState {
  switch (action.type) {
    case 'NEXT_STEP':
      if (state.currentStepIndex < state.steps.length - 1) {
        const nextIndex = state.currentStepIndex + 1;
        const updatedSteps = state.steps.map((step, index) => ({
          ...step,
          isActive: index === nextIndex
        }));
        return {
          ...state,
          currentStepIndex: nextIndex,
          steps: updatedSteps
        };
      }
      return state;

    case 'PREVIOUS_STEP':
      if (state.currentStepIndex > 0) {
        const prevIndex = state.currentStepIndex - 1;
        const updatedSteps = state.steps.map((step, index) => ({
          ...step,
          isActive: index === prevIndex
        }));
        return {
          ...state,
          currentStepIndex: prevIndex,
          steps: updatedSteps
        };
      }
      return state;

    case 'GO_TO_STEP':
      if (action.payload >= 0 && action.payload < state.steps.length) {
        const updatedSteps = state.steps.map((step, index) => ({
          ...step,
          isActive: index === action.payload
        }));
        return {
          ...state,
          currentStepIndex: action.payload,
          steps: updatedSteps
        };
      }
      return state;

    case 'SET_STEP_COMPLETED':
      const updatedSteps = state.steps.map(step =>
        step.id === action.payload.stepId
          ? { ...step, isCompleted: action.payload.isCompleted }
          : step
      );
      return {
        ...state,
        steps: updatedSteps,
        isComplete: updatedSteps.every(step => step.isCompleted)
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
        }
      };

    case 'RESET_PIPELINE':
      return initialValuationPipelineState;

    case 'START_LOADING':
      return {
        ...state,
        isLoading: true
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
