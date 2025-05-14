
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/utils/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { DealerVehicle } from '@/types/dealerVehicle';

export type SortOption = {
  label: string;
  value: string;
};

export const useDealerInventory = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<DealerVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [vehicleToDelete, setVehicleToDelete] = useState<DealerVehicle | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Define sort options
  const sortOptions: SortOption[] = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Mileage: Low to High', value: 'mileage-asc' },
    { label: 'Mileage: High to Low', value: 'mileage-desc' },
  ];

  // Fetch dealer vehicles
  const fetchVehicles = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Build query with sorting
      let query = supabase
        .from('dealer_vehicles')
        .select('*')
        .eq('dealer_id', user.id);

      // Apply search filter if provided
      if (searchTerm) {
        query = query.or(`make.ilike.%${searchTerm}%,model.ilike.%${searchTerm}%,year::text.ilike.%${searchTerm}%`);
      }

      // Apply sorting
      switch (sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'price-desc':
          query = query.order('price', { ascending: false });
          break;
        case 'price-asc':
          query = query.order('price', { ascending: true });
          break;
        case 'mileage-asc':
          query = query.order('mileage', { ascending: true, nullsLast: true });
          break;
        case 'mileage-desc':
          query = query.order('mileage', { ascending: false, nullsFirst: true });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;
      setVehicles(data as DealerVehicle[]);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError('Failed to fetch your inventory');
      toast({
        title: 'Error',
        description: 'Failed to load your inventory. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user, searchTerm, sortBy]);

  // Delete vehicle
  const deleteVehicle = async (onSuccess?: () => void) => {
    if (!vehicleToDelete) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('dealer_vehicles')
        .delete()
        .eq('id', vehicleToDelete.id)
        .eq('dealer_id', user?.id); // Safety check to ensure dealer only deletes their own vehicles

      if (error) throw error;

      // Remove from local state
      setVehicles((prev) => prev.filter((v) => v.id !== vehicleToDelete.id));
      toast({
        title: 'Vehicle Removed',
        description: 'Vehicle has been successfully removed from your inventory.',
      });

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error deleting vehicle:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete vehicle. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setVehicleToDelete(null);
    }
  };

  // Effect to fetch vehicles when component mounts or filters change
  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Calculate derived states
  const isEmpty = !loading && vehicles.length === 0 && !searchTerm;
  const noSearchResults = !loading && vehicles.length === 0 && !!searchTerm;

  return {
    vehicles,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortOptions,
    vehicleToDelete,
    setVehicleToDelete,
    isDeleting,
    deleteVehicle,
    isEmpty,
    noSearchResults,
    refetch: fetchVehicles,
  };
};
