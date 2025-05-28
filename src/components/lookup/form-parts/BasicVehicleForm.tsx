
import React, { useState, useEffect, useCallback } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMakeModels } from '@/hooks/useMakeModels';
import { ManualEntryFormData } from '../types/manualEntry';

interface BasicVehicleFormProps {
  formData: ManualEntryFormData;
  updateFormData: (updates: Partial<ManualEntryFormData>) => void;
  errors: Record<string, string>;
  isPremium?: boolean;
}

export const BasicVehicleForm: React.FC<BasicVehicleFormProps> = ({ 
  formData, 
  updateFormData, 
  errors, 
  isPremium = false 
}) => {
  const { makes, models, isLoading, error, getModelsByMakeId } = useMakeModels();
  const [selectedMakeId, setSelectedMakeId] = useState<string>('');
  const [loadingModels, setLoadingModels] = useState(false);

  // Generate year options
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1979 }, (_, i) => currentYear - i);

  // Handle make selection and fetch models
  const handleMakeChange = useCallback(async (makeId: string) => {
    console.log('Make changed to:', makeId);
    setSelectedMakeId(makeId);
    updateFormData({ make: makeId, model: '' }); // Reset model when make changes

    if (makeId) {
      setLoadingModels(true);
      try {
        await getModelsByMakeId(makeId);
        console.log('Models fetched successfully');
      } catch (error) {
        console.error('Error fetching models:', error);
      } finally {
        setLoadingModels(false);
      }
    }
  }, [updateFormData, getModelsByMakeId]);

  // Handle model selection
  const handleModelChange = useCallback((modelId: string) => {
    console.log('Model changed to:', modelId);
    updateFormData({ model: modelId });
  }, [updateFormData]);

  // Sync formData with local state
  useEffect(() => {
    if (formData.make && formData.make !== selectedMakeId) {
      setSelectedMakeId(formData.make);
    }
  }, [formData.make, selectedMakeId]);

  if (error) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-800">
        <p className="font-medium">Error loading vehicle data</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Vehicle Information</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Make</label>
          <Select 
            onValueChange={handleMakeChange} 
            value={selectedMakeId}
            disabled={isLoading}
          >
            <SelectTrigger className={errors.make ? 'border-red-300' : ''}>
              <SelectValue placeholder={isLoading ? "Loading makes..." : "Select make"} />
            </SelectTrigger>
            <SelectContent>
              {makes.map(make => (
                <SelectItem key={make.id} value={make.id}>
                  {make.make_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.make && <p className="text-red-500 text-sm mt-1">{errors.make}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
          <Select 
            onValueChange={handleModelChange} 
            value={formData.model}
            disabled={!selectedMakeId || loadingModels || models.length === 0}
          >
            <SelectTrigger className={errors.model ? 'border-red-300' : ''}>
              <SelectValue placeholder={
                !selectedMakeId ? "Select make first" :
                loadingModels ? "Loading models..." :
                models.length === 0 ? "No models available" :
                "Select model"
              } />
            </SelectTrigger>
            <SelectContent>
              {models.map(model => (
                <SelectItem key={model.id} value={model.id}>
                  {model.model_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
          <Select 
            onValueChange={(value) => updateFormData({ year: parseInt(value) })} 
            value={formData.year?.toString() || ''}
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
          {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mileage</label>
          <Input 
            type="number" 
            placeholder="e.g. 45000" 
            value={formData.mileage || ''} 
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              updateFormData({ mileage: parseInt(value) || 0 });
            }}
            className={errors.mileage ? 'border-red-300' : ''}
          />
          {errors.mileage && <p className="text-red-500 text-sm mt-1">{errors.mileage}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
          <Input 
            type="text" 
            placeholder="e.g. 90210" 
            value={formData.zipCode || ''} 
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 5);
              updateFormData({ zipCode: value });
            }}
            maxLength={5}
            className={errors.zipCode ? 'border-red-300' : ''}
          />
          {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
        </div>
      </div>
    </div>
  );
};
