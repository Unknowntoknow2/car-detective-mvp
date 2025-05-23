
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { VEHICLE_MAKES, VEHICLE_YEARS } from '@/data/vehicle-data';

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
  availableModels?: string[];
}

export function VehicleDetailsInputs({
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
  availableModels = []
}: VehicleDetailsInputsProps) {
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);
  
  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value === '') {
      setMileage(0);
    } else {
      setMileage(parseInt(value, 10));
    }
  };
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="make">Make</Label>
          <Select
            value={make}
            onValueChange={setMake}
          >
            <SelectTrigger id="make">
              <SelectValue placeholder="Select make" />
            </SelectTrigger>
            <SelectContent>
              {VEHICLE_MAKES.map((makeName) => (
                <SelectItem key={makeName} value={makeName}>
                  {makeName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Select
            value={model}
            onValueChange={setModel}
            disabled={!make}
          >
            <SelectTrigger id="model">
              <SelectValue placeholder={make ? "Select model" : "Select make first"} />
            </SelectTrigger>
            <SelectContent>
              {availableModels.length > 0 ? (
                availableModels.map((modelName) => (
                  <SelectItem key={modelName} value={modelName}>
                    {modelName}
                  </SelectItem>
                ))
              ) : (
                // This was likely causing the error - an empty value in SelectItem
                make && <SelectItem value="no_models_found">No models found</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Select
            value={year.toString()}
            onValueChange={(value) => setYear(parseInt(value, 10))}
          >
            <SelectTrigger id="year">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="mileage">Mileage</Label>
          <Input
            id="mileage"
            type="text"
            value={mileage || ''}
            onChange={handleMileageChange}
            placeholder="e.g. 45000"
          />
        </div>
      </div>
      
      {/* Optional trim and color inputs for premium version */}
      {setTrim && setColor && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="trim">Trim (Optional)</Label>
            <Input
              id="trim"
              type="text"
              value={trim || ''}
              onChange={(e) => setTrim(e.target.value)}
              placeholder="e.g. Sport, Limited"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="color">Color (Optional)</Label>
            <Input
              id="color"
              type="text"
              value={color || ''}
              onChange={(e) => setColor(e.target.value)}
              placeholder="e.g. Blue, Silver"
            />
          </div>
        </div>
      )}
    </>
  );
}
