import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
        const { data: existingHistory, error: fetchError } = await supabase
          .from('vehicle_histories')
          .select('*')
          .eq('valuation_id', valuationId)
          .single();

        if (!fetchError && existingHistory && existingHistory.report_url) {
          setHistoryData({
            reportUrl: existingHistory.report_url,
            reportData: {
              owners: 2,
              accidentsReported: 1,
              damageTypes: ['Minor collision'],
              serviceRecords: 3,
              titleEvents: ['Clean title'],
              estimatedValueImpact: -500
            }
          });
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase.functions.invoke('fetch-vehicle-history', {
          body: { vin, valuationId }
        });

        if (error) throw error;
        
        if (data) {
          setHistoryData(data as VehicleHistoryData);
          
          if (!existingHistory) {
            await supabase.from('vehicle_histories').insert({
              valuation_id: valuationId,
              report_url: data.reportUrl,
              provider: 'CARFAX'
            });
          }
        }
      } catch (err) {
        console.error('Error fetching vehicle history:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch vehicle history');
        toast.error('Could not retrieve vehicle history data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [vin, valuationId]);

  return { historyData, isLoading, error };
};
