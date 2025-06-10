
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormData } from "@/types/premium-valuation";

interface VehicleSummaryCardProps {
  formData: FormData;
}

export function VehicleSummaryCard({ formData }: VehicleSummaryCardProps) {
  return (
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
            <span className="font-medium">Condition:</span> {formData.conditionLabel || formData.condition}
          </div>
          <div>
            <span className="font-medium">Location:</span> {formData.zipCode}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
