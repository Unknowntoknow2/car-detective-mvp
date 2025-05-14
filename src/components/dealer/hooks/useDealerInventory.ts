
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { DealerVehicle } from '@/types/dealerVehicle';
import { toast } from 'sonner';

export type SortOption = {
  label: string;
  value: string;
  sortFn: (a: DealerVehicle, b: DealerVehicle) => number;
};

export function useDealerInventory() {
  const { user } = useAuth();
  
  const [vehicles, setVehicles] = useState<DealerVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [vehicleToDelete, setVehicleToDelete] = useState<DealerVehicle | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Define sorting options
  const sortOptions: SortOption[] = [
    {
      label: 'Newest',
      value: 'newest',
      sortFn: (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    },
    {
      label: 'Oldest',
      value: 'oldest',
      sortFn: (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    },
    {
      label: 'Price: High to Low',
      value: 'price-desc',
      sortFn: (a, b) => b.price - a.price
    },
    {
      label: 'Price: Low to High',
      value: 'price-asc',
      sortFn: (a, b) => a.price - b.price
    }
  ];

  // Get the active sort function
  const activeSortOption = sortOptions.find(option => option.value === sortBy) || sortOptions[0];

  // Fetch dealer vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('dealer_vehicles')
          .select('*')
          .eq('dealer_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        setVehicles(data as DealerVehicle[]);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        toast.error('Failed to load your inventory');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();

    // Set up real-time subscription for vehicle updates
    const channel = supabase
      .channel('dealer_vehicles_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'dealer_vehicles',
        filter: `dealer_id=eq.${user?.id}`
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setVehicles(prev => [payload.new as DealerVehicle, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setVehicles(prev => 
            prev.map(vehicle => 
              vehicle.id === payload.new.id ? payload.new as DealerVehicle : vehicle
            )
          );
        } else if (payload.eventType === 'DELETE') {
          setVehicles(prev => 
            prev.filter(vehicle => vehicle.id !== payload.old.id)
          );
        }
      })
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  // Filter and sort vehicles based on search term and sort option
  const filteredVehicles = (() => {
    let result = [...vehicles];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(vehicle => 
        vehicle.make.toLowerCase().includes(term) || 
        vehicle.model.toLowerCase().includes(term) ||
        vehicle.year.toString().includes(term)
      );
    }
    
    // Apply sorting
    result.sort(activeSortOption.sortFn);
    
    return result;
  })();

  // Delete vehicle function
  const deleteVehicle = async (refreshCallback?: () => void) => {
    if (!vehicleToDelete || !user?.id) return;
    
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('dealer_vehicles')
        .delete()
        .eq('id', vehicleToDelete.id)
        .eq('dealer_id', user.id); // Safety check to ensure dealer owns this vehicle
      
      if (error) {
        throw error;
      }
      
      toast.success('Vehicle deleted successfully');
      
      // Remove from local state (though realtime will handle this too)
      setVehicles(prev => prev.filter(v => v.id !== vehicleToDelete.id));
      
      // Call the refresh callback if provided
      if (refreshCallback) {
        refreshCallback();
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast.error('Failed to delete vehicle');
    } finally {
      setIsDeleting(false);
      setVehicleToDelete(null);
    }
  };

  return {
    vehicles: filteredVehicles,
    loading,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortOptions,
    activeSortOption,
    vehicleToDelete,
    setVehicleToDelete,
    isDeleting,
    deleteVehicle,
    isEmpty: !loading && vehicles.length === 0,
    noSearchResults: !loading && vehicles.length > 0 && filteredVehicles.length === 0
  };
}
