
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VehicleMake, VehicleModel } from '@/hooks/useMakeModels';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

interface MakeModelSelectProps {
  makes: VehicleMake[];
  models: VehicleModel[];
  selectedMakeId: string;
  setSelectedMakeId: (makeId: string) => void;
  selectedModelId: string;
  setSelectedModelId: (modelId: string) => void;
  isLoading?: boolean;
  error?: string | null;
  onMakeChange?: (makeId: string) => void;
}

export function MakeModelSelect({
  makes,
  models,
  selectedMakeId,
  setSelectedMakeId,
  selectedModelId,
  setSelectedModelId,
  isLoading = false,
  error = null,
  onMakeChange
}: MakeModelSelectProps) {
  const handleMakeChange = (makeId: string) => {
    setSelectedMakeId(makeId);
    setSelectedModelId(''); // Reset model selection
    if (onMakeChange) {
      onMakeChange(makeId);
    }
  };

  if (isLoading && makes.length === 0) {
    return (
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-slate-700 mb-2 block">Make</Label>
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Label className="text-sm font-medium text-slate-700 mb-2 block">Model</Label>
          <Skeleton className="h-10 w-full" />
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
    <div className="space-y-4">
      {/* Make Selector */}
      <div>
        <Label htmlFor="make" className="text-sm font-medium text-slate-700 mb-2 block">
          Make <span className="text-red-500">*</span>
        </Label>
        <Select
          value={selectedMakeId}
          onValueChange={handleMakeChange}
        >
          <SelectTrigger id="make" className="h-10">
            <SelectValue placeholder="Select make" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px] overflow-y-auto">
            {makes.map((make) => (
              <SelectItem key={make.id} value={make.id}>
                {make.make_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Model Selector */}
      <div>
        <Label htmlFor="model" className="text-sm font-medium text-slate-700 mb-2 block">
          Model <span className="text-red-500">*</span>
        </Label>
        <Select
          value={selectedModelId}
          onValueChange={setSelectedModelId}
          disabled={!selectedMakeId}
        >
          <SelectTrigger id="model" className="h-10">
            <SelectValue placeholder={
              !selectedMakeId 
                ? "Select make first" 
                : isLoading 
                  ? "Loading models..." 
                  : "Select model"
            } />
          </SelectTrigger>
          <SelectContent className="max-h-[300px] overflow-y-auto">
            {models.length === 0 && selectedMakeId && !isLoading ? (
              <div className="p-2 text-sm text-gray-500 text-center">
                No models found for selected make
              </div>
            ) : (
              models.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.model_name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {selectedMakeId && models.length === 0 && !isLoading && (
          <p className="text-sm text-gray-500 mt-1">
            No models available for the selected make
          </p>
        )}
      </div>
    </div>
  );
}

export default MakeModelSelect;
