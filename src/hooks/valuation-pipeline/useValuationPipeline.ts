
import { useReducer, useCallback } from 'react';
import { initialValuationPipelineState, valuationPipelineReducer } from './service';
import { ValuationConditionData, ValuationPipelineState } from './types';

export function useValuationPipeline() {
  const [state, dispatch] = useReducer(valuationPipelineReducer, initialValuationPipelineState);

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

  return {
    state,
    actions: {
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
    }
  };
}
