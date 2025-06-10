
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

export interface DetailedConditionRatingProps {
  formData: {
    exteriorCondition: number;
    interiorCondition: number;
    mechanicalCondition: number;
    tireCondition: number;
  };
  setFormData: (data: any) => void;
}

export function DetailedConditionRating({ formData, setFormData }: DetailedConditionRatingProps) {
  const handleConditionChange = (value: number, category: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [`${category}Condition`]: value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Condition Assessment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Exterior Condition</label>
          <Slider
            value={[formData.exteriorCondition]}
            onValueChange={(value) => handleConditionChange(value[0], 'exterior')}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Poor</span>
            <span>Excellent</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Interior Condition</label>
          <Slider
            value={[formData.interiorCondition]}
            onValueChange={(value) => handleConditionChange(value[0], 'interior')}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Poor</span>
            <span>Excellent</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Mechanical Condition</label>
          <Slider
            value={[formData.mechanicalCondition]}
            onValueChange={(value) => handleConditionChange(value[0], 'mechanical')}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Poor</span>
            <span>Excellent</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tire Condition</label>
          <Slider
            value={[formData.tireCondition]}
            onValueChange={(value) => handleConditionChange(value[0], 'tire')}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Replace Soon</span>
            <span>Like New</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
