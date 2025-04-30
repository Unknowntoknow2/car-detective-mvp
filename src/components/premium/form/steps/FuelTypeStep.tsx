
import { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { FormData } from '@/types/premium-valuation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FuelTypeStepProps {
  step: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity: (step: number, isValid: boolean) => void;
}

const FUEL_TYPES = [
  { 
    value: 'Gasoline', 
    label: 'Gasoline', 
    description: 'Most common fuel type for passenger vehicles'
  },
  { 
    value: 'Diesel', 
    label: 'Diesel',
    description: 'Better fuel economy, higher torque, longer engine life'
  },
  { 
    value: 'Hybrid', 
    label: 'Hybrid',
    description: 'Combines gasoline engine with electric motor for improved efficiency'
  },
  { 
    value: 'Electric', 
    label: 'Electric',
    description: 'Zero emissions, lower operating costs, instant torque'
  },
  { 
    value: 'Plug-in Hybrid', 
    label: 'Plug-in Hybrid',
    description: 'Rechargeable battery with gasoline engine backup'
  },
  { 
    value: 'Natural Gas', 
    label: 'Natural Gas (CNG)',
    description: 'Lower emissions than gasoline, cheaper fuel costs'
  },
  { 
    value: 'Flex Fuel', 
    label: 'Flex Fuel (E85)',
    description: 'Can run on gasoline or ethanol blend'
  }
];

export function FuelTypeStep({ step, formData, setFormData, updateValidity }: FuelTypeStepProps) {
  // Set initial validity on mount
  useEffect(() => {
    updateValidity(step, Boolean(formData.fuelType));
  }, []);

  const handleFuelTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, fuelType: value }));
    updateValidity(step, true);
  };

  const selectedFuelType = FUEL_TYPES.find(type => type.value === formData.fuelType);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Fuel Type</h2>
        <p className="text-gray-600 mb-6">
          Select the fuel type for your vehicle to ensure an accurate valuation.
          Different fuel types can significantly impact your vehicle's market value.
        </p>
      </div>
      
      <div>
        <div className="flex items-center mb-2">
          <Label htmlFor="fuelType" className="text-gray-700">
            Fuel Type <span className="text-red-500">*</span>
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-2 inline-flex items-center">
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>The fuel type can significantly impact your vehicle's market value, especially with the growing popularity of alternative fuel vehicles.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="mt-1">
          <Select
            value={formData.fuelType || ''}
            onValueChange={handleFuelTypeChange}
          >
            <SelectTrigger className="w-full h-12 bg-white">
              <SelectValue placeholder="Select fuel type" />
            </SelectTrigger>
            <SelectContent>
              {FUEL_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value} className="py-3">
                  <div className="flex flex-col">
                    <span className="font-medium">{type.label}</span>
                    <span className="text-xs text-muted-foreground">{type.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {selectedFuelType && (
          <p className="mt-2 text-sm text-muted-foreground">
            {selectedFuelType.description}
          </p>
        )}
      </div>
    </div>
  );
}
