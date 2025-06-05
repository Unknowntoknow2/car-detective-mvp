
import React, { useEffect } from "react";
import { FormData } from "@/types/premium-valuation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DrivingBehaviorStepProps {
  step: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity: (step: number, isValid: boolean) => void;
}

export function DrivingBehaviorStep({
  step,
  formData,
  setFormData,
  updateValidity,
}: DrivingBehaviorStepProps) {
  useEffect(() => {
    const isValid = Boolean(formData.drivingType);
    updateValidity(step, isValid);
  }, [formData.drivingType, step, updateValidity]);

  const handleDrivingTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      drivingType: value,
    }));
  };

  const handleDrivingNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      drivingNotes: e.target.value,
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Driving Behavior
        </h2>
        <p className="text-gray-600 mb-6">
          Information about how the vehicle has been driven affects its valuation.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Primary Driving Type</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={formData.drivingType || ""}
            onValueChange={handleDrivingTypeChange}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="city" id="city" />
              <Label htmlFor="city">
                Mostly city driving (stop-and-go traffic)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="highway" id="highway" />
              <Label htmlFor="highway">
                Mostly highway driving (steady speeds)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mixed" id="mixed" />
              <Label htmlFor="mixed">
                Mixed city and highway driving
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rural" id="rural" />
              <Label htmlFor="rural">
                Rural/country driving
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Driving Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Label htmlFor="driving-notes">
              Additional details about vehicle usage (optional)
            </Label>
            <Textarea
              id="driving-notes"
              placeholder="e.g., gentle driving, aggressive driving, towing, commercial use..."
              value={formData.drivingNotes || ""}
              onChange={handleDrivingNotesChange}
              className="min-h-[80px]"
            />
            <p className="text-sm text-gray-500">
              Include any relevant information about how the vehicle was driven or used.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
