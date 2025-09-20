
import React, { useEffect } from "react";
import { FormData } from "@/types/premium-valuation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface ConditionStepProps {
  step: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity: (step: number, isValid: boolean) => void;
}

export default function ConditionStep({
  step,
  formData,
  setFormData,
  updateValidity,
}: ConditionStepProps) {
  useEffect(() => {
    const isValid = formData.condition !== "";
    updateValidity(step, isValid);
  }, [formData.condition, step, updateValidity]);

  const handleConditionChange = (value: string) => {
    setFormData((prev: FormData) => ({
      ...prev,
      condition: value,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Condition</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Overall Condition</Label>
          <div className="mt-2">
            <Slider
              value={[parseInt(formData.condition) || 3]}
              max={5}
              min={1}
              step={1}
              onValueChange={(value: number[]) => handleConditionChange(value[0].toString())}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
