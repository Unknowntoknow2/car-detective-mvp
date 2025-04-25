
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
  };
}

export const useVehicleHistory = (vin: string, valuationId: string) => {
  const [historyData, setHistoryData] = useState<VehicleHistoryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!vin || !valuationId) return;
      
      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase.functions.invoke('fetch-vehicle-history', {
          body: { vin, valuationId }
        });

        if (error) throw error;
        setHistoryData(data);
      } catch (err) {
        console.error('Error fetching vehicle history:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch vehicle history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [vin, valuationId]);

  return { historyData, isLoading, error };
};
