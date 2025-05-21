
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface VehicleDetailsFormProps {
  vehicleDetails: {
    make: string;
    model: string;
    year: number | string;
    mileage?: number | string;
    trim?: string;
    zipCode?: string;
    condition?: string;
  };
  setVehicleDetails: React.Dispatch<React.SetStateAction<any>>;
  onSubmit?: () => void;
  isLoading?: boolean;
}

export function VehicleDetailsForm({
  vehicleDetails,
  setVehicleDetails,
  onSubmit,
  isLoading = false
}: VehicleDetailsFormProps) {
  const handleChange = (field: string, value: string | number) => {
    setVehicleDetails((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card>
      <CardContent className="space-y-4 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="make">Make</Label>
            <Input
              id="make"
              value={vehicleDetails.make || ''}
              onChange={(e) => handleChange('make', e.target.value)}
              placeholder="e.g., Toyota"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              value={vehicleDetails.model || ''}
              onChange={(e) => handleChange('model', e.target.value)}
              placeholder="e.g., Camry"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              type="number"
              value={vehicleDetails.year || ''}
              onChange={(e) => handleChange('year', parseInt(e.target.value) || '')}
              placeholder="e.g., 2020"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mileage">Mileage</Label>
            <Input
              id="mileage"
              type="number"
              value={vehicleDetails.mileage || ''}
              onChange={(e) => handleChange('mileage', parseInt(e.target.value) || '')}
              placeholder="e.g., 45000"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="trim">Trim (Optional)</Label>
            <Input
              id="trim"
              value={vehicleDetails.trim || ''}
              onChange={(e) => handleChange('trim', e.target.value)}
              placeholder="e.g., LE"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="condition">Condition</Label>
            <Select
              value={vehicleDetails.condition || ''}
              onValueChange={(value) => handleChange('condition', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            id="zipCode"
            value={vehicleDetails.zipCode || ''}
            onChange={(e) => handleChange('zipCode', e.target.value)}
            placeholder="e.g., 90210"
          />
        </div>
      </CardContent>
    </Card>
  );
}
