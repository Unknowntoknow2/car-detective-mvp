
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Car, Check } from 'lucide-react';
import { useVehicleData } from '@/hooks/useVehicleData';
import { Combobox } from '@/components/ui/combobox';
import { FormValidationError } from '@/components/premium/common/FormValidationError';
import { Skeleton } from '@/components/ui/skeleton';

interface MakeModelSelectProps {
  selectedMakeId: string;
  setSelectedMakeId: (id: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  isDisabled?: boolean;
  errors?: Record<string, string>;
}

export function MakeModelSelect({
  selectedMakeId,
  setSelectedMakeId,
  selectedModel,
  setSelectedModel,
  isDisabled = false,
  errors = {}
}: MakeModelSelectProps) {
  const { makes, getModelsForMake, isLoading } = useVehicleData();
  const [models, setModels] = useState<Array<{ value: string; label: string }>>([]);
  const [selectedMakeName, setSelectedMakeName] = useState('');

  useEffect(() => {
    if (selectedMakeId && getModelsForMake) {
      const fetchedModels = getModelsForMake(selectedMakeId).map(model => ({
        value: model,
        label: model
      }));
      setModels(fetchedModels);
      
      // Find make name
      const make = makes?.find(m => m.value === selectedMakeId);
      if (make) {
        setSelectedMakeName(make.label);
      }
    } else {
      setModels([]);
    }
  }, [selectedMakeId, getModelsForMake, makes]);

  const handleMakeSelect = (value: string) => {
    setSelectedMakeId(value);
    setSelectedModel(''); // Reset model when make changes
  };

  const makeOptions = makes?.map(make => ({
    value: make.value,
    label: make.label
  })) || [];

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="make" className="text-sm font-medium text-slate-700">
          Make <span className="text-red-500">*</span>
        </Label>
        
        {isLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <>
            <Combobox
              id="make"
              options={makeOptions}
              value={selectedMakeId}
              onChange={handleMakeSelect}
              placeholder="Select make"
              emptyMessage="No makes found"
              disabled={isDisabled}
              className={errors.make ? 'border-red-300' : ''}
            />
            {errors.make && <FormValidationError error={errors.make} />}
          </>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="model" className="text-sm font-medium text-slate-700">
          Model <span className="text-red-500">*</span>
        </Label>
        
        {isLoading || (selectedMakeId && !models.length) ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <>
            <Combobox
              id="model"
              options={models}
              value={selectedModel}
              onChange={setSelectedModel}
              placeholder={
                selectedMakeId 
                  ? `Select ${selectedMakeName} model` 
                  : "Select make first"
              }
              emptyMessage={
                selectedMakeId 
                  ? `No models found for ${selectedMakeName}` 
                  : "Select a make first"
              }
              disabled={isDisabled || !selectedMakeId}
              className={errors.model ? 'border-red-300' : ''}
            />
            {errors.model && <FormValidationError error={errors.model} />}
          </>
        )}
      </div>
    </>
  );
}
