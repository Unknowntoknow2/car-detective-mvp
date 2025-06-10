
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormData } from "@/types/premium-valuation";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FeatureSelectionStepProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity: (isValid: boolean) => void;
}

export function FeatureSelectionStep({
  formData,
  setFormData,
  updateValidity,
}: FeatureSelectionStepProps) {
  const handlePackageLevelChange = (level: string) => {
    setFormData((prev: FormData) => ({
      ...prev,
      packageLevel: level
    }));
    updateValidity(true);
  };

  const packageOptions = [
    { value: "base", label: "Base Package" },
    { value: "premium", label: "Premium Package" },
    { value: "luxury", label: "Luxury Package" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Selection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-base font-medium">Package Level</Label>
          <div className="space-y-2 mt-2">
            {packageOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={option.value}
                  checked={formData.packageLevel === option.value}
                  onCheckedChange={() => handlePackageLevelChange(option.value)}
                />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
