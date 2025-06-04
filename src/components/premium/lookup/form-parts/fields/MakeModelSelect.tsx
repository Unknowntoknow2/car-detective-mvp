<<<<<<< HEAD

import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useVehicleData } from '@/hooks/useVehicleData';
import { FormValidationError } from '@/components/premium/common/FormValidationError';
=======
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Car, Check } from "lucide-react";
import { useVehicleData } from "@/hooks/useVehicleData";
import { ComboBox } from "@/components/ui/combobox";
import { FormValidationError } from "@/components/premium/common/FormValidationError";
import { Skeleton } from "@/components/ui/skeleton";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

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
<<<<<<< HEAD
  isDisabled,
  errors = {}
}: MakeModelSelectProps) {
  const { makes, getModelsByMake } = useVehicleData();
  const [models, setModels] = useState<{ id: string; model_name: string }[]>([]);

  useEffect(() => {
    if (selectedMakeId) {
      const modelsList = getModelsByMake(selectedMakeId);
      setModels(modelsList);
=======
  isDisabled = false,
  errors = {},
}: MakeModelSelectProps) {
  const { makes, isLoading } = useVehicleData();
  const [models, setModels] = useState<Array<{ value: string; label: string }>>(
    [],
  );
  const [selectedMakeName, setSelectedMakeName] = useState("");

  useEffect(() => {
    if (selectedMakeId && makes) {
      // Find the make in the list
      const make = makes.find((m) => m.id === selectedMakeId);
      if (make) {
        setSelectedMakeName(make.make_name);

        // Fetch models for this make
        fetch(`/api/models?make_id=${selectedMakeId}`)
          .then((res) => res.json())
          .then((data) => {
            const fetchedModels = data.map((
              model: { model_name: string; id: string },
            ) => ({
              value: model.model_name,
              label: model.model_name,
            }));
            setModels(fetchedModels);
          })
          .catch((err) => {
            console.error("Error fetching models:", err);
            setModels([]);
          });
      }
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    } else {
      setModels([]);
    }
  }, [selectedMakeId, getModelsByMake]);

  const handleMakeChange = (value: string) => {
    setSelectedMakeId(value);
    setSelectedModel(""); // Reset model when make changes
  };

<<<<<<< HEAD
=======
  // Transform makes data into the format expected by ComboBox
  const makeOptions = makes?.map((make) => ({
    value: make.id,
    label: make.make_name,
  })) || [];

>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="make" className="text-sm font-medium text-slate-700">
          Make
        </Label>
<<<<<<< HEAD
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
=======

        {isLoading ? <Skeleton className="h-10 w-full" /> : (
          <>
            <ComboBox
              id="make"
              items={makeOptions}
              value={selectedMakeId}
              onChange={handleMakeSelect}
              placeholder="Select make"
              emptyText="No makes found"
              disabled={isDisabled}
              className={errors.make ? "border-red-300" : ""}
            />
            {errors.make && <FormValidationError error={errors.make} />}
          </>
        )}
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      </div>

      <div className="space-y-2">
        <Label htmlFor="model" className="text-sm font-medium text-slate-700">
          Model
        </Label>
<<<<<<< HEAD
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
=======

        {isLoading || (selectedMakeId && !models.length)
          ? <Skeleton className="h-10 w-full" />
          : (
            <>
              <ComboBox
                id="model"
                items={models}
                value={selectedModel}
                onChange={setSelectedModel}
                placeholder={selectedMakeId
                  ? `Select ${selectedMakeName} model`
                  : "Select make first"}
                emptyText={selectedMakeId
                  ? `No models found for ${selectedMakeName}`
                  : "Select a make first"}
                disabled={isDisabled || !selectedMakeId}
                className={errors.model ? "border-red-300" : ""}
              />
              {errors.model && <FormValidationError error={errors.model} />}
            </>
          )}
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      </div>
    </>
  );
}
