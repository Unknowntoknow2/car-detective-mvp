
import React from "react";
import { DetailedConditionRating } from "@/components/premium/condition/DetailedConditionRating";

interface PremiumConditionSectionProps {
  formData: {
    exteriorCondition: number;
    interiorCondition: number;
    mechanicalCondition: number;
    tireCondition: number;
  };
  setFormData: (data: any) => void;
}

export function PremiumConditionSection({ formData, setFormData }: PremiumConditionSectionProps) {
  return (
    <div className="space-y-6">
      <DetailedConditionRating
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
}
