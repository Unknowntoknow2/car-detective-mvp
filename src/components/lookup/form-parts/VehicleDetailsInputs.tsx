
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface VehicleDetailsInputsProps {
  make: string;
  setMake: (value: string) => void;
  model: string;
  setModel: (value: string) => void;
  year: number;
  setYear: (value: number) => void;
  mileage: number;
  setMileage: (value: number) => void;
  trim?: string;
  setTrim?: (value: string) => void;
  color?: string;
  setColor?: (value: string) => void;
}

export const VehicleDetailsInputs: React.FC<VehicleDetailsInputsProps> = ({
  make,
  setMake,
  model,
  setModel,
  year,
  setYear,
  mileage,
  setMileage,
  trim,
  setTrim,
  color,
  setColor
}) => {
  const currentYear = new Date().getFullYear();
  
  // Handle year change with validation
  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const yearValue = parseInt(e.target.value);
    if (!isNaN(yearValue)) {
      // Limit year between 1900 and current year + 1
      if (yearValue >= 1900 && yearValue <= currentYear + 1) {
        setYear(yearValue);
      }
    }
  };
  
  // Handle mileage change with validation
  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const mileageValue = parseInt(e.target.value);
    if (!isNaN(mileageValue) && mileageValue >= 0) {
      setMileage(mileageValue);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="make">Make</Label>
          <Input
            id="make"
            placeholder="e.g. Toyota"
            value={make}
            onChange={(e) => setMake(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            placeholder="e.g. Camry"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            type="number"
            placeholder={`1900-${currentYear + 1}`}
            value={year}
            onChange={handleYearChange}
            min={1900}
            max={currentYear + 1}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="mileage">Mileage</Label>
          <Input
            id="mileage"
            type="number"
            placeholder="e.g. 50000"
            value={mileage}
            onChange={handleMileageChange}
            min={0}
          />
        </div>
      </div>
      
      {(setTrim || setColor) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {setTrim && (
            <div className="space-y-2">
              <Label htmlFor="trim">Trim (Optional)</Label>
              <Input
                id="trim"
                placeholder="e.g. XLE"
                value={trim}
                onChange={(e) => setTrim(e.target.value)}
              />
            </div>
          )}
          
          {setColor && (
            <div className="space-y-2">
              <Label htmlFor="color">Color (Optional)</Label>
              <Input
                id="color"
                placeholder="e.g. Silver"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VehicleDetailsInputs;
