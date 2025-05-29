
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMakeModels } from '@/hooks/useMakeModels';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

interface MakeModelSelectorProps {
  selectedMakeId: string;
  selectedModelId: string;
  onMakeChange: (makeId: string) => void;
  onModelChange: (modelId: string) => void;
  disabled?: boolean;
}

export function MakeModelSelector({
  selectedMakeId,
  selectedModelId,
  onMakeChange,
  onModelChange,
  disabled = false
}: MakeModelSelectorProps) {
  const { makes, models, isLoading, error, fetchModelsByMakeId } = useMakeModels();
  
  // Fetch models when make changes
  useEffect(() => {
    if (selectedMakeId) {
      fetchModelsByMakeId(selectedMakeId);
    }
  }, [selectedMakeId, fetchModelsByMakeId]);

  const handleMakeChange = (makeId: string) => {
    onMakeChange(makeId);
    // Reset model selection when make changes
    onModelChange('');
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
          disabled={disabled}
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
          onValueChange={onModelChange}
          disabled={disabled || !selectedMakeId}
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
