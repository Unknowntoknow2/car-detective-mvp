
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FormValidationError } from "@/components/premium/common/FormValidationError";

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
  errors = {},
}: MakeModelSelectProps) {
  // Mock data for makes and models
  const makes = [
    { id: "1", name: "Toyota" },
    { id: "2", name: "Honda" },
    { id: "3", name: "Ford" },
    { id: "4", name: "Chevrolet" },
    { id: "5", name: "BMW" },
  ];

  const models = [
    { id: "1", name: "Camry", makeId: "1" },
    { id: "2", name: "Corolla", makeId: "1" },
    { id: "3", name: "Civic", makeId: "2" },
    { id: "4", name: "Accord", makeId: "2" },
    { id: "5", name: "F-150", makeId: "3" },
  ];

  const filteredModels = models.filter(model => model.makeId === selectedMakeId);

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="make" className="text-sm font-medium text-slate-700">
          Make
        </Label>
        <Select value={selectedMakeId} onValueChange={setSelectedMakeId} disabled={isDisabled}>
          <SelectTrigger
            className={`h-10 transition-all duration-200 ${
              errors.make
                ? "border-red-300 focus:ring-red-200"
                : "focus:ring-primary/20 focus:border-primary hover:border-primary/30"
            }`}
          >
            <SelectValue placeholder="Select make" />
          </SelectTrigger>
          <SelectContent>
            {makes.map((make) => (
              <SelectItem key={make.id} value={make.id}>
                {make.name}
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
          disabled={isDisabled || !selectedMakeId}
        >
          <SelectTrigger
            className={`h-10 transition-all duration-200 ${
              errors.model
                ? "border-red-300 focus:ring-red-200"
                : "focus:ring-primary/20 focus:border-primary hover:border-primary/30"
            }`}
          >
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            {filteredModels.map((model) => (
              <SelectItem key={model.id} value={model.name}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.model && <FormValidationError error={errors.model} />}
      </div>
    </>
  );
}
