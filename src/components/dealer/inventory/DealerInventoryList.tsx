
import React, { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useDealerInventory } from '../hooks/useDealerInventory';
import { useVehicleUploadModal } from '../hooks/useVehicleUploadModal';
import { VehicleGrid } from './VehicleGrid';
import { SearchAndFilterBar } from './SearchAndFilterBar';
import { EmptyState } from './EmptyState';
import { LoadingState } from './LoadingState';
import { NoSearchResults } from './NoSearchResults';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';
import { DealerVehicle } from '@/types/dealerVehicle';

export const DealerInventoryList: React.FC = () => {
  const { 
    vehicles, 
    isLoading, 
    error, 
    refetch,
    deleteVehicle 
  } = useDealerInventory();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('newest');
  const [vehicleToDelete, setVehicleToDelete] = useState<DealerVehicle | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { openModal } = useVehicleUploadModal();

  // Filter vehicles based on search term and status
  const filteredVehicles = vehicles.filter(vehicle => {
    // Search filter
    const matchesSearch = 
      searchTerm === '' ||
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.year.toString().includes(searchTerm);
    
    // Status filter
    const matchesStatus = 
      statusFilter === 'all' || 
      vehicle.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Sort vehicles based on selected option
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    switch (sortOption) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'price-high':
        return b.price - a.price;
      case 'price-low':
        return a.price - b.price;
      case 'year-new':
        return b.year - a.year;
      case 'year-old':
        return a.year - b.year;
      default:
        return 0;
    }
  });

  // Handle delete confirmation
  const handleDeleteClick = (vehicle: DealerVehicle) => {
    setVehicleToDelete(vehicle);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!vehicleToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteVehicle(vehicleToDelete.id);
      refetch();
    } finally {
      setIsDeleting(false);
      setVehicleToDelete(null);
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSortOption('newest');
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4">
        <h3 className="font-medium text-red-800">Error loading inventory</h3>
        <p className="mt-2 text-sm text-red-700">{error}</p>
        <Button onClick={refetch} variant="outline" className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Vehicle Inventory</h1>
          <Button onClick={openModal} className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Add Vehicle
          </Button>
        </div>
        <EmptyState onAddClick={openModal} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with title and add button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Vehicle Inventory</h1>
        <Button onClick={openModal} className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Add Vehicle
        </Button>
      </div>
      
      {/* Search and Filter Bar */}
      <SearchAndFilterBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortOption={sortOption}
        onSortOptionChange={setSortOption}
        totalVehicles={vehicles.length}
        filteredCount={filteredVehicles.length}
        onClearFilters={clearFilters}
      />
      
      {/* No Results Message */}
      {filteredVehicles.length === 0 ? (
        <NoSearchResults onClearFilters={clearFilters} />
      ) : (
        <VehicleGrid 
          vehicles={sortedVehicles} 
          onDeleteClick={handleDeleteClick}
        />
      )}
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog 
        open={vehicleToDelete !== null}
        onOpenChange={(open) => !open && setVehicleToDelete(null)}
        onConfirmDelete={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default DealerInventoryList;
