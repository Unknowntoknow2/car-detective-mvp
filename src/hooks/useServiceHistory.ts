
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';

// Export the ServiceRecord type
export interface ServiceRecord {
  id: string;
  vin: string;
  service_date: string;
  mileage: number;
  description: string;
  receipt_url?: string;
  created_at: string;
}

export interface UseServiceHistoryProps {
  vin: string;
}

export function useServiceHistory({ vin }: UseServiceHistoryProps) {
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchRecords = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('service_records')
        .select('*')
        .eq('vin', vin)
        .order('service_date', { ascending: false });
      
      if (fetchError) {
        throw new Error(fetchError.message);
      }
      
      // Convert database record IDs from number to string if needed
      const formattedRecords = data.map((record: any) => ({
        ...record,
        id: String(record.id) // Ensure id is string type
      })) as ServiceRecord[];
      
      setRecords(formattedRecords);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error fetching records'));
      console.error('Error fetching service records:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const addServiceRecord = async (record: Omit<ServiceRecord, 'id' | 'created_at'>) => {
    try {
      const { data, error: insertError } = await supabase
        .from('service_records')
        .insert([record])
        .select()
        .single();
      
      if (insertError) {
        throw new Error(insertError.message);
      }
      
      return { success: true, data };
    } catch (err) {
      console.error('Error adding service record:', err);
      return { success: false, error: err instanceof Error ? err : new Error('Failed to add record') };
    }
  };
  
  const deleteServiceRecord = async (recordId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('service_records')
        .delete()
        .eq('id', recordId);
      
      if (deleteError) {
        throw new Error(deleteError.message);
      }
      
      return { success: true };
    } catch (err) {
      console.error('Error deleting service record:', err);
      return { success: false, error: err instanceof Error ? err : new Error('Failed to delete record') };
    }
  };
  
  // Function to manually refresh records
  const refreshRecords = async () => {
    await fetchRecords();
  };
  
  // Initial fetch on component mount
  useEffect(() => {
    if (vin) {
      fetchRecords();
    }
  }, [vin]);
  
  return {
    records,
    isLoading,
    error,
    addServiceRecord,
    deleteServiceRecord,
    refreshRecords
  };
}
