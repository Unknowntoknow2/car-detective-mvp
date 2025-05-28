
import React, { useEffect, useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ManualEntryFormData } from '../types/manualEntry';
import { useMakeModels } from '@/hooks/useMakeModels';

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
  const { makes, models, isLoading, error, getModelsByMakeId } = useMakeModels();
  const [selectedMakeId, setSelectedMakeId] = useState<string>('');
  
  // Generate year options from 1980 to current year + 1
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1979 }, (_, i) => currentYear + 1 - i);

  // Handle make selection
  const handleMakeChange = async (makeName: string) => {
    console.log('Make selected:', makeName);
    
    // Find the make ID from the make name
    const selectedMake = makes.find(make => make.make_name === makeName);
    if (selectedMake) {
      console.log('Found make ID:', selectedMake.id);
      setSelectedMakeId(selectedMake.id);
      
      // Update form data
      updateFormData({ 
        make: makeName,
        model: '' // Reset model when make changes
      });
      
      // Fetch models for this make
      await getModelsByMakeId(selectedMake.id);
    }
  };

  // Handle model selection
  const handleModelChange = (modelName: string) => {
    console.log('Model selected:', modelName);
    updateFormData({ model: modelName });
  };

  // Handle year change
  const handleYearChange = (yearString: string) => {
    const yearNumber = parseInt(yearString);
    updateFormData({ year: yearNumber });
  };

  // Handle mileage change
  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only numbers
    updateFormData({ mileage: parseInt(value) || 0 });
  };

  // Handle zip code change
  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5); // Only 5 digits
    updateFormData({ zipCode: value });
  };

  if (isLoading) {
    return <div>Loading vehicle data...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading vehicle data: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Vehicle Information</h3>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Make Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Make <span className="text-red-500">*</span>
          </label>
          <Select 
            value={formData.make} 
            onValueChange={handleMakeChange}
          >
            <SelectTrigger className={errors.make ? 'border-red-300' : ''}>
              <SelectValue placeholder="Select make" />
            </SelectTrigger>
            <SelectContent>
              {makes.map(make => (
                <SelectItem key={make.id} value={make.make_name}>
                  {make.make_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.make && <p className="text-sm text-red-500">{errors.make}</p>}
        </div>

        {/* Model Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Model <span className="text-red-500">*</span>
          </label>
          <Select 
            value={formData.model} 
            onValueChange={handleModelChange}
            disabled={!selectedMakeId || models.length === 0}
          >
            <SelectTrigger className={errors.model ? 'border-red-300' : ''}>
              <SelectValue placeholder={!selectedMakeId ? "Select make first" : "Select model"} />
            </SelectTrigger>
            <SelectContent>
              {models.map(model => (
                <SelectItem key={model.id} value={model.model_name}>
                  {model.model_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.model && <p className="text-sm text-red-500">{errors.model}</p>}
        </div>

        {/* Year Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Year <span className="text-red-500">*</span>
          </label>
          <Select 
            value={formData.year?.toString() || ''} 
            onValueChange={handleYearChange}
          >
            <SelectTrigger className={errors.year ? 'border-red-300' : ''}>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.year && <p className="text-sm text-red-500">{errors.year}</p>}
        </div>

        {/* Mileage Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Mileage <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={formData.mileage || ''}
            onChange={handleMileageChange}
            placeholder="e.g. 45000"
            className={errors.mileage ? 'border-red-300' : ''}
          />
          {errors.mileage && <p className="text-sm text-red-500">{errors.mileage}</p>}
        </div>
      </div>

      {/* ZIP Code - Full Width */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          ZIP Code <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          value={formData.zipCode || ''}
          onChange={handleZipCodeChange}
          placeholder="Enter 5-digit ZIP code"
          maxLength={5}
          className={`max-w-xs ${errors.zipCode ? 'border-red-300' : ''}`}
        />
        {errors.zipCode && <p className="text-sm text-red-500">{errors.zipCode}</p>}
        <p className="text-xs text-gray-500">
          Your location helps us provide accurate regional pricing
        </p>
      </div>
    </div>
  );
}
