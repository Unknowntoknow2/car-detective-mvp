
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { DealerVehicle } from '@/types/dealerVehicle';
import AddVehicleModal from './AddVehicleModal';
import { toast } from 'sonner';
import { 
  EmptyState, 
  LoadingState, 
  NoSearchResults, 
  SearchAndFilterBar, 
  DeleteConfirmationDialog, 
  VehicleGrid,
  InventoryHeader,
  SortOption
} from './inventory';

export const DealerInventory = () => {
  const { user } = useAuth();
  
  const [vehicles, setVehicles] = useState<DealerVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
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

  // Filter and sort vehicles
  const filteredVehicles = useMemo(() => {
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
  }, [vehicles, searchTerm, activeSortOption]);

  // Handle add vehicle
  const handleVehicleAdded = () => {
    setIsAddVehicleModalOpen(false);
    toast.success('Vehicle added successfully!');
  };

  // Handle delete vehicle confirmation
  const handleDeleteClick = (vehicle: DealerVehicle) => {
    setVehicleToDelete(vehicle);
    setDeleteDialogOpen(true);
  };

  // Handle actual deletion
  const handleConfirmDelete = async () => {
    if (!vehicleToDelete) return;
    
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('dealer_vehicles')
        .delete()
        .eq('id', vehicleToDelete.id)
        .eq('dealer_id', user?.id); // Safety check to ensure dealer owns this vehicle
      
      if (error) {
        throw error;
      }
      
      toast.success('Vehicle deleted successfully');
      
      // Remove from local state (though realtime will handle this too)
      setVehicles(prev => prev.filter(v => v.id !== vehicleToDelete.id));
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast.error('Failed to delete vehicle');
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setVehicleToDelete(null);
    }
  };

  return (
    <div className="container max-w-7xl py-6 space-y-6">
      {/* Header Section */}
      <InventoryHeader onAddVehicle={() => setIsAddVehicleModalOpen(true)} />
      
      {/* Search and Filter Section */}
      <SearchAndFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
        sortOptions={sortOptions}
      />
      
      {/* Loading State */}
      {loading && <LoadingState />}
      
      {/* Empty State */}
      {!loading && vehicles.length === 0 && (
        <EmptyState onAddVehicle={() => setIsAddVehicleModalOpen(true)} />
      )}
      
      {/* No Results State */}
      {!loading && vehicles.length > 0 && filteredVehicles.length === 0 && (
        <NoSearchResults 
          searchTerm={searchTerm} 
          onClearSearch={() => setSearchTerm('')} 
        />
      )}
      
      {/* Vehicle Grid */}
      {!loading && filteredVehicles.length > 0 && (
        <VehicleGrid 
          vehicles={filteredVehicles}
          onDeleteClick={handleDeleteClick}
        />
      )}
      
      {/* Add Vehicle Modal */}
      <AddVehicleModal 
        open={isAddVehicleModalOpen} 
        onOpenChange={setIsAddVehicleModalOpen}
        onVehicleAdded={handleVehicleAdded}
      />
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog 
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirmDelete={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};
