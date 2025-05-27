
import React, { useState } from 'react';
import { DealerVehicle } from '@/types/dealerVehicle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Car } from 'lucide-react';

interface DealerVehicleListProps {
  vehicles?: DealerVehicle[];
  isLoading?: boolean;
  onEdit?: (vehicle: DealerVehicle) => void;
  onDelete?: (vehicleId: string) => void;
}

export const DealerVehicleList: React.FC<DealerVehicleListProps> = ({
  vehicles = [],
  isLoading = false,
  onEdit,
  onDelete
}) => {
  const [sortBy, setSortBy] = useState<'createdAt' | 'price' | 'year'>('createdAt');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Sample data if no vehicles provided
  const sampleVehicles: DealerVehicle[] = vehicles.length > 0 ? vehicles : [
    {
      id: '1',
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      price: 25000,
      mileage: 35000,
      vin: '1HGCM82633A123456',
      status: 'available',
      condition: 'Good',
      transmission: 'Automatic',
      fuelType: 'Gasoline',
      bodyType: 'Sedan',
      color: 'Silver',
      photos: ['https://images.unsplash.com/photo-1621007690695-33ce1e8ddfb3?w=500'],
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      make: 'Honda',
      model: 'Accord',
      year: 2019,
      price: 23000,
      mileage: 42000,
      vin: '1HGCV1F3XLA123456',
      status: 'pending',
      condition: 'Excellent',
      transmission: 'CVT',
      fuelType: 'Gasoline',
      bodyType: 'Sedan',
      color: 'Blue',
      photos: ['https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500'],
      createdAt: '2024-01-14T14:20:00Z'
    },
    {
      id: '3',
      make: 'Ford',
      model: 'Mustang',
      year: 2021,
      price: 35000,
      mileage: 15000,
      vin: '1FA6P8TH4L5123456',
      status: 'sold',
      condition: 'Excellent',
      transmission: 'Manual',
      fuelType: 'Gasoline',
      bodyType: 'Coupe',
      color: 'Red',
      photos: ['https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=500'],
      createdAt: '2024-01-13T09:15:00Z'
    },
    {
      id: '4',
      make: 'BMW',
      model: 'X5',
      year: 2022,
      price: 55000,
      mileage: 8000,
      vin: '5UXCR6C03N0123456',
      status: 'available',
      condition: 'Excellent',
      transmission: 'Automatic',
      fuelType: 'Gasoline',
      bodyType: 'SUV',
      color: 'Black',
      photos: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500'],
      createdAt: '2024-01-12T16:45:00Z'
    },
    {
      id: '5',
      make: 'Tesla',
      model: 'Model 3',
      year: 2023,
      price: 45000,
      mileage: 5000,
      vin: '5YJ3E1EA1PF123456',
      status: 'available',
      condition: 'Excellent',
      transmission: 'Automatic',
      fuelType: 'Electric',
      bodyType: 'Sedan',
      color: 'White',
      photos: ['https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=500'],
      createdAt: '2024-01-11T11:30:00Z'
    },
    {
      id: '6',
      make: 'Chevrolet',
      model: 'Silverado',
      year: 2020,
      price: 40000,
      mileage: 25000,
      vin: '1GCUYGEL3LZ123456',
      status: 'pending',
      condition: 'Good',
      transmission: 'Automatic',
      fuelType: 'Gasoline',
      bodyType: 'Truck',
      color: 'Gray',
      photos: ['https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=500'],
      createdAt: '2024-01-10T13:20:00Z'
    }
  ];

  const filteredVehicles = sampleVehicles
    .filter(vehicle => filterStatus === 'all' || vehicle.status === filterStatus)
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return b.price - a.price;
        case 'year':
          return b.year - a.year;
        case 'createdAt':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'sold':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1 border rounded-md text-sm"
          >
            <option value="createdAt">Date Added</option>
            <option value="price">Price</option>
            <option value="year">Year</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Filter:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1 border rounded-md text-sm"
          >
            <option value="all">All Vehicles</option>
            <option value="available">Available</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
          </select>
        </div>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <Card key={vehicle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              {vehicle.photos && vehicle.photos.length > 0 ? (
                <img
                  src={vehicle.photos[0]}
                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <Car className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <Badge className={`absolute top-2 right-2 ${getStatusColor(vehicle.status)}`}>
                {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
              </Badge>
            </div>
            
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </CardTitle>
              <div className="text-2xl font-bold text-green-600">
                ${vehicle.price.toLocaleString()}
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Mileage:</span>
                  <span>{vehicle.mileage?.toLocaleString() || 'N/A'} miles</span>
                </div>
                <div className="flex justify-between">
                  <span>Condition:</span>
                  <span>{vehicle.condition || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fuel Type:</span>
                  <span>{vehicle.fuelType || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transmission:</span>
                  <span>{vehicle.transmission || 'N/A'}</span>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit?.(vehicle)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete?.(vehicle.id)}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <div className="text-center py-12">
          <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No vehicles found</h3>
          <p className="text-gray-500">
            {filterStatus === 'all' 
              ? 'You haven\'t added any vehicles to your inventory yet.' 
              : `No vehicles with status "${filterStatus}" found.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default DealerVehicleList;
