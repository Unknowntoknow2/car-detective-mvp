import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormData } from "@/types/premium-valuation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ConditionStepProps {
  step: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity: (step: number, isValid: boolean) => void;
}

export function ConditionStep({
  step,
  formData,
  setFormData,
  updateValidity,
}: ConditionStepProps) {
  useEffect(() => {
    const isValid = Boolean(formData.condition);
    updateValidity(step, isValid);
  }, [formData.condition, step, updateValidity]);

  const handleConditionChange = (value: string) => {
    setFormData((prev: FormData) => ({
      ...prev,
      condition: value,
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Vehicle Condition
        </h2>
        <p className="text-gray-600 mb-6">
          Please rate the overall condition of your vehicle. This significantly impacts the valuation.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overall Condition Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={formData.condition || ""}
            onValueChange={handleConditionChange}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="excellent" id="excellent" />
              <Label htmlFor="excellent" className="cursor-pointer">
                <div>
                  <div className="font-medium">Excellent</div>
                  <div className="text-sm text-gray-500">
                    Like new, no visible wear or damage
                  </div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="very-good" id="very-good" />
              <Label htmlFor="very-good" className="cursor-pointer">
                <div>
                  <div className="font-medium">Very Good</div>
                  <div className="text-sm text-gray-500">
                    Minor wear consistent with age, well maintained
                  </div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="good" id="good" />
              <Label htmlFor="good" className="cursor-pointer">
                <div>
                  <div className="font-medium">Good</div>
                  <div className="text-sm text-gray-500">
                    Normal wear for age, may have minor cosmetic issues
                  </div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fair" id="fair" />
              <Label htmlFor="fair" className="cursor-pointer">
                <div>
                  <div className="font-medium">Fair</div>
                  <div className="text-sm text-gray-500">
                    Noticeable wear, may need minor repairs
                  </div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="poor" id="poor" />
              <Label htmlFor="poor" className="cursor-pointer">
                <div>
                  <div className="font-medium">Poor</div>
                  <div className="text-sm text-gray-500">
                    Significant wear or damage, needs repairs
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
}
