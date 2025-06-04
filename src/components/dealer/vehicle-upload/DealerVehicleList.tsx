<<<<<<< HEAD

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DealerVehicle } from '@/types/dealerVehicle';

interface DealerVehicleListProps {
  vehicles: DealerVehicle[];
  onEdit?: (vehicle: DealerVehicle) => void;
  onDelete?: (id: string) => void;
}

export const DealerVehicleList: React.FC<DealerVehicleListProps> = ({
  vehicles,
  onEdit,
  onDelete
}) => {
  if (vehicles.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No vehicles in inventory</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {vehicles.map((vehicle) => (
        <Card key={vehicle.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>
                {vehicle.year} {vehicle.make} {vehicle.model}
              </span>
              <span className="text-lg font-bold">
                ${vehicle.price.toLocaleString()}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Mileage</p>
                <p className="font-medium">{vehicle.mileage?.toLocaleString() || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Condition</p>
                <p className="font-medium">{vehicle.condition || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fuel Type</p>
                <p className="font-medium">{vehicle.fuelType || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                  vehicle.status === 'available' ? 'bg-green-100 text-green-800' :
                  vehicle.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {vehicle.status}
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(vehicle)}
                >
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(vehicle.id)}
                >
                  Delete
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
=======
import React, { useEffect, useState } from "react";
import { ChevronDown, Grid, List, Plus, Search } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useVehicleUploadModal } from "../hooks/useVehicleUploadModal";
import { AnimatedCard } from "@/components/ui/animated-card";
import { DealerVehicle } from "@/types/dealerVehicle";
import { VehicleCard } from "../inventory/VehicleCard";
import { EmptyState } from "../inventory/EmptyState";
import { LoadingState } from "../inventory/LoadingState";
import { NoSearchResults } from "../inventory/NoSearchResults";

// Mock data for UI demonstration
const mockVehicles: DealerVehicle[] = [
  {
    id: "1",
    dealer_id: "dealer1",
    make: "Toyota",
    model: "Camry",
    year: 2020,
    mileage: 25000,
    price: 24900,
    status: "available",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    photos: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3",
    ],
    condition: "Excellent",
    fuel_type: "Gasoline",
    transmission: "Automatic",
    zip_code: "94103",
  },
  {
    id: "2",
    dealer_id: "dealer1",
    make: "Honda",
    model: "Accord",
    year: 2021,
    mileage: 12000,
    price: 27500,
    status: "available",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    photos: [
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3",
    ],
    condition: "Good",
    fuel_type: "Hybrid",
    transmission: "CVT",
    zip_code: "94103",
  },
  {
    id: "3",
    dealer_id: "dealer1",
    make: "Tesla",
    model: "Model 3",
    year: 2022,
    mileage: 5000,
    price: 45000,
    status: "pending",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    photos: [
      "https://images.unsplash.com/photo-1562618774-5375fe86c36e?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3",
    ],
    condition: "Excellent",
    fuel_type: "Electric",
    transmission: "Automatic",
    zip_code: "94103",
  },
  {
    id: "4",
    dealer_id: "dealer1",
    make: "Ford",
    model: "Mustang",
    year: 2019,
    mileage: 35000,
    price: 32000,
    status: "sold",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    photos: [
      "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3",
    ],
    condition: "Good",
    fuel_type: "Gasoline",
    transmission: "Manual",
    zip_code: "94103",
  },
  {
    id: "5",
    dealer_id: "dealer1",
    make: "BMW",
    model: "X5",
    year: 2021,
    mileage: 18000,
    price: 58900,
    status: "available",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    photos: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3",
    ],
    condition: "Excellent",
    fuel_type: "Gasoline",
    transmission: "Automatic",
    zip_code: "94103",
  },
  {
    id: "6",
    dealer_id: "dealer1",
    make: "Audi",
    model: "Q5",
    year: 2020,
    mileage: 22000,
    price: 42500,
    status: "available",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    photos: [
      "https://images.unsplash.com/photo-1518987048-93e29699e79a?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3",
    ],
    condition: "Good",
    fuel_type: "Gasoline",
    transmission: "Automatic",
    zip_code: "94103",
  },
];

type ViewType = "grid" | "list";
type SortOption =
  | "newest"
  | "oldest"
  | "price-high"
  | "price-low"
  | "mileage-low"
  | "mileage-high";

export const DealerVehicleList: React.FC = () => {
  // UI State management
  const [isLoading, setIsLoading] = useState(false);
  const [viewType, setViewType] = useState<ViewType>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const { openModal } = useVehicleUploadModal();

  // Simulate loading for skeleton effect
  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Function to handle opening the upload modal
  const handleOpenUploadModal = () => {
    openModal();
  };

  // Filter vehicles based on search
  const filteredVehicles = mockVehicles.filter((vehicle) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      vehicle.make.toLowerCase().includes(query) ||
      vehicle.model.toLowerCase().includes(query) ||
      vehicle.year.toString().includes(query) ||
      vehicle.condition?.toLowerCase().includes(query) ||
      vehicle.fuel_type?.toLowerCase().includes(query)
    );
  });

  // Sort vehicles based on selected option
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    switch (sortBy) {
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
      case "mileage-low":
        return (a.mileage || 0) - (b.mileage || 0);
      case "mileage-high":
        return (b.mileage || 0) - (a.mileage || 0);
      default:
        return 0;
    }
  });

  // Handler for deleting a vehicle
  const handleDeleteVehicle = (vehicle: DealerVehicle) => {
    // This would normally trigger a confirmation dialog and then delete
    console.log("Delete vehicle:", vehicle.id);
  };

  // Empty state - no vehicles
  if (!isLoading && mockVehicles.length === 0) {
    return (
      <EmptyState
        title="No vehicles in your inventory"
        description="Add your first vehicle to get started with your inventory management."
        actionLabel="Add First Vehicle"
        onAddClick={handleOpenUploadModal}
        icon={<Plus className="h-10 w-10 text-muted-foreground" />}
      />
    );
  }

  // No search results
  if (!isLoading && filteredVehicles.length === 0 && searchQuery) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">My Inventory</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search vehicles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-[250px]"
              />
            </div>
            <Button
              onClick={handleOpenUploadModal}
              className="gap-2 whitespace-nowrap"
            >
              <Plus className="h-4 w-4" /> Add Vehicle
            </Button>
          </div>
        </div>

        <NoSearchResults
          query={searchQuery}
          onClearFilters={() => setSearchQuery("")}
        />
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">My Inventory</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search vehicles..."
                disabled
                className="pl-9 w-[250px]"
              />
            </div>
            <Button disabled className="gap-2 whitespace-nowrap">
              <Plus className="h-4 w-4" /> Add Vehicle
            </Button>
          </div>
        </div>

        <LoadingState itemCount={6} />
      </div>
    );
  }

  // Main layout with vehicles
  return (
    <div className="space-y-6">
      {/* Header with search and actions */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <h2 className="text-2xl font-bold">
          My Inventory ({sortedVehicles.length})
        </h2>

        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search vehicles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full sm:w-[250px]"
              />
            </div>

            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as SortOption)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="mileage-low">
                  Mileage: Low to High
                </SelectItem>
                <SelectItem value="mileage-high">
                  Mileage: High to Low
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="hidden sm:flex border rounded p-0.5 bg-muted/20">
              <Button
                variant={viewType === "grid" ? "default" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewType("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewType === "list" ? "default" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewType("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            <Button
              onClick={handleOpenUploadModal}
              className="gap-2 whitespace-nowrap w-full sm:w-auto"
            >
              <Plus className="h-4 w-4" /> Add Vehicle
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Vehicle Grid */}
      {viewType === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedVehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <VehicleCard
                vehicle={vehicle}
                onDeleteClick={() => handleDeleteVehicle(vehicle)}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Vehicle List (mobile-friendly) */}
      {viewType === "list" && (
        <div className="space-y-4">
          {sortedVehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-40 h-40">
                    {vehicle.photos && vehicle.photos.length > 0
                      ? (
                        <img
                          src={vehicle.photos[0]}
                          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                          className="w-full h-full object-cover"
                        />
                      )
                      : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <span className="text-muted-foreground">
                            No Image
                          </span>
                        </div>
                      )}
                  </div>

                  <CardContent className="flex-1 p-4">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-semibold text-lg">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </h3>
                      <Badge
                        variant={vehicle.status === "available"
                          ? "default"
                          : vehicle.status === "pending"
                          ? "secondary"
                          : "outline"}
                      >
                        {vehicle.status.charAt(0).toUpperCase() +
                          vehicle.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-start mb-4">
                      <span className="text-2xl font-bold text-primary">
                        ${vehicle.price.toLocaleString()}
                      </span>
                      <div className="space-x-1">
                        <Badge variant="outline" className="bg-muted/50">
                          {vehicle.mileage?.toLocaleString() || "N/A"} mi
                        </Badge>
                        {vehicle.fuel_type && (
                          <Badge variant="outline" className="bg-muted/50">
                            {vehicle.fuel_type}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteVehicle(vehicle)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    </div>
  );
};

export default DealerVehicleList;
