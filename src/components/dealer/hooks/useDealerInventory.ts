
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
      
      // Transform the data to ensure it matches the DealerVehicle type
      const typedVehicles = (data || []).map(vehicle => {
        // Handle photos - ensure it's always a string array
        let photos: string[] = [];
        if (vehicle.photos) {
          // Check if photos is an array and convert all elements to strings
          if (Array.isArray(vehicle.photos)) {
            photos = vehicle.photos.map(item => String(item));
          } else if (typeof vehicle.photos === 'string') {
            // If it's a string (could be JSON string), try to parse it
            try {
              const parsed = JSON.parse(vehicle.photos);
              photos = Array.isArray(parsed) ? parsed.map(item => String(item)) : [];
            } catch {
              // If parsing fails, use as is if it's a string
              photos = [vehicle.photos];
            }
          }
        }

        return {
          ...vehicle,
          status: vehicle.status as DealerVehicle['status'],
          mileage: vehicle.mileage === null ? null : Number(vehicle.mileage),
          photos
        } as DealerVehicle;
      });
      
      setVehicles(typedVehicles);
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
