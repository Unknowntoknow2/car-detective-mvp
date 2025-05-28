
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ManualEntryFormData, ConditionLevel } from '../types/manualEntry';
import { useMakeModels } from '@/hooks/useMakeModels';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

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
  const [availableModels, setAvailableModels] = useState<any[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  // Find the selected make object to get its ID for model filtering
  const selectedMake = makes.find(make => make.make_name === formData.make);
  const selectedMakeId = selectedMake?.id;

  // Load models when make changes
  useEffect(() => {
    const loadModels = async () => {
      if (selectedMakeId) {
        setLoadingModels(true);
        try {
          const modelsList = await getModelsByMakeId(selectedMakeId);
          setAvailableModels(modelsList);
          
          // Reset model if current selection is not in the new list
          if (formData.model && !modelsList.some(m => m.model_name === formData.model)) {
            updateFormData({ model: '' });
          }
        } catch (error) {
          console.error('Error loading models:', error);
          setAvailableModels([]);
        } finally {
          setLoadingModels(false);
        }
      } else {
        setAvailableModels([]);
        if (formData.model) {
          updateFormData({ model: '' });
        }
      }
    };

    loadModels();
  }, [selectedMakeId, getModelsByMakeId, formData.model, updateFormData]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Make *</Label>
            <Skeleton className="h-10 w-full" />
          </div>
          <div>
            <Label>Model *</Label>
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-800 flex items-start gap-2">
        <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium">Failed to load vehicle data</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="make">Make *</Label>
          <Select
            value={formData.make}
            onValueChange={(value) => updateFormData({ make: value })}
          >
            <SelectTrigger className={errors.make ? 'border-red-500' : ''}>
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
          {errors.make && <p className="text-red-500 text-sm mt-1">{errors.make}</p>}
        </div>

        <div>
          <Label htmlFor="model">Model *</Label>
          <Select
            value={formData.model}
            onValueChange={(value) => updateFormData({ model: value })}
            disabled={!selectedMakeId || loadingModels}
          >
            <SelectTrigger className={errors.model ? 'border-red-500' : ''}>
              <SelectValue placeholder={
                !selectedMakeId 
                  ? "Select make first" 
                  : loadingModels 
                    ? "Loading models..." 
                    : "Select model"
              } />
            </SelectTrigger>
            <SelectContent>
              {availableModels.map(model => (
                <SelectItem key={model.id} value={model.model_name}>
                  {model.model_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
              <SelectItem value={ConditionLevel.VeryGood}>Very Good</SelectItem>
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
