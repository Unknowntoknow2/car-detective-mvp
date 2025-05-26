
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { validateVIN } from '@/utils/validation/vin-validation';
import { fetchVehicleByVin } from '@/services/vehicleLookupService';
import { DecodedVehicleInfo } from '@/types/vehicle';

export interface VinLookupFlowState {
  vin: string;
  isLoading: boolean;
  error: string | null;
  vehicle: DecodedVehicleInfo | null;
  stage: 'input' | 'results' | 'followup' | 'complete';
  followupProgress: number;
}

export interface FollowupData {
  mileage?: number;
  condition?: string;
  accidents?: number;
  titleStatus?: string;
  location?: string;
  photos?: File[];
  [key: string]: any;
}

export function useVinLookupFlow() {
  const navigate = useNavigate();
  const [state, setState] = useState<VinLookupFlowState>({
    vin: '',
    isLoading: false,
    error: null,
    vehicle: null,
    stage: 'input',
    followupProgress: 0
  });

  const updateState = useCallback((updates: Partial<VinLookupFlowState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const setVin = useCallback((vin: string) => {
    updateState({ vin, error: null });
  }, [updateState]);

  const lookupVin = useCallback(async (vin: string) => {
    console.log('VIN Lookup Flow: Starting lookup for', vin);
    
    // Validate VIN
    const validation = validateVIN(vin);
    if (!validation.isValid) {
      updateState({ error: validation.error || 'Invalid VIN format' });
      toast.error('Invalid VIN format');
      return null;
    }

    updateState({ isLoading: true, error: null });

    try {
      const result = await fetchVehicleByVin(vin);
      
      console.log('VIN Lookup Flow: Success', result);
      
      // Store in localStorage for persistence
      localStorage.setItem('current_vin', vin);
      localStorage.setItem('latest_valuation_id', result.valuationId || '');
      
      updateState({
        isLoading: false,
        vehicle: result,
        stage: 'results'
      });

      // Navigate to VIN results page
      navigate(`/valuation/vin/${vin}`);
      
      toast.success('Vehicle found successfully');
      return result;
    } catch (error: any) {
      console.error('VIN Lookup Flow: Error', error);
      const errorMessage = error.message || 'Failed to lookup VIN';
      
      updateState({
        isLoading: false,
        error: errorMessage
      });
      
      toast.error(errorMessage);
      return null;
    }
  }, [updateState, navigate]);

  const startFollowup = useCallback(() => {
    updateState({ stage: 'followup', followupProgress: 0 });
  }, [updateState]);

  const updateFollowupProgress = useCallback((progress: number) => {
    updateState({ followupProgress: Math.min(100, Math.max(0, progress)) });
  }, [updateState]);

  const submitFollowup = useCallback(async (followupData: FollowupData) => {
    if (!state.vehicle) return null;

    updateState({ isLoading: true });

    try {
      // Enhanced valuation with followup data
      const enhancedResult = {
        ...state.vehicle,
        ...followupData,
        confidenceScore: calculateConfidenceScore(followupData),
        isComplete: true
      };

      updateState({
        isLoading: false,
        vehicle: enhancedResult,
        stage: 'complete',
        followupProgress: 100
      });

      toast.success('Valuation completed with enhanced accuracy');
      return enhancedResult;
    } catch (error: any) {
      updateState({
        isLoading: false,
        error: error.message || 'Failed to complete followup'
      });
      
      toast.error('Failed to complete followup');
      return null;
    }
  }, [state.vehicle, updateState]);

  const reset = useCallback(() => {
    setState({
      vin: '',
      isLoading: false,
      error: null,
      vehicle: null,
      stage: 'input',
      followupProgress: 0
    });
  }, []);

  return {
    state,
    setVin,
    lookupVin,
    startFollowup,
    updateFollowupProgress,
    submitFollowup,
    reset
  };
}

function calculateConfidenceScore(followupData: FollowupData): number {
  let score = 75; // Base score
  
  // Add points for each piece of data provided
  if (followupData.mileage) score += 5;
  if (followupData.condition) score += 8;
  if (followupData.accidents !== undefined) score += 4;
  if (followupData.titleStatus) score += 3;
  if (followupData.location) score += 2;
  if (followupData.photos && followupData.photos.length > 0) score += 3;
  
  return Math.min(100, score);
}
