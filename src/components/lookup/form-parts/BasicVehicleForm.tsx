
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ManualEntryFormData, ConditionLevel } from '../types/manualEntry';

interface BasicVehicleFormProps {
  formData: ManualEntryFormData;
  updateFormData: (updates: Partial<ManualEntryFormData>) => void;
  errors: Record<string, string>;
  isPremium?: boolean;
}

export function BasicVehicleForm({
  formData,
  updateFormData,
  errors,
  isPremium = false
}: BasicVehicleFormProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="make">Make *</Label>
          <Input
            id="make"
            value={formData.make}
            onChange={(e) => updateFormData({ make: e.target.value })}
            placeholder="e.g., Toyota"
            className={errors.make ? 'border-red-500' : ''}
          />
          {errors.make && <p className="text-red-500 text-sm mt-1">{errors.make}</p>}
        </div>

        <div>
          <Label htmlFor="model">Model *</Label>
          <Input
            id="model"
            value={formData.model}
            onChange={(e) => updateFormData({ model: e.target.value })}
            placeholder="e.g., Camry"
            className={errors.model ? 'border-red-500' : ''}
          />
          {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="year">Year *</Label>
          <Select 
            value={formData.year.toString()} 
            onValueChange={(value) => updateFormData({ year: parseInt(value) })}
          >
            <SelectTrigger className={errors.year ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map(year => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
        </div>

        <div>
          <Label htmlFor="mileage">Mileage</Label>
          <Input
            id="mileage"
            type="number"
            value={formData.mileage || ''}
            onChange={(e) => updateFormData({ mileage: parseInt(e.target.value) || 0 })}
            placeholder="e.g., 45000"
          />
        </div>

        <div>
          <Label htmlFor="condition">Condition</Label>
          <Select 
            value={formData.condition} 
            onValueChange={(value) => updateFormData({ condition: value as ConditionLevel })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ConditionLevel.Excellent}>Excellent</SelectItem>
              <SelectItem value={ConditionLevel.Good}>Good</SelectItem>
              <SelectItem value={ConditionLevel.Fair}>Fair</SelectItem>
              <SelectItem value={ConditionLevel.Poor}>Poor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="zipCode">ZIP Code *</Label>
          <Input
            id="zipCode"
            value={formData.zipCode}
            onChange={(e) => updateFormData({ zipCode: e.target.value })}
            placeholder="e.g., 90210"
            maxLength={5}
            className={errors.zipCode ? 'border-red-500' : ''}
          />
          {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
        </div>

        {isPremium && (
          <div>
            <Label htmlFor="trim">Trim (Optional)</Label>
            <Input
              id="trim"
              value={formData.trim || ''}
              onChange={(e) => updateFormData({ trim: e.target.value })}
              placeholder="e.g., XLE, Sport"
            />
          </div>
        )}
      </div>

      {isPremium && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fuelType">Fuel Type</Label>
            <Select 
              value={formData.fuelType || 'gasoline'} 
              onValueChange={(value) => updateFormData({ fuelType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select fuel type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gasoline">Gasoline</SelectItem>
                <SelectItem value="diesel">Diesel</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="electric">Electric</SelectItem>
                <SelectItem value="plugin-hybrid">Plug-in Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="transmission">Transmission</Label>
            <Select 
              value={formData.transmission || 'automatic'} 
              onValueChange={(value) => updateFormData({ transmission: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select transmission" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="automatic">Automatic</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="cvt">CVT</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
