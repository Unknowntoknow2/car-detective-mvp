
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { VehicleFormTooltip } from '@/components/form/VehicleFormToolTip';

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
  showAdvanced?: boolean;
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
  setColor,
  showAdvanced = true
}) => {
  const [yearError, setYearError] = useState<string | null>(null);
  const [mileageError, setMileageError] = useState<string | null>(null);
  
  const currentYear = new Date().getFullYear() + 1;
  
  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseInt(value, 10);
    
    // Clear previous error
    setYearError(null);
    
    // Validate year
    if (isNaN(numValue)) {
      setYearError('Year must be a valid number');
      return;
    }
    
    if (numValue < 1900 || numValue > currentYear) {
      setYearError(`Year must be between 1900 and ${currentYear}`);
    }
    
    setYear(numValue);
  };
  
  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseInt(value, 10);
    
    // Clear previous error
    setMileageError(null);
    
    // Validate mileage
    if (isNaN(numValue)) {
      setMileageError('Mileage must be a valid number');
      return;
    }
    
    if (numValue < 0) {
      setMileageError('Mileage cannot be negative');
    }
    
    setMileage(numValue);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="make">Make</Label>
          <Input
            id="make"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            placeholder="e.g., Toyota"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="e.g., Camry"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center">
            <Label htmlFor="year">Year</Label>
            <VehicleFormTooltip 
              content={`Enter a year between 1900 and ${currentYear}.`}
            />
          </div>
          <Input
            id="year"
            type="number"
            value={year || ''}
            onChange={handleYearChange}
            placeholder="e.g., 2019"
          />
          {yearError && <p className="text-sm text-red-500">{yearError}</p>}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <Label htmlFor="mileage">Mileage</Label>
            <VehicleFormTooltip 
              content="Current odometer reading in miles."
            />
          </div>
          <Input
            id="mileage"
            type="number" 
            value={mileage || ''}
            onChange={handleMileageChange}
            placeholder="e.g., 45000"
          />
          {mileageError && <p className="text-sm text-red-500">{mileageError}</p>}
        </div>
      </div>
      
      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="trim">Trim (Optional)</Label>
            <Input
              id="trim"
              value={trim || ''}
              onChange={(e) => setTrim && setTrim(e.target.value)}
              placeholder="e.g., SE, Limited"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="color">Color (Optional)</Label>
            <Input
              id="color"
              value={color || ''}
              onChange={(e) => setColor && setColor(e.target.value)}
              placeholder="e.g., Blue, Silver"
            />
          </div>
        </div>
      )}
    </div>
  );
};
