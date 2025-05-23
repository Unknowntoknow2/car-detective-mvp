
import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useVehicleData } from '@/hooks/useVehicleData';
import { FormValidationError } from '@/components/premium/common/FormValidationError';

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
  isDisabled,
  errors = {}
}: MakeModelSelectProps) {
  const { makes, getModelsByMake } = useVehicleData();
  const [models, setModels] = useState<{ id: string; model_name: string }[]>([]);

  useEffect(() => {
    if (selectedMakeId) {
      const modelsList = getModelsByMake(selectedMakeId);
      setModels(modelsList);
    } else {
      setModels([]);
    }
  }, [selectedMakeId, getModelsByMake]);

  const handleMakeChange = (value: string) => {
    setSelectedMakeId(value);
    setSelectedModel(''); // Reset model when make changes
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="make" className="text-sm font-medium text-slate-700">
          Make
        </Label>
        <Select
          value={selectedMakeId}
          onValueChange={handleMakeChange}
          disabled={isDisabled}
        >
          <SelectTrigger 
            id="make"
            className={`h-10 transition-all duration-200 ${errors.make ? 'border-red-300 focus:ring-red-200' : 'focus:ring-primary/20 focus:border-primary hover:border-primary/30'}`}
          >
            <SelectValue placeholder="Select make" />
          </SelectTrigger>
          <SelectContent>
            {makes.map(make => (
              <SelectItem key={make.id} value={make.id}>
                {make.make_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.make && <FormValidationError error={errors.make} />}
      </div>

      <div className="space-y-2">
        <Label htmlFor="model" className="text-sm font-medium text-slate-700">
          Model
        </Label>
        <Select
          value={selectedModel}
          onValueChange={setSelectedModel}
          disabled={isDisabled || !selectedMakeId || models.length === 0}
        >
          <SelectTrigger 
            id="model"
            className={`h-10 transition-all duration-200 ${errors.model ? 'border-red-300 focus:ring-red-200' : 'focus:ring-primary/20 focus:border-primary hover:border-primary/30'}`}
          >
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            {models.map(model => (
              <SelectItem key={model.id} value={model.model_name}>
                {model.model_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.model && <FormValidationError error={errors.model} />}
      </div>
    </>
  );
}
