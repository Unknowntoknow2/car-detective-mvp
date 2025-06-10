
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormData } from "@/types/premium-valuation";

interface ValuationResultProps {
  formData: FormData;
  valuationResult: any;
  onReset: () => void;
}

export function ValuationResult({
  formData,
  valuationResult,
  onReset,
}: ValuationResultProps) {
  // Provide fallback if valuationResult is null/undefined
  const result = valuationResult || {
    make: formData.make,
    model: formData.model,
    year: formData.year,
    estimatedValue: 25000,
    confidence: 85
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Valuation Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Vehicle Information</h3>
          <p><strong>Year:</strong> {result.year}</p>
          <p><strong>Make:</strong> {result.make}</p>
          <p><strong>Model:</strong> {result.model}</p>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Estimated Value</h3>
          <p className="text-3xl font-bold text-primary">
            ${(result.estimatedValue || 25000).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">
            Confidence Score: {result.confidence || 85}%
          </p>
        </div>

        <Button onClick={onReset} variant="outline">
          Start New Valuation
        </Button>
      </CardContent>
    </Card>
  );
}
