
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VehicleDetailsProps {
  vehicleDetails: {
    make: string;
    model: string;
    year: string;
    mileage: string;
    trim: string;
    zipCode: string;
    condition: string;
  };
  setVehicleDetails: React.Dispatch<React.SetStateAction<any>>;
}

export function VehicleDetailsForm({ vehicleDetails, setVehicleDetails }: VehicleDetailsProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => (currentYear - i).toString());

  const handleChange = (field: string, value: string) => {
    setVehicleDetails((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="make">Make</Label>
          <Input
            id="make"
            placeholder="e.g. Toyota"
            value={vehicleDetails.make}
            onChange={(e) => handleChange('make', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            placeholder="e.g. Camry"
            value={vehicleDetails.model}
            onChange={(e) => handleChange('model', e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Select
            value={vehicleDetails.year}
            onValueChange={(value) => handleChange('year', value)}
          >
            <SelectTrigger id="year">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="mileage">Mileage</Label>
          <Input
            id="mileage"
            type="number"
            placeholder="e.g. 45000"
            value={vehicleDetails.mileage}
            onChange={(e) => handleChange('mileage', e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="trim">Trim (Optional)</Label>
          <Input
            id="trim"
            placeholder="e.g. XLE"
            value={vehicleDetails.trim}
            onChange={(e) => handleChange('trim', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="condition">Condition</Label>
          <Select
            value={vehicleDetails.condition}
            onValueChange={(value) => handleChange('condition', value)}
          >
            <SelectTrigger id="condition">
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
          placeholder="e.g. 90210"
          value={vehicleDetails.zipCode}
          onChange={(e) => handleChange('zipCode', e.target.value)}
        />
      </div>
    </div>
  );
}
