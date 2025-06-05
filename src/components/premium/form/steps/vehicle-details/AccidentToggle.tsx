
import React from "react";
import { FormData } from "@/types/premium-valuation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface AccidentToggleProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export function AccidentToggle({ formData, setFormData }: AccidentToggleProps) {
  const handleAccidentChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      accidentHistory: value === "yes"
    }));
  };

  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">
        Has this vehicle been in any accidents?
      </Label>
      <RadioGroup
        value={formData.accidentHistory === true ? "yes" : formData.accidentHistory === false ? "no" : ""}
        onValueChange={handleAccidentChange}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="no" id="no-accidents" />
          <Label htmlFor="no-accidents">No accidents</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="yes" id="has-accidents" />
          <Label htmlFor="has-accidents">Yes, has been in accidents</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
