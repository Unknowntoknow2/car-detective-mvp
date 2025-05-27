
import { useReducer } from 'react';
import { ValuationPipelineState, PipelineActions } from './types';

const initialState: ValuationPipelineState = {
  steps: [
    { id: 'vehicle-identification', title: 'Vehicle Identification', isCompleted: false },
    { id: 'vehicle-condition', title: 'Vehicle Condition', isCompleted: false },
    { id: 'result', title: 'Valuation Result', isCompleted: false }
  ],
  currentStepIndex: 0,
  data: {},
  isLoading: false
};

type Action = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_VEHICLE_DATA'; payload: any }
  | { type: 'SET_CONDITION_DATA'; payload: any }
  | { type: 'SET_RESULT_DATA'; payload: any }
  | { type: 'NEXT_STEP' }
  | { type: 'GO_TO_STEP'; payload: number }
  | { type: 'SET_STEP_COMPLETED'; payload: { stepId: string; isCompleted: boolean } };

function reducer(state: ValuationPipelineState, action: Action): ValuationPipelineState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_VEHICLE_DATA':
      return { ...state, data: { ...state.data, vehicle: action.payload } };
    case 'SET_CONDITION_DATA':
      return { ...state, data: { ...state.data, condition: action.payload } };
    case 'SET_RESULT_DATA':
      return { ...state, data: { ...state.data, result: action.payload } };
    case 'NEXT_STEP':
      return { ...state, currentStepIndex: Math.min(state.currentStepIndex + 1, state.steps.length - 1) };
    case 'GO_TO_STEP':
      return { ...state, currentStepIndex: action.payload };
    case 'SET_STEP_COMPLETED':
      return {
        ...state,
        steps: state.steps.map(step =>
          step.id === action.payload.stepId
            ? { ...step, isCompleted: action.payload.isCompleted }
            : step
        )
      };
    default:
      return state;
  }
}

export function useValuationPipeline() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions: PipelineActions = {
    nextStep: () => dispatch({ type: 'NEXT_STEP' }),
    previousStep: () => dispatch({ type: 'GO_TO_STEP', payload: Math.max(0, state.currentStepIndex - 1) }),
    goToStep: (stepIndex: number) => dispatch({ type: 'GO_TO_STEP', payload: stepIndex }),
    setStepCompleted: (stepId: string, isCompleted: boolean) => 
      dispatch({ type: 'SET_STEP_COMPLETED', payload: { stepId, isCompleted } }),
    setVehicleData: (data: any) => dispatch({ type: 'SET_VEHICLE_DATA', payload: data }),
    setConditionData: (data: any) => dispatch({ type: 'SET_CONDITION_DATA', payload: data }),
    setFeaturesData: (data: string[]) => dispatch({ type: 'SET_VEHICLE_DATA', payload: { features: data } }),
    setLocationData: (data: any) => dispatch({ type: 'SET_VEHICLE_DATA', payload: { location: data } }),
    setPhotosData: (data: File[]) => dispatch({ type: 'SET_VEHICLE_DATA', payload: { photos: data } }),
    setResultData: (data: any) => dispatch({ type: 'SET_RESULT_DATA', payload: data }),
    resetPipeline: () => dispatch({ type: 'GO_TO_STEP', payload: 0 }),
    startLoading: () => dispatch({ type: 'SET_LOADING', payload: true }),
    stopLoading: () => dispatch({ type: 'SET_LOADING', payload: false }),
    setError: (error: string) => dispatch({ type: 'SET_ERROR', payload: error })
  };

  return { state, actions };
}
