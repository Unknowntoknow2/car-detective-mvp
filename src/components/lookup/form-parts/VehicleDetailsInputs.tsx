
import React, { useState, useEffect } from 'react';
import { useVehicleData } from '@/hooks/useVehicleData';
import { FormSelect } from './FormSelect';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface VehicleDetailsInputsProps {
  make: string;
  setMake: (value: string) => void;
  model: string;
  setModel: (value: string) => void;
  year: number | string | '';
  setYear: (value: number | string | '') => void;
  mileage: number | string;
  setMileage: (value: number | string) => void;
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
  trim = '',
  setTrim,
  color = '',
  setColor,
}) => {
  const { makes, getModelsByMake, getYearOptions } = useVehicleData();
  const [models, setModels] = useState<{ id: string; model_name: string }[]>([]);
  const yearOptions = getYearOptions(1990);
  
  // Update models when make changes
  useEffect(() => {
    if (make) {
      const makeObj = makes.find(m => m.make_name.toLowerCase() === make.toLowerCase());
      if (makeObj) {
        const modelsList = getModelsByMake(makeObj.id);
        setModels(modelsList);
      } else {
        setModels([]);
      }
    } else {
      setModels([]);
    }
  }, [make, makes, getModelsByMake]);
  
  const handleMakeChange = (value: string) => {
    setMake(value);
    setModel(''); // Reset model when make changes
  };
  
  const handleYearChange = (value: string) => {
    if (value === '') {
      setYear('');
    } else {
      setYear(parseInt(value));
    }
  };
  
  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setMileage('');
    } else {
      const numericValue = parseInt(value.replace(/\D/g, ''));
      if (!isNaN(numericValue)) {
        setMileage(numericValue);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="make" className="block text-sm font-medium text-gray-700">
            Make *
          </label>
          <Select 
            value={make} 
            onValueChange={handleMakeChange}
          >
            <SelectTrigger id="make" className="w-full">
              <SelectValue placeholder="Select make" />
            </SelectTrigger>
            <SelectContent>
              {makes.map((makeItem) => (
                <SelectItem key={makeItem.id} value={makeItem.make_name}>
                  {makeItem.make_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="model" className="block text-sm font-medium text-gray-700">
            Model *
          </label>
          <Select 
            value={model} 
            onValueChange={setModel} 
            disabled={!make}
          >
            <SelectTrigger id="model" className="w-full">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {models.map((modelItem) => (
                <SelectItem key={modelItem.id} value={modelItem.model_name}>
                  {modelItem.model_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="year" className="block text-sm font-medium text-gray-700">
            Year
          </label>
          <Select 
            value={year?.toString() || ''} 
            onValueChange={handleYearChange}
          >
            <SelectTrigger id="year" className="w-full">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((yearOption) => (
                <SelectItem key={yearOption} value={yearOption.toString()}>
                  {yearOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="mileage" className="block text-sm font-medium text-gray-700">
            Mileage
          </label>
          <Input
            id="mileage"
            type="text"
            placeholder="Enter mileage"
            value={mileage?.toString() || ''}
            onChange={handleMileageChange}
            className="w-full"
          />
        </div>
      </div>
      
      {setTrim && (
        <div className="space-y-2">
          <label htmlFor="trim" className="block text-sm font-medium text-gray-700">
            Trim (Optional)
          </label>
          <Input
            id="trim"
            type="text"
            placeholder="e.g. Sport, Limited, etc."
            value={trim}
            onChange={(e) => setTrim(e.target.value)}
            className="w-full"
          />
        </div>
      )}
      
      {setColor && (
        <div className="space-y-2">
          <label htmlFor="color" className="block text-sm font-medium text-gray-700">
            Color (Optional)
          </label>
          <Input
            id="color"
            type="text"
            placeholder="e.g. Red, Blue, etc."
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};
