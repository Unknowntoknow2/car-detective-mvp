
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Car } from 'lucide-react';
import { DealerVehicle } from '@/types/dealerVehicle';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface VehicleCardProps {
  vehicle: DealerVehicle;
  onDeleteClick: (vehicle: DealerVehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ 
  vehicle, 
  onDeleteClick 
}) => {
  const navigate = useNavigate();

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
          onClick={() => onDeleteClick(vehicle)}
        >
          <Trash2 className="h-4 w-4 mr-2" /> Remove
        </Button>
      </CardFooter>
    </Card>
  );
};
