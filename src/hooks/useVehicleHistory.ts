
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface VehicleHistoryData {
  reportUrl: string;
  reportData: {
    owners: number;
    accidentsReported: number;
    damageTypes?: string[];
    serviceRecords: number;
    titleEvents: string[];
    estimatedValueImpact: number;
    salvageTitle?: boolean;
    damageSeverity?: string;
  };
}

export function useVehicleHistory(vin: string, valuationId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState<VehicleHistoryData | null>(null);

  useEffect(() => {
    const fetchVehicleHistory = async () => {
      if (!vin || !valuationId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Call the Supabase Edge Function
        const { data, error: fnError } = await supabase.functions.invoke('fetch-vehicle-history', {
          body: { vin, valuationId }
        });
        
        if (fnError) throw new Error(fnError.message);
        if (!data || data.error) throw new Error(data?.error || 'Failed to retrieve vehicle history');
        
        setHistoryData({
          reportUrl: data.reportUrl,
          reportData: data.reportData
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to retrieve vehicle history';
        console.error('Vehicle history error:', errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVehicleHistory();
  }, [vin, valuationId]);
  
  return { historyData, isLoading, error };
}
