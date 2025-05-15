
import { useState, useEffect } from 'react';
import { ServiceRecord } from '@/types/serviceRecord';
import { supabase } from '@/lib/supabase';

interface UseServiceHistoryProps {
  vin: string;
}

export function useServiceHistory({ vin }: UseServiceHistoryProps) {
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchServiceHistory = async () => {
    if (!vin) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('service_records')
        .select('*')
        .eq('vin', vin)
        .order('service_date', { ascending: false });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data) {
        // Convert the numeric id to string to match ServiceRecord type
        const formattedRecords: ServiceRecord[] = data.map(record => ({
          ...record,
          id: String(record.id) // Convert number to string
        }));
        setRecords(formattedRecords);
      }
    } catch (err) {
      console.error('Error fetching service history:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch service history'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceHistory();
  }, [vin]);

  const addServiceRecord = async (record: Omit<ServiceRecord, 'id' | 'created_at'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('service_records')
        .insert([{ ...record, vin }])
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data) {
        // Convert the numeric id to string
        const newRecord: ServiceRecord = {
          ...data,
          id: String(data.id)
        };
        setRecords(prev => [newRecord, ...prev]);
      }
      
      return true;
    } catch (err) {
      console.error('Error adding service record:', err);
      setError(err instanceof Error ? err : new Error('Failed to add service record'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteServiceRecord = async (recordId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Convert string ID back to number for database operation
      const numericId = Number(recordId);
      
      const { error } = await supabase
        .from('service_records')
        .delete()
        .eq('id', numericId);
      
      if (error) {
        throw new Error(error.message);
      }
      
      setRecords(prev => prev.filter(record => record.id !== recordId));
      return true;
    } catch (err) {
      console.error('Error deleting service record:', err);
      setError(err instanceof Error ? err : new Error('Failed to delete service record'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    records,
    isLoading,
    error,
    addServiceRecord,
    deleteServiceRecord,
    refreshRecords: fetchServiceHistory
  };
}
