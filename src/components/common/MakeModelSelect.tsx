
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Make, Model } from '@/hooks/types/vehicle';

interface MakeModelSelectProps {
  makes: Make[];
  models: Model[];
  selectedMakeId: string;
  setSelectedMakeId: (id: string) => void;
  selectedModelId: string;
  setSelectedModelId: (id: string) => void;
  isLoading: boolean;
  error: string | null;
  isDisabled?: boolean;
}

export function MakeModelSelect({ 
  makes, 
  models, 
  selectedMakeId, 
  setSelectedMakeId, 
  selectedModelId, 
  setSelectedModelId, 
  isLoading, 
  error, 
  isDisabled = false 
}: MakeModelSelectProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="make">Make</Label>
        <Select value={selectedMakeId} onValueChange={setSelectedMakeId} disabled={isDisabled || isLoading}>
          <SelectTrigger>
            <SelectValue placeholder="Select make" />
          </SelectTrigger>
          <SelectContent>
            {makes.map((make) => (
              <SelectItem key={make.id} value={make.id}>
                {make.make_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="model">Model</Label>
        <Select value={selectedModelId} onValueChange={setSelectedModelId} disabled={isDisabled || isLoading || !selectedMakeId}>
          <SelectTrigger>
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            {models.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.model_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {error && (
        <div className="col-span-2 text-red-500 text-sm">{error}</div>
      )}
    </div>
  );
}

export default MakeModelSelect;
