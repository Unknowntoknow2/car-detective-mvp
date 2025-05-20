
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Vehicle {
  id: string;
  dealer_id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  condition: string;
  status: string;
  photos?: string[];
  created_at: string;
  updated_at: string;
  transmission?: string;
  fuel_type?: string;
  zip_code?: string;
  description?: string;
}

export const useDealerInventory = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: userResponse, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data, error: fetchError } = await supabase
        .from('dealer_inventory')
        .select('*')
        .eq('dealer_id', userResponse.user?.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setVehicles(data || []);
    } catch (err: any) {
      console.error('Error fetching dealer inventory:', err);
      setError(err.message || 'Failed to fetch inventory');
      toast.error('Failed to load inventory');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteVehicle = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('dealer_inventory')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
      toast.success('Vehicle removed from inventory');
    } catch (err: any) {
      console.error('Error deleting vehicle:', err);
      toast.error('Failed to delete vehicle');
      throw err;
    }
  }, []);

  const uploadPhoto = useCallback(async (photo: File): Promise<string> => {
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
      toast.error('Failed to upload photo');
      throw err;
    }
  }, []);

  return {
    vehicles,
    isLoading,
    error,
    fetchInventory,
    deleteVehicle,
    uploadPhoto
  };
};
