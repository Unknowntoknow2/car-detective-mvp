
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ServiceRecord {
  id: number;
  vin: string;
  service_date: string;
  mileage: number | null;
  description: string;
  receipt_url: string;
  created_at: string;
}

export function useServiceHistory(vin: string) {
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServiceHistory = async () => {
      if (!vin) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('service_history')
          .select('*')
          .eq('vin', vin)
          .order('service_date', { ascending: false });

        if (error) throw error;

        setRecords(data as ServiceRecord[] || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load service history');
        console.error('Error fetching service history:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceHistory();
  }, [vin]);

  return { records, isLoading, error };
}
