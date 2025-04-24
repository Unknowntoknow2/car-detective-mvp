
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useVehicleData } from '@/hooks/useVehicleData';

interface VehicleBasicInfoProps {
  selectedMakeId: string;
  setSelectedMakeId: (id: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  selectedYear: number | '';
  setSelectedYear: (year: number | '') => void;
  mileage: string;
  setMileage: (mileage: string) => void;
  zipCode: string;
  setZipCode: (zip: string) => void;
  fuelType: string;
  setFuelType: (type: string) => void;
  isDisabled?: boolean;
}

const FUEL_TYPES = ["Gasoline", "Diesel", "Hybrid", "Electric"];

export const VehicleBasicInfo: React.FC<VehicleBasicInfoProps> = ({
  selectedMakeId,
  setSelectedMakeId,
  selectedModel,
  setSelectedModel,
  selectedYear,
  setSelectedYear,
  mileage,
  setMileage,
  zipCode,
  setZipCode,
  fuelType,
  setFuelType,
  isDisabled = false
}) => {
  const { makes, getModelsByMake, getYearOptions } = useVehicleData();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Select onValueChange={setSelectedMakeId} disabled={isDisabled}>
        <SelectTrigger><SelectValue placeholder="Select Make" /></SelectTrigger>
        <SelectContent>
          {makes.map(make => (
            <SelectItem key={make.id} value={make.id}>
              <div className="flex items-center">
                {make.logo_url && (
                  <img 
                    src={make.logo_url} 
                    alt={`${make.make_name} logo`} 
                    className="h-6 w-6 mr-2"
                  />
                )}
                {make.make_name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select 
        onValueChange={setSelectedModel}
        disabled={!selectedMakeId || isDisabled}
      >
        <SelectTrigger><SelectValue placeholder="Select Model" /></SelectTrigger>
        <SelectContent>
          {getModelsByMake(selectedMakeId).map(model => (
            <SelectItem key={model.id} value={model.model_name}>
              {model.model_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select 
        onValueChange={(value) => setSelectedYear(Number(value))}
        disabled={isDisabled}
      >
        <SelectTrigger><SelectValue placeholder="Select Year" /></SelectTrigger>
        <SelectContent>
          {getYearOptions().map(year => (
            <SelectItem key={year} value={String(year)}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input 
        type="number" 
        placeholder="Enter Mileage" 
        value={mileage}
        onChange={(e) => setMileage(e.target.value)}
        disabled={isDisabled}
      />

      <Input 
        placeholder="ZIP Code" 
        value={zipCode}
        onChange={(e) => setZipCode(e.target.value)}
        maxLength={5}
        disabled={isDisabled}
      />

      <Select 
        onValueChange={setFuelType}
        disabled={isDisabled}
      >
        <SelectTrigger><SelectValue placeholder="Fuel Type" /></SelectTrigger>
        <SelectContent>
          {FUEL_TYPES.map(type => (
            <SelectItem key={type} value={type}>{type}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
