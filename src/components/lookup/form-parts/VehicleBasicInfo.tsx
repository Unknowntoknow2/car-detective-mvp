
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useVehicleData } from '@/hooks/useVehicleData';
import { toast } from 'sonner';

const CONDITIONS = [
  { value: "excellent", label: "Excellent", description: "Vehicle is like new with no visible issues" },
  { value: "good", label: "Good", description: "Vehicle is well maintained with minimal wear" },
  { value: "fair", label: "Fair", description: "Vehicle has moderate wear and may need minor repairs" },
  { value: "poor", label: "Poor", description: "Vehicle has significant wear and likely needs repairs" }
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
  const [isValidatingZip, setIsValidatingZip] = useState(false);
  const [isZipValid, setIsZipValid] = useState<boolean | null>(null);

  const validateZipCode = async (zip: string) => {
    // Basic format validation
    if (zip.length !== 5 || !/^\d{5}$/.test(zip)) {
      setIsZipValid(false);
      return false;
    }
    
    // API validation
    try {
      setIsValidatingZip(true);
      const response = await fetch(`https://api.zippopotam.us/us/${zip}`);
      const isValid = response.ok;
      setIsZipValid(isValid);
      
      if (!isValid) {
        toast.error("Invalid ZIP code. Please enter a valid US ZIP code.");
      }
      
      return isValid;
    } catch (error) {
      console.error("ZIP validation error:", error);
      // If API fails, still allow user to proceed with basic validation
      setIsZipValid(true);
      return true;
    } finally {
      setIsValidatingZip(false);
    }
  };

  const handleZipBlur = async () => {
    if (zipCode.length === 5) {
      await validateZipCode(zipCode);
    } else if (zipCode.length > 0) {
      setIsZipValid(false);
    }
  };

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric chars
    setZipCode(value.slice(0, 5)); // Limit to 5 digits
    if (value.length !== 5) {
      setIsZipValid(null);
    }
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
        <SelectContent className="max-h-[300px] overflow-y-auto shadow-xl scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 transition-all scroll-smooth rounded-md">
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
        min="1"
        onBlur={() => {
          if (mileage === '' || parseInt(mileage, 10) <= 0) {
            toast.error("Mileage must be a positive number greater than zero");
            setMileage('');
          }
        }}
      />

      <Input 
        placeholder="ZIP Code" 
        value={zipCode}
        onChange={handleZipChange}
        onBlur={handleZipBlur}
        maxLength={5}
        disabled={isDisabled || isValidatingZip}
        className={isZipValid === true ? "border-green-500" : 
                  isZipValid === false ? "border-red-500" : ""}
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
            <SelectItem key={cond.value} value={cond.value} title={cond.description}>
              {cond.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
