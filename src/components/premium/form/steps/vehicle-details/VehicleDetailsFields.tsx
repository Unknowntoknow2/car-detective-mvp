
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormData } from '@/types/premium-valuation';
import { FormValidationError } from '@/components/premium/common/FormValidationError';

interface VehicleDetailsFieldsProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: Record<string, string>;
}

export function VehicleDetailsFields({ formData, setFormData, errors }: VehicleDetailsFieldsProps) {
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

  const handleExteriorColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      exteriorColor: e.target.value
    }));
  };

  const handleInteriorColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      interiorColor: e.target.value
    }));
  };

  const handleBodyTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      bodyType: value
    }));
  };

  const handleTrimChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      trim: e.target.value
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
        <Label htmlFor="exteriorColor">Exterior Color</Label>
        <Input
          id="exteriorColor"
          placeholder="e.g. Pearl White"
          value={formData.exteriorColor || ''}
          onChange={handleExteriorColorChange}
        />
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

      {/* Body Type */}
      <div className="space-y-2">
        <Label htmlFor="bodyType">Body Type</Label>
        <Select
          value={formData.bodyType || ''}
          onValueChange={handleBodyTypeChange}
        >
          <SelectTrigger id="bodyType">
            <SelectValue placeholder="Select body type" />
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

      {/* Trim */}
      <div className="space-y-2">
        <Label htmlFor="trim">Trim Level</Label>
        <Input
          id="trim"
          placeholder="e.g. LX, EX-L, Limited"
          value={formData.trim || ''}
          onChange={handleTrimChange}
        />
        <p className="text-sm text-gray-500">The specific trim package of your vehicle</p>
      </div>
    </div>
  );
}
