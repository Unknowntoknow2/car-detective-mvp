
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, Share } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

interface ValuationResultFreeProps {
  estimatedValue: number;
  confidenceScore: number;
  vehicleInfo: {
    year: number;
    make: string;
    model: string;
    mileage: number;
    condition: string;
  };
}

export function ValuationResultFree({
  estimatedValue,
  confidenceScore,
  vehicleInfo,
}: ValuationResultFreeProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-medium text-primary">Estimated Value</h3>
        <div className="mt-2 flex items-baseline">
          <span className="text-4xl font-bold text-primary">
            {formatCurrency(estimatedValue)}
          </span>
          <span className="ml-2 text-sm text-muted-foreground">
            {confidenceScore >= 80
              ? "High confidence"
              : confidenceScore >= 60
              ? "Medium confidence"
              : "Low confidence"}
          </span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Vehicle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Make:</span>
              <span>{vehicleInfo.make}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Model:</span>
              <span>{vehicleInfo.model}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Year:</span>
              <span>{vehicleInfo.year}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Mileage:</span>
              <span>{vehicleInfo.mileage.toLocaleString()} miles</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Condition:</span>
              <span className="capitalize">{vehicleInfo.condition}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" className="flex-1 gap-2">
          <Share className="h-4 w-4" />
          Share Result
        </Button>
        <Button variant="outline" className="flex-1 gap-2">
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
        <Button className="flex-1 gap-2">
          Get Premium Report
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default ValuationResultFree;
