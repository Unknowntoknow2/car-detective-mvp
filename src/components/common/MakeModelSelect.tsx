<<<<<<< HEAD

import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Make, Model } from '@/hooks/useMakeModels';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
=======
import React, { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { VehicleMake, VehicleModel } from "@/hooks/useMakeModels";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface MakeModelSelectProps {
  makes: Make[];
  models: Model[];
  selectedMakeId: string;
  setSelectedMakeId: (makeId: string) => void;
  selectedModelId: string;
  setSelectedModelId: (modelId: string) => void;
  isLoading?: boolean;
  error?: string | null;
  isDisabled?: boolean;
}

export function MakeModelSelect({
  makes,
  models,
  selectedMakeId,
  setSelectedMakeId,
  selectedModelId,
  setSelectedModelId,
  isLoading = false,
<<<<<<< HEAD
  error = null,
  isDisabled = false
}: MakeModelSelectProps) {
  const handleMakeChange = (makeId: string) => {
    console.log('🎯 MakeModelSelect: Make changed to:', makeId);
    setSelectedMakeId(makeId);
  };

  const handleModelChange = (modelId: string) => {
    console.log('🎯 MakeModelSelect: Model changed to:', modelId);
    setSelectedModelId(modelId);
  };

  // Log when component renders with new props
  console.log('🎯 MakeModelSelect: Rendering with props:', {
    makesCount: makes.length,
    modelsCount: models.length,
    selectedMakeId,
    selectedModelId,
    isLoading,
    error
  });

  if (models.length > 0) {
    console.log('🎯 MakeModelSelect: Models available for display:', models.slice(0, 5).map(m => m.model_name));
  }

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
=======
}) => {
  console.log("MakeModelSelect render:", {
    selectedMakeId,
    selectedModelId,
    makesCount: makes.length,
    modelsCount: models.length,
  });

  // Filter models based on selected make
  const filteredModels = models.filter((model) =>
    model.make_id === selectedMakeId
  );
  console.log("Filtered models:", filteredModels, "makeId:", selectedMakeId);

  // Reset model selection when make changes
  useEffect(() => {
    if (selectedMakeId && selectedModelId) {
      const modelExists = filteredModels.some((model) =>
        model.id === selectedModelId
      );
      if (!modelExists) {
        console.log(
          "Resetting model selection because selected model is not in filtered list",
        );
        setSelectedModelId("");
      }
    }
  }, [selectedMakeId, filteredModels, selectedModelId, setSelectedModelId]);

  const handleMakeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMakeId = e.target.value;
    console.log("Make changed to:", newMakeId);
    setSelectedMakeId(newMakeId);
    // Always reset model selection when make changes
    setSelectedModelId("");
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newModelId = e.target.value;
    console.log("Model changed to:", newModelId);
    setSelectedModelId(newModelId);
  };

  if (isLoading) {
    return (
      <div className="flex space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Make
          </label>
          <Skeleton className="h-10 w-full rounded" />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Model
          </label>
          <Skeleton className="h-10 w-full rounded" />
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
        </div>
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="space-y-4">
      {/* Make Selector */}
      <div>
        <Label htmlFor="make" className="text-sm font-medium text-slate-700 mb-2 block">
          Make <span className="text-red-500">*</span>
        </Label>
        <Select
=======
    <div className="flex space-x-4">
      {/* Make Dropdown */}
      <div className="flex-1">
        <label
          htmlFor="make"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Make
        </label>
        <select
          id="make"
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
          value={selectedMakeId}
          onValueChange={handleMakeChange}
          disabled={isDisabled}
        >
<<<<<<< HEAD
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
=======
          <option value="">Select a make</option>
          {makes.map((make) => (
            <option key={make.id} value={make.id}>
              {make.make_name}
            </option>
          ))}
        </select>
      </div>

      {/* Model Dropdown */}
      <div className="flex-1">
        <label
          htmlFor="model"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Model
        </label>
        <select
          id="model"
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
          value={selectedModelId}
          onValueChange={handleModelChange}
          disabled={isDisabled || !selectedMakeId}
        >
<<<<<<< HEAD
          <SelectTrigger id="model" className="h-10">
            <SelectValue placeholder={
              !selectedMakeId 
                ? "Select make first" 
                : isLoading 
                  ? "Loading models..." 
                  : models.length === 0
                    ? "No models found"
                    : "Select model"
            } />
          </SelectTrigger>
          <SelectContent className="max-h-[300px] overflow-y-auto">
            {models.length === 0 && selectedMakeId && !isLoading ? (
              <div className="p-2 text-sm text-gray-500 text-center">
                No models found for selected make
              </div>
            ) : (
              models.map((model) => {
                console.log('🎯 Rendering model option:', model.model_name);
                return (
                  <SelectItem key={model.id} value={model.id}>
                    {model.model_name}
                  </SelectItem>
                );
              })
            )}
          </SelectContent>
        </Select>
        {selectedMakeId && models.length === 0 && !isLoading && (
          <p className="text-sm text-gray-500 mt-1">
            No models available for the selected make
          </p>
        )}
=======
          <option value="">
            {!selectedMakeId ? "Select Make First" : "Select Model"}
          </option>
          {filteredModels.map((model) => (
            <option key={model.id} value={model.id}>
              {model.model_name}
            </option>
          ))}
        </select>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      </div>
    </div>
  );
}

export default MakeModelSelect;
