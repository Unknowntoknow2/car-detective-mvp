
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useVehicleData, TrimData } from '@/hooks/useVehicleData';

export interface VehicleDetailsInputsProps {
  make?: string;
  setMake?: React.Dispatch<React.SetStateAction<string>>;
  model?: string;
  setModel?: React.Dispatch<React.SetStateAction<string>>;
  year?: number | string;
  setYear?: React.Dispatch<React.SetStateAction<number | string>>;
  mileage?: number | string;
  setMileage?: React.Dispatch<React.SetStateAction<number | string>>;
  condition?: string;
  setCondition?: React.Dispatch<React.SetStateAction<string>>;
  fuelType?: string;
  setFuelType?: React.Dispatch<React.SetStateAction<string>>;
  transmission?: string;
  setTransmission?: React.Dispatch<React.SetStateAction<string>>;
  color?: string;
  setColor?: React.Dispatch<React.SetStateAction<string>>;
  errors?: Record<string, string>;
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
  condition,
  setCondition,
  fuelType,
  setFuelType,
  transmission,
  setTransmission,
  color,
  setColor,
  errors = {}
}: VehicleDetailsInputsProps) {
  const [trims, setTrims] = useState<TrimData[]>([]);
  const [selectedTrim, setSelectedTrim] = useState<string>('');
  const { getTrimsByModel, getYearOptions } = useVehicleData();
  
  useEffect(() => {
    if (model) {
      const fetchTrims = async () => {
        const trimData = await getTrimsByModel(model);
        setTrims(trimData);
      };
      fetchTrims();
    } else {
      setTrims([]);
    }
  }, [model, getTrimsByModel]);
  
  const fuelTypes = [
    { value: 'gasoline', label: 'Gasoline' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'electric', label: 'Electric' },
    { value: 'lpg', label: 'LPG' },
    { value: 'cng', label: 'CNG' }
  ];
  
  const transmissionTypes = [
    { value: 'automatic', label: 'Automatic' },
    { value: 'manual', label: 'Manual' },
    { value: 'cvt', label: 'CVT' },
    { value: 'dualClutch', label: 'Dual Clutch' }
  ];
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="mileage">Mileage</Label>
          <Input
            id="mileage"
            type="number"
            placeholder="Enter vehicle mileage"
            value={mileage || ''}
            onChange={(e) => setMileage && setMileage(parseInt(e.target.value) || '')}
            className={errors.mileage ? 'border-red-500' : ''}
          />
          {errors.mileage && <p className="text-red-500 text-sm">{errors.mileage}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="condition">Condition</Label>
          <Select value={condition} onValueChange={(value) => setCondition && setCondition(value)}>
            <SelectTrigger className={errors.condition ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excellent">Excellent</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
              <SelectItem value="poor">Poor</SelectItem>
            </SelectContent>
          </Select>
          {errors.condition && <p className="text-red-500 text-sm">{errors.condition}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fuelType">Fuel Type</Label>
          <Select value={fuelType} onValueChange={(value) => setFuelType && setFuelType(value)}>
            <SelectTrigger className={errors.fuelType ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select fuel type" />
            </SelectTrigger>
            <SelectContent>
              {fuelTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.fuelType && <p className="text-red-500 text-sm">{errors.fuelType}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="transmission">Transmission</Label>
          <Select value={transmission} onValueChange={(value) => setTransmission && setTransmission(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select transmission" />
            </SelectTrigger>
            <SelectContent>
              {transmissionTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="trim">Trim</Label>
          <Select value={selectedTrim} onValueChange={setSelectedTrim}>
            <SelectTrigger>
              <SelectValue placeholder="Select trim (optional)" />
            </SelectTrigger>
            <SelectContent>
              {trims.map((trim) => (
                <SelectItem key={trim.id} value={trim.id}>
                  {trim.trim_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            placeholder="Enter vehicle color"
            value={color || ''}
            onChange={(e) => setColor && setColor(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
