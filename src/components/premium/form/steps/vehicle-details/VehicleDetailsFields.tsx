import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormData } from '@/types/premium-valuation';
import { FormValidationError } from '@/components/premium/common/FormValidationError';
import { ColorSwatch } from '@/components/ui/ColorSwatch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface VehicleDetailsFieldsProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: Record<string, string>;
}

export function VehicleDetailsFields({ formData, setFormData, errors }: VehicleDetailsFieldsProps) {
  const [colorMultiplier, setColorMultiplier] = useState<number>(1);
  
  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      mileage: value === '' ? null : Number(value)
    }));
  };

  const handleFuelTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      fuelType: value
    }));
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      zipCode: e.target.value
    }));
  };

  const handleExteriorColorChange = (color: string, multiplier: number) => {
    setFormData(prev => ({
      ...prev,
      exteriorColor: color,
      colorMultiplier: multiplier
    }));
    setColorMultiplier(multiplier);
    
    const adjustmentText = multiplier > 1 
      ? `+${((multiplier - 1) * 100).toFixed(0)}%` 
      : multiplier < 1 
        ? `-${((1 - multiplier) * 100).toFixed(0)}%` 
        : 'no adjustment';
        
    toast.info(`Selected ${color} with ${adjustmentText} value impact`);
  };

  const handleInteriorColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      interiorColor: e.target.value
    }));
  };

  const handleBodyStyleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      bodyStyle: value
    }));
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Mileage */}
      <div className="space-y-2">
        <Label htmlFor="mileage">
          Mileage <span className="text-red-500">*</span>
        </Label>
        <Input
          id="mileage"
          type="number"
          placeholder="e.g. 45000"
          value={formData.mileage || ''}
          onChange={handleMileageChange}
          className={errors.mileage ? "border-red-500" : ""}
        />
        {errors.mileage && <FormValidationError error={errors.mileage} />}
        <p className="text-sm text-gray-500">Current mileage on your vehicle's odometer</p>
      </div>

      {/* Fuel Type */}
      <div className="space-y-2">
        <Label htmlFor="fuelType">
          Fuel Type <span className="text-red-500">*</span>
        </Label>
        <Select
          value={formData.fuelType || ''}
          onValueChange={handleFuelTypeChange}
        >
          <SelectTrigger id="fuelType" className={errors.fuelType ? "border-red-500" : ""}>
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
        {errors.fuelType && <FormValidationError error={errors.fuelType} />}
      </div>

      {/* ZIP Code */}
      <div className="space-y-2">
        <Label htmlFor="zipCode">
          ZIP Code <span className="text-red-500">*</span>
        </Label>
        <Input
          id="zipCode"
          placeholder="e.g. 90210"
          value={formData.zipCode}
          onChange={handleZipCodeChange}
          maxLength={10}
          className={errors.zipCode ? "border-red-500" : ""}
        />
        {errors.zipCode && <FormValidationError error={errors.zipCode} />}
        <p className="text-sm text-gray-500">Used to determine regional market value</p>
      </div>

      {/* Exterior Color */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="exteriorColor">Exterior Color</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-[250px]">
                <p>Color popularity affects value. Rare colors like Yellow can add up to 10% in value, while common colors like Black may reduce value by 5%.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <ColorSwatch 
          value={formData.exteriorColor || ''} 
          onChange={handleExteriorColorChange}
        />
        <p className="text-sm text-gray-500 flex items-center">
          {colorMultiplier !== 1 && (
            <span className={colorMultiplier > 1 ? "text-green-600" : "text-red-600"}>
              Value impact: {colorMultiplier > 1 ? '+' : ''}{((colorMultiplier - 1) * 100).toFixed(0)}%
            </span>
          )}
        </p>
      </div>

      {/* Interior Color */}
      <div className="space-y-2">
        <Label htmlFor="interiorColor">Interior Color</Label>
        <Input
          id="interiorColor"
          placeholder="e.g. Black Leather"
          value={formData.interiorColor || ''}
          onChange={handleInteriorColorChange}
        />
      </div>

      {/* Body Type/Style */}
      <div className="space-y-2">
        <Label htmlFor="bodyStyle">Body Style</Label>
        <Select
          value={formData.bodyStyle || ''}
          onValueChange={handleBodyStyleChange}
        >
          <SelectTrigger id="bodyStyle">
            <SelectValue placeholder="Select body style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Sedan">Sedan</SelectItem>
            <SelectItem value="SUV">SUV</SelectItem>
            <SelectItem value="Truck">Truck</SelectItem>
            <SelectItem value="Van">Van</SelectItem>
            <SelectItem value="Coupe">Coupe</SelectItem>
            <SelectItem value="Convertible">Convertible</SelectItem>
            <SelectItem value="Wagon">Wagon</SelectItem>
            <SelectItem value="Hatchback">Hatchback</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
