
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { DealerVehicle } from '@/types/dealerVehicle';
import { formatCurrency } from '@/utils/formatters/formatCurrency';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import EditVehicleModal from './modals/EditVehicleModal';
import { DeleteConfirmationDialog } from './inventory/DeleteConfirmationDialog';

export const DealerInventoryTable = () => {
  const [vehicles, setVehicles] = useState<DealerVehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editVehicleId, setEditVehicleId] = useState<string | null>(null);
  const [deleteVehicleId, setDeleteVehicleId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDealerVehicles = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('dealer_vehicles')
          .select('*')
          .eq('dealer_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

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
        console.error('Error fetching dealer vehicles:', err);
        setError(err.message || 'Failed to load vehicles');
        toast.error('Could not load your inventory');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDealerVehicles();
  }, [user]);

  const handleEditVehicle = (vehicleId: string) => {
    setEditVehicleId(vehicleId);
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    setDeleteVehicleId(vehicleId);
  };

  const confirmDeleteVehicle = async () => {
    if (!deleteVehicleId || !user) return;
    
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('dealer_vehicles')
        .delete()
        .eq('id', deleteVehicleId)
        .eq('dealer_id', user.id);

      if (error) throw error;

      // Remove from local state
      setVehicles(vehicles.filter(vehicle => vehicle.id !== deleteVehicleId));
      toast.success('Vehicle deleted successfully');
    } catch (err: any) {
      console.error('Error deleting vehicle:', err);
      toast.error('Failed to delete vehicle');
    } finally {
      setIsDeleting(false);
      setDeleteVehicleId(null);
    }
  };

  const handleVehicleUpdated = () => {
    // Refetch the vehicles to get the updated data
    const fetchDealerVehicles = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('dealer_vehicles')
          .select('*')
          .eq('dealer_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const typedVehicles = (data || []).map(vehicle => {
          let photos: string[] = [];
          if (vehicle.photos) {
            if (Array.isArray(vehicle.photos)) {
              photos = vehicle.photos.map(item => String(item));
            } else if (typeof vehicle.photos === 'string') {
              try {
                const parsed = JSON.parse(vehicle.photos);
                photos = Array.isArray(parsed) ? parsed.map(item => String(item)) : [];
              } catch {
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
        console.error('Error fetching dealer vehicles:', err);
        toast.error('Could not refresh inventory data');
      }
    };

    fetchDealerVehicles();
  };

  // Render loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Mileage</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-10 w-10 rounded-md" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-6 text-center">
        <h3 className="text-lg font-medium text-red-800 mb-2">Failed to load inventory</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  // Render empty state
  if (vehicles.length === 0) {
    return (
      <div className="rounded-md border border-muted p-8 text-center">
        <Image className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">No vehicles in your inventory</h3>
        <p className="text-muted-foreground mb-4">
          Add your first vehicle to get started with your inventory.
        </p>
        <Button onClick={() => navigate('/dealer/inventory/add')}>
          Add Vehicle
        </Button>
      </div>
    );
  }

  // Render vehicle table
  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead className="hidden md:table-cell">Mileage</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell>
                  {vehicle.photos && vehicle.photos.length > 0 ? (
                    <img 
                      src={vehicle.photos[0]} 
                      alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                      className="h-10 w-10 object-cover rounded-md"
                    />
                  ) : (
                    <div className="h-10 w-10 bg-muted rounded-md flex items-center justify-center">
                      <Image className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</div>
                    <div className="md:hidden text-sm text-muted-foreground">
                      {vehicle.mileage ? `${vehicle.mileage.toLocaleString()} miles` : 'N/A'} • {vehicle.status}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {vehicle.mileage ? `${vehicle.mileage.toLocaleString()} miles` : 'N/A'}
                </TableCell>
                <TableCell>
                  {formatCurrency(vehicle.price)}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant={vehicle.status === 'available' ? 'default' : 'secondary'}>
                    {vehicle.status === 'available' ? 'Published' : 'Pending'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditVehicle(vehicle.id)}
                      title="Edit vehicle"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteVehicle(vehicle.id)}
                      title="Delete vehicle"
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

      {/* Edit Vehicle Modal */}
      {editVehicleId && (
        <EditVehicleModal
          open={!!editVehicleId}
          onOpenChange={(open) => !open && setEditVehicleId(null)}
          vehicleId={editVehicleId}
          onVehicleUpdated={handleVehicleUpdated}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog 
        open={!!deleteVehicleId}
        onOpenChange={(open) => !open && setDeleteVehicleId(null)}
        onConfirmDelete={confirmDeleteVehicle}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default DealerInventoryTable;
