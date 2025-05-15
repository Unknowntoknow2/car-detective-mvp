
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ServiceRecord {
  id: string;
  vin: string;
  service_date: string;
  mileage?: number | null;
  description: string;
  receipt_url?: string | null;
  created_at: string;
}

export function useServiceHistory(vin: string) {
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = async () => {
    if (!vin) {
      setError('No VIN provided');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('service_history')
        .select('*')
        .eq('vin', vin)
        .order('service_date', { ascending: false });

      if (fetchError) throw new Error(fetchError.message);

      setRecords(data || []);
    } catch (err: any) {
      console.error('Error fetching service history:', err);
      setError(err.message || 'An error occurred while fetching service history');
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = () => {
    fetchRecords();
  };

  useEffect(() => {
    if (vin) {
      fetchRecords();
    }
  }, [vin]);

  return { records, isLoading, error, refetch };
}
