
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Car, Check } from 'lucide-react';
import { useVehicleData } from '@/hooks/useVehicleData';
import { ComboBox } from '@/components/ui/combobox';
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
  const { makes, isLoading } = useVehicleData();
  const [models, setModels] = useState<Array<{ value: string; label: string }>>([]);
  const [selectedMakeName, setSelectedMakeName] = useState('');

  useEffect(() => {
    if (selectedMakeId && makes) {
      // Find the make in the list
      const make = makes.find(m => m.id === selectedMakeId);
      if (make) {
        setSelectedMakeName(make.make_name);
        
        // Fetch models for this make
        fetch(`/api/models?make_id=${selectedMakeId}`)
          .then(res => res.json())
          .then(data => {
            const fetchedModels = data.map((model: { model_name: string; id: string }) => ({
              value: model.model_name,
              label: model.model_name
            }));
            setModels(fetchedModels);
          })
          .catch(err => {
            console.error("Error fetching models:", err);
            setModels([]);
          });
      }
    } else {
      setModels([]);
    }
  }, [selectedMakeId, makes]);

  const handleMakeSelect = (value: string) => {
    setSelectedMakeId(value);
    setSelectedModel(''); // Reset model when make changes
  };

  // Transform makes data into the format expected by ComboBox
  const makeOptions = makes?.map(make => ({
    value: make.id,
    label: make.make_name
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
            <ComboBox
              id="make"
              items={makeOptions}
              value={selectedMakeId}
              onChange={handleMakeSelect}
              placeholder="Select make"
              emptyText="No makes found"
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
            <ComboBox
              id="model"
              items={models}
              value={selectedModel}
              onChange={setSelectedModel}
              placeholder={
                selectedMakeId 
                  ? `Select ${selectedMakeName} model` 
                  : "Select make first"
              }
              emptyText={
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
