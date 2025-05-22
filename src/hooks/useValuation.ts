
import { useState } from 'react';
import { ValuationResponse, VinDecoderResponse, PlateLookupResponse } from '@/types/vehicle';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';
import { toast } from 'sonner';

export function useValuation() {
  const [isLoading, setIsLoading] = useState(false);
  const [valuationData, setValuationData] = useState<ValuationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resetValuation = () => {
    setValuationData(null);
    setError(null);
  };

  const decodeVin = async (vin: string): Promise<VinDecoderResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock API call for now
      const response = await fetch('/api/decode-vin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vin })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to decode VIN');
      }
      
      setValuationData(data.valuation || null);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to decode VIN';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };
  
  const decodePlate = async (plate: string, state: string): Promise<PlateLookupResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock API call for now
      const response = await fetch('/api/decode-plate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plate, state })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to decode license plate');
      }
      
      setValuationData(data.valuation || null);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to decode license plate';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };
  
  const manualValuation = async (formData: ManualEntryFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock API call for now
      const response = await fetch('/api/manual-valuation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to get valuation');
      }
      
      setValuationData(data.data || null);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get valuation';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    isLoading, 
    valuationData, 
    error, 
    decodeVin, 
    decodePlate, 
    manualValuation, 
    resetValuation 
  };
}
