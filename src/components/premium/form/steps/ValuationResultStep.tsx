
import React from "react";
import { FormData } from "@/types/premium-valuation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ValuationResultStepProps {
  step: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity: (step: number, isValid: boolean) => void;
}

export function ValuationResultStep({
  step,
  formData,
  setFormData,
  updateValidity,
}: ValuationResultStepProps) {
  React.useEffect(() => {
    updateValidity(step, true);
  }, [step, updateValidity]);

  const estimatedValue = formData.valuation || 0;
  const confidenceScore = formData.confidenceScore || 85;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Valuation Complete
        </h2>
        <p className="text-gray-600 mb-6">
          Your vehicle valuation has been calculated based on the information provided.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Estimated Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              ${estimatedValue.toLocaleString()}
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-gray-500">Confidence Score:</span>
              <Badge variant="secondary">{confidenceScore}%</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Make:</span> {formData.make}
            </div>
            <div>
              <span className="font-medium">Model:</span> {formData.model}
            </div>
            <div>
              <span className="font-medium">Year:</span> {formData.year}
            </div>
            <div>
              <span className="font-medium">Mileage:</span> {formData.mileage?.toLocaleString()} miles
            </div>
            <div>
              <span className="font-medium">Condition:</span> {formData.condition}
            </div>
            <div>
              <span className="font-medium">Location:</span> {formData.zipCode}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
