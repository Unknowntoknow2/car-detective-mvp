
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

// Define fallback states
export type FallbackState = 'none' | 'vin_failed' | 'plate_failed' | 'manual';

interface ValuationFallbackHook {
  fallbackState: FallbackState;
  setFallbackForVin: () => void;
  setFallbackForPlate: () => void;
  resetFallback: () => void;
  shouldShowManualEntry: boolean;
}

export function useValuationFallback(): ValuationFallbackHook {
  const [fallbackState, setFallbackState] = useState<FallbackState>('none');
  
  // Set fallback when VIN lookup fails
  const setFallbackForVin = useCallback(() => {
    console.log('FALLBACK: VIN lookup failed, redirecting to manual entry');
    setFallbackState('vin_failed');
    toast.error("VIN lookup failed. Please try manual entry.");
  }, []);
  
  // Set fallback when plate lookup fails
  const setFallbackForPlate = useCallback(() => {
    console.log('FALLBACK: Plate lookup failed, redirecting to manual entry');
    setFallbackState('plate_failed');
    toast.error("License plate lookup failed. Please try manual entry.");
  }, []);
  
  // Reset fallback state
  const resetFallback = useCallback(() => {
    setFallbackState('none');
  }, []);
  
  // Whether to show manual entry based on current fallback state
  const shouldShowManualEntry = fallbackState !== 'none';
  
  return {
    fallbackState,
    setFallbackForVin,
    setFallbackForPlate,
    resetFallback,
    shouldShowManualEntry
  };
}
