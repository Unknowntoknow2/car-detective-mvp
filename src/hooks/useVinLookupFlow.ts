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
  stage: 'input' | 'results' | 'complete' | 'error';
  followupProgress: number;
  errorType?: 'invalid_vin' | 'api_error' | 'not_found' | 'network_error';
}

export interface FollowupData {
  mileage?: number;
  condition?: string;
  zipCode?: string;
  accidents?: number;
  titleStatus?: string;
  serviceHistory?: string;
  maintenanceStatus?: string;
  tireCondition?: string;
  photos?: string[];
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
    console.log('🔄 Updating state:', updates);
    setState(prev => {
      const newState = { ...prev, ...updates };
      console.log('📊 New state:', newState);
      return newState;
    });
  }, []);

  const setVin = useCallback((vin: string) => {
    console.log('📝 Setting VIN in hook:', vin);
    updateState({ vin, error: null, stage: 'input' });
  }, [updateState]);

  const lookupVin = useCallback(async (vin: string) => {
    console.log('🔍 VIN Lookup Flow starting for:', vin);
    
    // Validate VIN format
    const validation = validateVIN(vin);
    if (!validation.isValid) {
      const errorMsg = validation.error || 'Invalid VIN format';
      console.log('❌ VIN validation failed:', errorMsg);
      updateState({ 
        error: errorMsg, 
        stage: 'error',
        errorType: 'invalid_vin'
      });
      toast.error(errorMsg);
      return null;
    }

    updateState({ isLoading: true, error: null, stage: 'input' });

    try {
      console.log('🚀 Calling fetchVehicleByVin service...');
      const result = await fetchVehicleByVin(vin);
      
      if (!result) {
        throw new Error('No vehicle data found for this VIN');
      }

      console.log('✅ VIN Lookup Flow success:', result);
      
      // Generate a valid UUID for the valuation
      const valuationId = crypto.randomUUID();
      
      const enhancedResult = {
        ...result,
        valuationId
      };
      
      // Store data in localStorage
      localStorage.setItem('current_vin', vin);
      localStorage.setItem('latest_valuation_id', valuationId);
      
      // Auto-transition to results stage which shows both vehicle card and follow-up questions
      updateState({
        isLoading: false,
        vehicle: enhancedResult,
        stage: 'results', // This will now show both vehicle card and questions
        followupProgress: 0
      });

      toast.success(`Vehicle found: ${result.year} ${result.make} ${result.model}`);
      return enhancedResult;
    } catch (error: any) {
      console.error('❌ VIN Lookup Flow error:', error);
      
      let errorType: VinLookupFlowState['errorType'] = 'api_error';
      let errorMessage = error.message || 'VIN lookup failed';
      
      if (errorMessage.includes('not found') || errorMessage.includes('No vehicle data')) {
        errorType = 'not_found';
        errorMessage = 'This VIN was not found in our database. You can enter vehicle details manually.';
      } else if (errorMessage.includes('network') || errorMessage.includes('Service unavailable')) {
        errorType = 'network_error';
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      updateState({
        isLoading: false,
        error: errorMessage,
        stage: 'error',
        errorType
      });
      
      toast.error(errorMessage);
      return null;
    }
  }, [updateState]);

  const updateFollowupProgress = useCallback((progress: number) => {
    updateState({ followupProgress: Math.min(100, Math.max(0, progress)) });
  }, [updateState]);

  const submitFollowup = useCallback(async (followupData: FollowupData) => {
    if (!state.vehicle) {
      toast.error('No vehicle data available');
      return null;
    }

    updateState({ isLoading: true });

    try {
      // Enhanced vehicle data with user-provided followup
      const enhancedResult: DecodedVehicleInfo = {
        ...state.vehicle,
        mileage: followupData.mileage,
        condition: followupData.condition,
        photos: followupData.photos?.filter(photo => typeof photo === 'string') || [],
        confidenceScore: calculateConfidenceScore(followupData)
      };

      updateState({
        isLoading: false,
        vehicle: enhancedResult,
        stage: 'complete',
        followupProgress: 100
      });

      toast.success('Vehicle assessment completed successfully');
      return enhancedResult;
    } catch (error: any) {
      updateState({
        isLoading: false,
        error: error.message || 'Failed to complete followup',
        stage: 'error',
        errorType: 'api_error'
      });
      
      toast.error('Failed to complete vehicle assessment');
      return null;
    }
  }, [state.vehicle, updateState]);

  const retryLookup = useCallback(() => {
    if (state.vin) {
      lookupVin(state.vin);
    }
  }, [state.vin, lookupVin]);

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
    updateFollowupProgress,
    submitFollowup,
    retryLookup,
    reset
  };
}

function calculateConfidenceScore(followupData: FollowupData): number {
  let score = 60; // Base score for real data assessment
  
  // Add points for each verified piece of data
  if (followupData.mileage && followupData.mileage > 0) score += 10;
  if (followupData.condition) score += 15;
  if (followupData.accidents !== undefined) score += 8;
  if (followupData.titleStatus) score += 5;
  if (followupData.zipCode) score += 2;
  
  return Math.min(95, score); // Cap at 95% for real data
}
