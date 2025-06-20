
import React from "react";
import { Label } from "@/components/ui/label";
import { FormValidationError } from "@/components/premium/common/FormValidationError";
import MakeAndModelSelector from "@/components/lookup/form-parts/MakeAndModelSelector";

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
  errors = {},
}: MakeModelSelectProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">Make</Label>
        <div>
          <MakeAndModelSelector
            makeId={selectedMakeId}
            setMakeId={setSelectedMakeId}
            modelId={selectedModel}
            setModelId={setSelectedModel}
          />
          {errors.make && <FormValidationError error={errors.make} />}
        </div>
      </div>
    </div>
  );
}
