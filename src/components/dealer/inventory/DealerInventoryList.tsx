
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useDealerInventory } from '../hooks/useDealerInventory';
import { DealerVehicle } from '@/types/dealerVehicle';
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DealerInventoryListProps {
  onRefresh?: () => void;
}

export const DealerInventoryList: React.FC<DealerInventoryListProps> = ({ onRefresh }) => {
  // Get dealer inventory data and functions from the hook
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

  // State for managing the current sort direction
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Handle sort column click
  const handleSortColumn = (column: 'price' | 'mileage' | 'created_at') => {
    let newSortBy = '';
    
    switch (column) {
      case 'price':
        newSortBy = sortDirection === 'desc' ? 'price-asc' : 'price-desc';
        break;
      case 'mileage':
        newSortBy = sortDirection === 'desc' ? 'mileage-asc' : 'mileage-desc';
        break;
      case 'created_at':
        newSortBy = sortDirection === 'desc' ? 'oldest' : 'newest';
        break;
    }
    
    setSortBy(newSortBy);
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };
  
  // Handle delete vehicle confirmation
  const handleDeleteClick = (vehicle: DealerVehicle) => {
    setVehicleToDelete(vehicle);
  };

  // Handle actual deletion
  const handleConfirmDelete = async () => {
    await deleteVehicle(onRefresh);
  };
  
  // Get sort icon for column
  const getSortIcon = (column: 'price' | 'mileage' | 'created_at') => {
    let isActive = false;
    
    switch (column) {
      case 'price':
        isActive = sortBy === 'price-asc' || sortBy === 'price-desc';
        break;
      case 'mileage':
        isActive = sortBy === 'mileage-asc' || sortBy === 'mileage-desc';
        break;
      case 'created_at':
        isActive = sortBy === 'newest' || sortBy === 'oldest';
        break;
    }
    
    if (!isActive) return null;
    
    // Check if the current sort is ascending or descending
    const isAscending = sortBy === 'price-asc' || sortBy === 'mileage-asc' || sortBy === 'oldest';
    
    return isAscending ? 
      <ChevronUp className="ml-1 h-4 w-4 inline" /> : 
      <ChevronDown className="ml-1 h-4 w-4 inline" />;
  };
  
  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      // The debounced search is handled by the input onChange directly
    }, 300);
    
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="border rounded-md">
          <div className="h-12 px-4 border-b flex items-center">
            <Skeleton className="h-4 w-full" />
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 px-4 border-b flex items-center">
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (isEmpty) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/30">
        <h3 className="text-lg font-medium mb-2">No vehicles in your inventory</h3>
        <p className="text-muted-foreground mb-6">
          Add vehicles to your inventory to see them listed here.
        </p>
      </div>
    );
  }

  // No search results
  if (noSearchResults) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Inventory</h2>
          <div className="flex gap-2">
            <Input 
              placeholder="Search make, model, or year..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Button variant="ghost" onClick={() => setSearchTerm('')}>Clear</Button>
          </div>
        </div>
        <div className="text-center py-12 border rounded-lg bg-muted/30">
          <h3 className="text-lg font-medium mb-2">No results found</h3>
          <p className="text-muted-foreground mb-6">
            No vehicles match your search criteria.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Your Inventory ({vehicles.length})</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input 
            placeholder="Search make, model, or year..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="sm:w-64"
          />
          <div className="hidden sm:flex">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Mobile view as cards */}
      <div className="grid grid-cols-1 gap-4 sm:hidden">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="border rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
              <div className="text-primary font-medium">${vehicle.price.toLocaleString()}</div>
            </div>
            <div className="text-sm text-muted-foreground">
              {vehicle.mileage ? `${vehicle.mileage.toLocaleString()} miles` : 'Mileage not available'}
            </div>
            <div className="text-xs text-muted-foreground">
              Added {format(new Date(vehicle.created_at), 'MMM d, yyyy')}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm">Edit</Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => handleDeleteClick(vehicle)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop view as table */}
      <div className="hidden sm:block overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Vehicle</TableHead>
              <TableHead 
                className="w-[15%] cursor-pointer" 
                onClick={() => handleSortColumn('price')}
              >
                Price {getSortIcon('price')}
              </TableHead>
              <TableHead 
                className="w-[15%] cursor-pointer" 
                onClick={() => handleSortColumn('mileage')}
              >
                Mileage {getSortIcon('mileage')}
              </TableHead>
              <TableHead 
                className="w-[15%] cursor-pointer" 
                onClick={() => handleSortColumn('created_at')}
              >
                Date Added {getSortIcon('created_at')}
              </TableHead>
              <TableHead className="w-[15%] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="font-medium">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </TableCell>
                <TableCell>${vehicle.price.toLocaleString()}</TableCell>
                <TableCell>
                  {vehicle.mileage 
                    ? `${vehicle.mileage.toLocaleString()} mi` 
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  {format(new Date(vehicle.created_at), 'MMM d, yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteClick(vehicle)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete confirmation dialog */}
      <DeleteConfirmationDialog
        open={vehicleToDelete !== null}
        onOpenChange={(open) => !open && setVehicleToDelete(null)}
        onConfirmDelete={handleConfirmDelete}
        isDeleting={isDeleting}
        entityName="vehicle from your inventory"
      />
    </div>
  );
};

export default DealerInventoryList;
