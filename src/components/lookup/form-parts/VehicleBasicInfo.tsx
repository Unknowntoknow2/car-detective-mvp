
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useVehicleData } from '@/hooks/useVehicleData';

const CONDITIONS = [
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" }
];

const FUEL_TYPES = ["Gasoline", "Diesel", "Hybrid", "Electric"];

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
  condition: string;
  setCondition: (condition: string) => void;
  isDisabled?: boolean;
}

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
  condition,
  setCondition,
  isDisabled = false
}) => {
  const { makes, getModelsByMake, getYearOptions } = useVehicleData();

  const validateZipCode = (zip: string) => {
    // Basic US ZIP code validation
    if (zip.length === 5 && /^\d{5}$/.test(zip)) {
      // Here we could call an API to validate the ZIP code
      // For now we just do format validation
      return true;
    }
    return false;
  };

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric chars
    setZipCode(value.slice(0, 5)); // Limit to 5 digits
  };

  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric chars
    if (value === '' || parseInt(value, 10) > 0) {
      setMileage(value);
    }
  };

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
        <SelectContent className="max-h-[300px] overflow-y-auto shadow-xl scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {getYearOptions().map(year => (
            <SelectItem key={year} value={String(year)} className="hover:bg-gray-100 transition-colors">
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input 
        type="text" 
        inputMode="numeric"
        placeholder="Enter Mileage" 
        value={mileage}
        onChange={handleMileageChange}
        disabled={isDisabled}
        className="appearance-none"
      />

      <Input 
        placeholder="ZIP Code" 
        value={zipCode}
        onChange={handleZipChange}
        maxLength={5}
        disabled={isDisabled}
        className={zipCode.length === 5 && validateZipCode(zipCode) ? "border-green-500" : ""}
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
      
      <Select 
        onValueChange={setCondition}
        value={condition}
        disabled={isDisabled}
      >
        <SelectTrigger><SelectValue placeholder="Vehicle Condition" /></SelectTrigger>
        <SelectContent>
          {CONDITIONS.map(cond => (
            <SelectItem key={cond.value} value={cond.value}>{cond.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
