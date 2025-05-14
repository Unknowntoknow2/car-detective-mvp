
import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Vehicle, VehicleFormData, VehicleStatus } from '@/types/vehicle';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { usePremiumDealer } from '@/hooks/usePremiumDealer';
import { PremiumSubscriptionBanner } from '@/components/dealer/PremiumSubscriptionBanner';

// Loading state component
const LoadingState = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

// Empty state component
const EmptyState = ({ onAddClick }: { onAddClick: () => void }) => (
  <div className="text-center py-12 border rounded-lg border-dashed">
    <h3 className="text-lg font-medium mb-2">No vehicles in inventory</h3>
    <p className="text-muted-foreground mb-6">Start adding vehicles to your inventory</p>
    <Button onClick={onAddClick}>
      <Plus className="mr-2 h-4 w-4" />
      Add First Vehicle
    </Button>
  </div>
);

// Vehicle form for add/edit modal
const VehicleForm = ({
  initialData,
  onSubmit,
  isSubmitting,
}: {
  initialData: VehicleFormData;
  onSubmit: (data: VehicleFormData) => void;
  isSubmitting: boolean;
}) => {
  const [formData, setFormData] = useState<VehicleFormData>(initialData);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'year' || name === 'mileage' || name === 'price'
        ? value === '' ? null : Number(value)
        : value,
    });
  };

  const handleStatusChange = (value: string) => {
    setFormData({
      ...formData,
      status: value as VehicleStatus,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="make" className="text-sm font-medium">
            Make
          </label>
          <Input
            id="make"
            name="make"
            value={formData.make}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="model" className="text-sm font-medium">
            Model
          </label>
          <Input
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label htmlFor="year" className="text-sm font-medium">
            Year
          </label>
          <Input
            id="year"
            name="year"
            type="number"
            value={formData.year || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="mileage" className="text-sm font-medium">
            Mileage
          </label>
          <Input
            id="mileage"
            name="mileage"
            type="number"
            value={formData.mileage || ''}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-medium">
            Price ($)
          </label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            value={formData.price || ''}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="status" className="text-sm font-medium">
          Status
        </label>
        <Select name="status" value={formData.status} onValueChange={handleStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="sold">Sold</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Vehicle'}
        </Button>
      </DialogFooter>
    </form>
  );
};

// Status badge component
const StatusBadge = ({ status }: { status: VehicleStatus }) => {
  const variants = {
    available: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    sold: 'bg-blue-100 text-blue-800',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${variants[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Main component
export const DealerInventory = () => {
  const { user } = useAuth();
  const { isPremium, isLoading: isPremiumLoading } = usePremiumDealer();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const ITEMS_PER_PAGE = 10;

  const emptyFormData: VehicleFormData = {
    make: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: null,
    price: 0,
    status: 'available',
  };

  // Fetch vehicles with search and pagination
  const fetchVehicles = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      let query = supabase
        .from('vehicles')
        .select('*', { count: 'exact' })
        .eq('dealer_id', user.id)
        .order('created_at', { ascending: false });

      // Apply search filter if present
      if (searchTerm.trim() !== '') {
        query = query.or(
          `make.ilike.%${searchTerm}%,model.ilike.%${searchTerm}%,year::text.ilike.%${searchTerm}%`
        );
      }

      // Apply pagination
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      
      const { data, count, error } = await query
        .range(from, to);

      if (error) throw error;
      
      setVehicles(data || []);
      
      if (count !== null) {
        setTotalPages(Math.ceil(count / ITEMS_PER_PAGE));
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error('Failed to load inventory');
    } finally {
      setIsLoading(false);
    }
  };

  // Add new vehicle
  const addVehicle = async (data: VehicleFormData) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('vehicles').insert({
        ...data,
        dealer_id: user.id,
      });

      if (error) throw error;
      
      toast.success('Vehicle added successfully');
      setIsAddModalOpen(false);
      fetchVehicles();
    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast.error('Failed to add vehicle');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update vehicle
  const updateVehicle = async (data: VehicleFormData) => {
    if (!selectedVehicle) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('vehicles')
        .update(data)
        .eq('id', selectedVehicle.id);

      if (error) throw error;
      
      toast.success('Vehicle updated successfully');
      setIsEditModalOpen(false);
      fetchVehicles();
    } catch (error) {
      console.error('Error updating vehicle:', error);
      toast.error('Failed to update vehicle');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete vehicle
  const deleteVehicle = async () => {
    if (!selectedVehicle) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', selectedVehicle.id);

      if (error) throw error;
      
      toast.success('Vehicle deleted successfully');
      setIsDeleteDialogOpen(false);
      fetchVehicles();
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast.error('Failed to delete vehicle');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Handle edit button click
  const handleEditClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsEditModalOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDeleteDialogOpen(true);
  };

  // Load vehicles on component mount and when dependencies change
  useEffect(() => {
    if (user) {
      fetchVehicles();
    }
  }, [user, currentPage, searchTerm]);

  if (isPremiumLoading || isLoading) {
    return <LoadingState />;
  }

  if (!isPremium) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Dealer Inventory</h2>
        <PremiumSubscriptionBanner />
        
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-xl font-semibold mb-3">Premium Feature</h2>
          <p className="text-gray-600 mb-6">
            Inventory management is available exclusively for premium dealers.
            Upgrade your subscription to access this feature.
          </p>
          <Button variant="premium">Upgrade to Premium</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Dealer Inventory</h2>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      <div className="w-full max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by make, model, or year..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
      </div>

      {vehicles.length === 0 && !isLoading ? (
        <EmptyState onAddClick={() => setIsAddModalOpen(true)} />
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Make</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">{vehicle.make}</TableCell>
                    <TableCell>{vehicle.model}</TableCell>
                    <TableCell>{vehicle.year}</TableCell>
                    <TableCell>${vehicle.price.toLocaleString()}</TableCell>
                    <TableCell>
                      <StatusBadge status={vehicle.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditClick(vehicle)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteClick(vehicle)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}

      {/* Add Vehicle Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Vehicle</DialogTitle>
            <DialogDescription>
              Enter the details of the vehicle you want to add to your inventory.
            </DialogDescription>
          </DialogHeader>
          <VehicleForm
            initialData={emptyFormData}
            onSubmit={addVehicle}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Vehicle Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Vehicle</DialogTitle>
            <DialogDescription>
              Update the details of this vehicle in your inventory.
            </DialogDescription>
          </DialogHeader>
          {selectedVehicle && (
            <VehicleForm
              initialData={{
                make: selectedVehicle.make,
                model: selectedVehicle.model,
                year: selectedVehicle.year,
                mileage: selectedVehicle.mileage,
                price: selectedVehicle.price,
                status: selectedVehicle.status,
              }}
              onSubmit={updateVehicle}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this vehicle from your inventory.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteVehicle}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
