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
import { ZipCodeInput } from '@/components/common/ZipCodeInput';

interface VehicleDetailsFieldsProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: Record<string, string>;
}

export function VehicleDetailsFields({ formData, setFormData, errors }: VehicleDetailsFieldsProps) {
  const [colorMultiplier, setColorMultiplier] = useState<number>(formData.colorMultiplier || 1);
  const [isZipValid, setIsZipValid] = useState<boolean | undefined>(undefined);
  
  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      mileage: value === '' ? 0 : Number(value)
    }));
  };

  const handleFuelTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      fuelType: value
    }));
  };

  const handleZipCodeChange = (value: string, isValid?: boolean) => {
    setFormData(prev => ({
      ...prev,
      zipCode: value
    }));
    
    setIsZipValid(isValid);
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
      bodyStyle: value,
      bodyType: value // Setting both for compatibility
    }));
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Mileage */}
      <div className="space-y-2">
        <Label htmlFor="mileage" className="text-sm font-medium block">
          Mileage <span className="text-red-500">*</span>
        </Label>
        <Input
          id="mileage"
          type="number"
          placeholder="e.g. 45000"
          value={formData.mileage || ''}
          onChange={handleMileageChange}
          className={`h-12 ${errors.mileage ? "border-red-500" : ""}`}
        />
        {errors.mileage && <FormValidationError error={errors.mileage} />}
        <p className="text-sm text-gray-500">Current mileage on your vehicle's odometer</p>
      </div>

      {/* Fuel Type */}
      <div className="space-y-2">
        <Label htmlFor="fuelType" className="text-sm font-medium block">
          Fuel Type <span className="text-red-500">*</span>
        </Label>
        <Select
          value={formData.fuelType || ''}
          onValueChange={handleFuelTypeChange}
        >
          <SelectTrigger id="fuelType" className={`h-12 ${errors.fuelType ? "border-red-500" : ""}`}>
            <SelectValue placeholder="Select fuel type" />
          </SelectTrigger>
          <SelectContent className="max-h-[40vh]">
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
        <Label htmlFor="zipCode" className="text-sm font-medium block">
          ZIP Code <span className="text-red-500">*</span>
        </Label>
        <ZipCodeInput
          value={formData.zipCode || ''}
          onChange={handleZipCodeChange}
          showValidation={true}
          disabled={false}
          required={true}
        />
        {errors.zipCode && <FormValidationError error={errors.zipCode} />}
        <p className="text-sm text-gray-500">Used to determine regional market value</p>
      </div>

      {/* Exterior Color */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="exteriorColor" className="text-sm font-medium">Exterior Color</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-[250px] p-3">
                <p className="text-sm">Color popularity affects value. Rare colors like Yellow can add up to 10% in value, while common colors like Black may reduce value by 5%.</p>
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
        <Label htmlFor="interiorColor" className="text-sm font-medium block">Interior Color</Label>
        <Input
          id="interiorColor"
          placeholder="e.g. Black Leather"
          value={formData.interiorColor || ''}
          onChange={handleInteriorColorChange}
          className="h-12"
        />
      </div>

      {/* Body Type/Style */}
      <div className="space-y-2">
        <Label htmlFor="bodyStyle" className="text-sm font-medium block">Body Style</Label>
        <Select
          value={formData.bodyStyle || formData.bodyType || ''}
          onValueChange={handleBodyStyleChange}
        >
          <SelectTrigger id="bodyStyle" className="h-12">
            <SelectValue placeholder="Select body style" />
          </SelectTrigger>
          <SelectContent className="max-h-[40vh]">
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
