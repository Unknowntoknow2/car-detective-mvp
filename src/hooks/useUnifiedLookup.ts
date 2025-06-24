
import { useState, useCallback } from 'react';
import { UnifiedLookupService, UnifiedVehicleLookupResult, LookupOptions } from '@/services/UnifiedLookupService';
import { toast } from 'sonner';

interface UseUnifiedLookupProps {
  tier?: 'free' | 'premium';
  mode?: 'mock' | 'vpic' | 'carfax';
}

export const useUnifiedLookup = (props: UseUnifiedLookupProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<UnifiedVehicleLookupResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { tier = 'free', mode = 'vpic' } = props; // Changed default from 'mock' to 'vpic'

  const lookupByVin = useCallback(async (vin: string): Promise<UnifiedVehicleLookupResult | null> => {
    setIsLoading(true);
    setError(null);
    
    const options: LookupOptions = {
      tier,
      mode,
      includeHistory: tier === 'premium',
      includeMarketData: tier === 'premium'
    };

    try {
      console.log('🔍 Starting VIN lookup for:', vin);
      const lookupResult = await UnifiedLookupService.lookupByVin(vin, options);
      setResult(lookupResult);
      
      if (lookupResult.success) {
        const sourceName = lookupResult.source === 'vpic' ? 'NHTSA' : lookupResult.source.toUpperCase();
        toast.success(`Vehicle found via ${sourceName}`);
        console.log('✅ VIN lookup successful:', lookupResult.vehicle);
      } else {
        setError(lookupResult.error || 'VIN lookup failed');
        toast.error(lookupResult.error || 'VIN lookup failed');
      }
      
      return lookupResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'VIN lookup failed';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [tier, mode]);

  const lookupByPlate = useCallback(async (plate: string, state: string): Promise<UnifiedVehicleLookupResult | null> => {
    setIsLoading(true);
    setError(null);
    
    const options: LookupOptions = {
      tier,
      mode,
      includeHistory: tier === 'premium',
      includeMarketData: tier === 'premium'
    };

    try {
      const lookupResult = await UnifiedLookupService.lookupByPlate(plate, state, options);
      setResult(lookupResult);
      
      if (lookupResult.success) {
        toast.success('Vehicle found via license plate');
      } else {
        setError(lookupResult.error || 'Plate lookup failed');
        toast.error(lookupResult.error || 'Plate lookup failed');
      }
      
      return lookupResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Plate lookup failed';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [tier, mode]);

  const processManualEntry = useCallback((data: any): UnifiedVehicleLookupResult | null => {
    setError(null);
    
    const options: LookupOptions = {
      tier,
      mode,
      includeHistory: false,
      includeMarketData: tier === 'premium'
    };

    try {
      const lookupResult = UnifiedLookupService.processManualEntry(data, options);
      setResult(lookupResult);
      
      if (lookupResult.success) {
        toast.success('Manual entry processed successfully');
      } else {
        setError(lookupResult.error || 'Manual entry processing failed');
        toast.error(lookupResult.error || 'Manual entry processing failed');
      }
      
      return lookupResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Manual entry processing failed';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    }
  }, [tier, mode]);

  const clearData = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    isLoading,
    result,
    error,
    lookupByVin,
    lookupByPlate,
    processManualEntry,
    clearData
  };
};
