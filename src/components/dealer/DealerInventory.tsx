
import React, { useState } from 'react';
import AddVehicleModal from './modals/AddVehicleModal';
import { toast } from 'sonner';
import { useDealerInventory } from './hooks/useDealerInventory';
import { 
  EmptyState, 
  LoadingState, 
  NoSearchResults, 
  SearchAndFilterBar, 
  DeleteConfirmationDialog, 
  VehicleGrid,
  InventoryHeader
} from './inventory';

interface DealerInventoryProps {
  onRefresh?: () => void;
}

export const DealerInventory: React.FC<DealerInventoryProps> = ({ onRefresh }) => {
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const { 
    vehicles, 
    loading, 
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
    noSearchResults
  } = useDealerInventory();

  // Handle add vehicle
  const handleVehicleAdded = () => {
    setIsAddVehicleModalOpen(false);
    toast.success('Vehicle added successfully!');
    // Call the onRefresh callback if provided
    if (onRefresh) {
      onRefresh();
    }
  };

  // Handle delete vehicle confirmation
  const handleDeleteClick = (vehicle: any) => {
    setVehicleToDelete(vehicle);
    setDeleteDialogOpen(true);
  };

  // Handle actual deletion
  const handleConfirmDelete = async () => {
    await deleteVehicle(onRefresh);
    setDeleteDialogOpen(false);
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
      {isEmpty && (
        <EmptyState onAddVehicle={() => setIsAddVehicleModalOpen(true)} />
      )}
      
      {/* No Results State */}
      {noSearchResults && (
        <NoSearchResults 
          searchTerm={searchTerm} 
          onClearSearch={() => setSearchTerm('')} 
        />
      )}
      
      {/* Vehicle Grid */}
      {!loading && vehicles.length > 0 && (
        <VehicleGrid 
          vehicles={vehicles}
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

// Add default export to fix the error
export default DealerInventory;
