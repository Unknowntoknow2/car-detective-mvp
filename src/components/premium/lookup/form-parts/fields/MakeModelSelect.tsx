
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

const carMakes = [
  { id: "acura", name: "Acura" },
  { id: "audi", name: "Audi" },
  { id: "bmw", name: "BMW" },
  { id: "chevrolet", name: "Chevrolet" },
  { id: "ford", name: "Ford" },
  { id: "honda", name: "Honda" },
  { id: "hyundai", name: "Hyundai" },
  { id: "mercedes", name: "Mercedes-Benz" },
  { id: "nissan", name: "Nissan" },
  { id: "toyota", name: "Toyota" },
];

const modelsByMake: Record<string, string[]> = {
  toyota: ["Camry", "Corolla", "RAV4", "Prius", "Highlander"],
  honda: ["Civic", "Accord", "CR-V", "Pilot", "Fit"],
  ford: ["F-150", "Escape", "Explorer", "Mustang", "Focus"],
  chevrolet: ["Silverado", "Equinox", "Malibu", "Tahoe", "Cruze"],
  nissan: ["Altima", "Sentra", "Rogue", "Pathfinder", "Maxima"],
  bmw: ["3 Series", "5 Series", "X3", "X5", "7 Series"],
  mercedes: ["C-Class", "E-Class", "S-Class", "GLC", "GLE"],
  audi: ["A3", "A4", "A6", "Q5", "Q7"],
  acura: ["TLX", "MDX", "RDX", "ILX", "NSX"],
  hyundai: ["Elantra", "Sonata", "Tucson", "Santa Fe", "Genesis"],
};

export function MakeModelSelect({
  selectedMakeId,
  setSelectedMakeId,
  selectedModel,
  setSelectedModel,
  isDisabled,
  errors = {},
}: MakeModelSelectProps) {
  const availableModels = selectedMakeId ? modelsByMake[selectedMakeId] || [] : [];

  const handleMakeChange = (makeId: string) => {
    setSelectedMakeId(makeId);
    setSelectedModel("");
  };

  return (
    <>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">Make</Label>
        <Select
          value={selectedMakeId}
          onValueChange={handleMakeChange}
          disabled={isDisabled}
        >
          <SelectTrigger className={`h-10 ${errors.make ? "border-red-300" : ""}`}>
            <SelectValue placeholder="Select make" />
          </SelectTrigger>
          <SelectContent>
            {carMakes.map((make) => (
              <SelectItem key={make.id} value={make.id}>
                {make.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.make && <FormValidationError error={errors.make} />}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">Model</Label>
        <Select
          value={selectedModel}
          onValueChange={setSelectedModel}
          disabled={isDisabled || !selectedMakeId}
        >
          <SelectTrigger className={`h-10 ${errors.model ? "border-red-300" : ""}`}>
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            {availableModels.map((model) => (
              <SelectItem key={model} value={model}>
                {model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.model && <FormValidationError error={errors.model} />}
      </div>
    </>
  );
}
