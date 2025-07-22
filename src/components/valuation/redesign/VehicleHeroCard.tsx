
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Gauge, MapPin, Fuel, Car } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface VehicleHeroCardProps {
  vehicle: {
    year: number;
    make: string;
    model: string;
    trim: string;
    fuelType?: string;
    transmission?: string;
    mileage: number;
    condition: string;
    zipCode: string;
  };
  estimatedValue: number;
  confidenceScore: number;
  timestamp: string;
  isPremium?: boolean;
}

export const VehicleHeroCard: React.FC<VehicleHeroCardProps> = ({
  vehicle,
  estimatedValue,
  confidenceScore,
  timestamp,
  isPremium = false
}) => {
  const confidenceColor = confidenceScore >= 85 ? 'bg-green-100 text-green-800' :
                          confidenceScore >= 70 ? 'bg-blue-100 text-blue-800' : 
                          'bg-amber-100 text-amber-800';

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(parseInt(timestamp) || timestamp);
      if (isNaN(date.getTime())) {
        return 'Just now';
      }
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Just now';
    }
  };

  return (
    <Card className="bg-gradient-to-r from-white to-primary/5 border-primary/20">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Vehicle Info */}
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h1>
              {vehicle.trim && vehicle.trim !== 'Unknown' && (
                <p className="text-lg text-muted-foreground mt-1">{vehicle.trim}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{vehicle.year}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-muted-foreground" />
                <span>{vehicle.mileage.toLocaleString()} miles</span>
              </div>
              
              {vehicle.fuelType && (
                <div className="flex items-center gap-2">
                  <Fuel className="h-4 w-4 text-muted-foreground" />
                  <span className="capitalize">{vehicle.fuelType}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>ZIP {vehicle.zipCode}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge className={confidenceColor}>
                {confidenceScore}% Confidence
              </Badge>
              {isPremium && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  Premium Valuation
                </Badge>
              )}
            </div>
          </div>

          {/* Valuation Summary */}
          <div className="text-center lg:text-right">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Estimated Market Value</p>
              <p className="text-4xl font-bold text-primary">
                {formatCurrency(estimatedValue)}
              </p>
              <p className="text-xs text-muted-foreground">
                Updated {formatTimestamp(timestamp)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
