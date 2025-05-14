
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { DealerVehicle } from '@/types/dealerVehicle';

export const useDealerInventory = () => {
  const [vehicles, setVehicles] = useState<DealerVehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchInventory = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('dealer_vehicles')
        .select('*')
        .eq('dealer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVehicles(data || []);
    } catch (err: any) {
      console.error('Error fetching dealer inventory:', err);
      setError(err.message || 'Failed to load inventory');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteVehicle = async (vehicleId: string) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('dealer_vehicles')
        .delete()
        .eq('id', vehicleId)
        .eq('dealer_id', user.id);

      if (error) throw error;
      
      // Update local state
      setVehicles(vehicles.filter(vehicle => vehicle.id !== vehicleId));
      return { success: true };
    } catch (err: any) {
      console.error('Error deleting vehicle:', err);
      return { error: err.message || 'Failed to delete vehicle' };
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [user]);

  return {
    vehicles,
    isLoading,
    error,
    refetch: fetchInventory,
    deleteVehicle
  };
};

export default useDealerInventory;
