
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DealerVehicle, DeleteVehicleResult } from '@/types/dealerVehicle';

export const useDealerInventory = () => {
  const [vehicles, setVehicles] = useState<DealerVehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data: userResponse, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      
      const { data, error: fetchError } = await supabase
        .from('dealer_inventory')
        .select('*')
        .eq('dealer_id', userResponse.user?.id);
        
      if (fetchError) throw fetchError;
      
      setVehicles(data as DealerVehicle[]);
    } catch (err: any) {
      console.error('Error fetching inventory:', err);
      setError(err.message || 'Failed to fetch inventory');
      toast.error('Failed to load inventory');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const deleteVehicle = useCallback(async (id: string): Promise<DeleteVehicleResult> => {
    try {
      const { error: deleteError } = await supabase
        .from('dealer_inventory')
        .delete()
        .eq('id', id);
        
      if (deleteError) throw deleteError;
      
      setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
      return { success: true };
    } catch (err: any) {
      console.error('Error deleting vehicle:', err);
      return { success: false, error: err.message || 'Failed to delete vehicle' };
    }
  }, []);

  const uploadPhoto = useCallback(async (photo: File) => {
    try {
      const fileName = `${Date.now()}-${photo.name}`;
      const { data, error } = await supabase.storage
        .from('vehicle-photos')
        .upload(fileName, photo);

      if (error) throw error;
      
      const { data: urlData } = supabase.storage
        .from('vehicle-photos')
        .getPublicUrl(data.path);
        
      return urlData.publicUrl;
    } catch (err: any) {
      console.error('Error uploading photo:', err);
      throw err;
    }
  }, []);

  // Adding refetch method
  const refetch = fetchInventory;
  
  return { vehicles, isLoading, error, fetchInventory, deleteVehicle, uploadPhoto, refetch };
};
