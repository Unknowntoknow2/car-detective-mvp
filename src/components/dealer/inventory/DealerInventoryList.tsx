<<<<<<< HEAD

import React from 'react';
import { Button } from '@/components/ui/button';
import { DealerVehicle } from '@/types/dealerVehicle';

// Function to fix status check display
export const fixStatusCheck = (status?: string) => {
  if (!status) return 'Unknown';
  
  // Convert status to lowercase for case-insensitive comparison
  const lowerStatus = status.toLowerCase();
  
  // Check if the status is 'available' and return 'Active' instead
  if (lowerStatus === 'available') {
    return 'Active';
=======
import React, { useEffect, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDealerInventory } from "../hooks/useDealerInventory";
import { useVehicleUploadModal } from "../hooks/useVehicleUploadModal";
import { VehicleGrid } from "./VehicleGrid";
import { SearchAndFilterBar } from "./SearchAndFilterBar";
import { EmptyState } from "./EmptyState";
import { LoadingState } from "./LoadingState";
import { NoSearchResults } from "./NoSearchResults";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { DealerVehicle } from "@/types/dealerVehicle";

export const DealerInventoryList: React.FC = () => {
  const {
    vehicles,
    isLoading,
    error,
    refetch,
    deleteVehicle,
  } = useDealerInventory();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOption, setSortOption] = useState<string>("newest");
  const [vehicleToDelete, setVehicleToDelete] = useState<DealerVehicle | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const { openModal } = useVehicleUploadModal();

  // Filter vehicles based on search term and status
  const filteredVehicles = vehicles.filter((vehicle) => {
    // Search filter
    const matchesSearch = searchTerm === "" ||
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.year.toString().includes(searchTerm);

    // Status filter
    const matchesStatus = statusFilter === "all" ||
      vehicle.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort vehicles based on selected option
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime();
      case "oldest":
        return new Date(a.created_at).getTime() -
          new Date(b.created_at).getTime();
      case "price-high":
        return b.price - a.price;
      case "price-low":
        return a.price - b.price;
      case "year-new":
        return b.year - a.year;
      case "year-old":
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
    setSearchTerm("");
    setStatusFilter("all");
    setSortOption("newest");
  };

  if (isLoading) {
    return <LoadingState itemCount={6} />;
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
        <EmptyState
          onAddClick={openModal}
        />
      </div>
    );
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  }
  
  // For all other statuses, capitalize the first letter
  return status.charAt(0).toUpperCase() + status.slice(1);
};

// Dealer inventory list component
export const DealerInventoryList: React.FC<{ 
  inventory: DealerVehicle[];
  isLoading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ 
  inventory, 
  isLoading, 
  onEdit, 
  onDelete 
}) => {
  return (
<<<<<<< HEAD
    <div className="border rounded-lg overflow-hidden">
      {isLoading ? (
        <div className="p-6 text-center">Loading inventory...</div>
      ) : inventory.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-muted-foreground">No vehicles in inventory</p>
        </div>
      ) : (
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Vehicle</th>
              <th className="px-4 py-3 text-left font-medium">Year</th>
              <th className="px-4 py-3 text-left font-medium">Price</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((vehicle) => (
              <tr key={vehicle.id} className="border-t">
                <td className="px-4 py-3">
                  {vehicle.make} {vehicle.model}
                </td>
                <td className="px-4 py-3">{vehicle.year}</td>
                <td className="px-4 py-3">${vehicle.price.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    vehicle.status === 'available' ? 'bg-green-100 text-green-800' :
                    vehicle.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {fixStatusCheck(vehicle.status)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="outline" size="sm" className="mr-2" onClick={() => onEdit(vehicle.id)}>
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onDelete(vehicle.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
=======
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
      {filteredVehicles.length === 0
        ? (
          <NoSearchResults
            query={searchTerm}
            onClearFilters={clearFilters}
          />
        )
        : (
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
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    </div>
  );
};

export default DealerInventoryList;
