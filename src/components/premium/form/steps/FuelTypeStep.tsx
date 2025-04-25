
import { Label } from '@/components/ui/label';
import { FormData } from '../PremiumValuationForm';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect } from 'react';

interface FuelTypeStepProps {
  step: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity: (step: number, isValid: boolean) => void;
}

export function FuelTypeStep({
  step,
  formData,
  setFormData,
  updateValidity
}: FuelTypeStepProps) {
  // Initialize validity
  useEffect(() => {
    updateValidity(step, Boolean(formData.fuelType));
  }, []);

  const handleFuelTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, fuelType: value }));
    updateValidity(step, Boolean(value));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Fuel Type</h2>
        <p className="text-gray-600 mb-6">
          Select the fuel type for your vehicle to ensure an accurate valuation.
        </p>
      </div>
      
      <div>
        <Label htmlFor="fuelType" className="text-gray-700">
          Fuel Type <span className="text-red-500">*</span>
        </Label>
        <div className="mt-1">
          <Select
            value={formData.fuelType || ''}
            onValueChange={handleFuelTypeChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select fuel type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Gasoline">Gasoline</SelectItem>
              <SelectItem value="Diesel">Diesel</SelectItem>
              <SelectItem value="Electric">Electric</SelectItem>
              <SelectItem value="Hybrid">Hybrid</SelectItem>
              <SelectItem value="Plug-in Hybrid">Plug-in Hybrid</SelectItem>
              <SelectItem value="Natural Gas">Natural Gas</SelectItem>
              <SelectItem value="Flex Fuel">Flex Fuel</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          The fuel type can impact your vehicle's market value, especially with the growing popularity of alternative fuel vehicles.
        </p>
      </div>
    </div>
  );
}
