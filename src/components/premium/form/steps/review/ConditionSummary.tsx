
import React from "react";
import { FormData } from "@/types/premium-valuation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ConditionSummaryProps {
  formData: FormData;
}

export function ConditionSummary({ formData }: ConditionSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Condition Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Overall Condition:</span>
            <Badge variant="secondary">{formData.condition}</Badge>
          </div>
          
          {formData.mileage && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Mileage:</span>
              <span className="text-sm">{formData.mileage.toLocaleString()} miles</span>
            </div>
          )}
          
          {formData.accidentHistory !== undefined && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Accident History:</span>
              <Badge variant={formData.accidentHistory ? "destructive" : "secondary"}>
                {formData.accidentHistory ? "Yes" : "No"}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
