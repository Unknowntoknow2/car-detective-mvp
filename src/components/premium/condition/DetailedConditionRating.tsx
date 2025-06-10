import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { FormData } from "@/types/premium-valuation";

interface DetailedConditionRatingProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export const DetailedConditionRating = ({ formData, setFormData }: DetailedConditionRatingProps) => {
  const conditionCategories = [
    "exterior",
    "interior",
    "mechanical",
    "tires",
  ];

  const handleConditionChange = (category: string, value: any) => {
    setFormData((prev: FormData) => ({
      ...prev,
      conditionRatings: {
        ...prev.conditionRatings,
        [category]: value,
      },
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Condition Rating</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {conditionCategories.map((category) => (
          <div key={category} className="space-y-2">
            <Label>{`${category.charAt(0).toUpperCase() + category.slice(1)} Condition`}</Label>
            <Slider
              defaultValue={[3]}
              max={5}
              min={1}
              step={1}
              onValueChange={(value) => handleConditionChange(category, value[0])}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
