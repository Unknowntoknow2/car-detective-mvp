import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { DealerVehicle } from '@/types/dealerVehicle';
import AddVehicleModal from './AddVehicleModal';
import { toast } from 'sonner';
import {
  Search,
  Plus,
  ChevronDown,
  Edit,
  Trash2,
  Loader2,
  Car,
  ArrowUpDown,
  X
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Type for sorting options
type SortOption = {
  label: string;
  value: string;
  sortFn: (a: DealerVehicle, b: DealerVehicle) => number;
};

export const DealerInventory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
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

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500">Available</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-600">Pending</Badge>;
      case 'sold':
        return <Badge variant="secondary">Sold</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="container max-w-7xl py-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold tracking-tight">My Inventory</h1>
        
        <Button 
          onClick={() => setIsAddVehicleModalOpen(true)} 
          className="shrink-0"
        >
          <Plus className="h-4 w-4 mr-2" /> Add New Vehicle
        </Button>
      </div>
      
      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by make, model, or year..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          {searchTerm && (
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600" 
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto sm:min-w-[180px] justify-between">
              Sort: {activeSortOption.label}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px]">
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => setSortBy(option.value)}
                className={option.value === sortBy ? "bg-accent text-accent-foreground" : ""}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full rounded-t-lg" />
              <CardContent className="p-4">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Empty State */}
      {!loading && vehicles.length === 0 && (
        <div className="text-center py-12 border rounded-lg bg-background mt-6">
          <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Vehicles Listed</h3>
          <p className="text-muted-foreground mb-6">You haven't added any vehicles to your inventory yet.</p>
          <Button onClick={() => setIsAddVehicleModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Your First Vehicle
          </Button>
        </div>
      )}
      
      {/* No Results State */}
      {!loading && vehicles.length > 0 && filteredVehicles.length === 0 && (
        <div className="text-center py-12 border rounded-lg bg-background mt-6">
          <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Matching Vehicles</h3>
          <p className="text-muted-foreground mb-6">
            No vehicles match your search for "{searchTerm}".
          </p>
          <Button variant="outline" onClick={() => setSearchTerm('')}>
            Clear Search
          </Button>
        </div>
      )}
      
      {/* Vehicle Grid */}
      {!loading && filteredVehicles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredVehicles.map((vehicle) => (
            <Card key={vehicle.id} className="overflow-hidden">
              {/* Vehicle Image */}
              <AspectRatio ratio={16 / 9}>
                {vehicle.photos && vehicle.photos.length > 0 ? (
                  <img 
                    src={vehicle.photos[0]} 
                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Car className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </AspectRatio>
              
              <CardContent className="p-4 pb-2">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                  {getStatusBadge(vehicle.status)}
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-primary">
                    ${vehicle.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {vehicle.mileage ? `${vehicle.mileage.toLocaleString()} miles` : 'Mileage N/A'}
                  </span>
                </div>
              </CardContent>
              
              <CardFooter className="p-4 pt-0 flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/dealer/edit/${vehicle.id}`)}
                >
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDeleteClick(vehicle)}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Remove
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Add Vehicle Modal */}
      <AddVehicleModal 
        open={isAddVehicleModalOpen} 
        onOpenChange={setIsAddVehicleModalOpen}
        onVehicleAdded={handleVehicleAdded}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this vehicle from your inventory. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleConfirmDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                <>Delete</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
