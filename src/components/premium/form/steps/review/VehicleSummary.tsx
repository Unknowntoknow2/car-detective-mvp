
import React from "react";
import { FormData } from "@/types/premium-valuation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VehicleSummaryProps {
  formData: FormData;
}

export function VehicleSummary({ formData }: VehicleSummaryProps) {
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
          {formData.trim && (
            <div>
              <span className="font-medium">Trim:</span> {formData.trim}
            </div>
          )}
          {formData.transmission && (
            <div>
              <span className="font-medium">Transmission:</span> {formData.transmission}
            </div>
          )}
          {formData.fuelType && (
            <div>
              <span className="font-medium">Fuel Type:</span> {formData.fuelType}
            </div>
          )}
          {formData.color && (
            <div>
              <span className="font-medium">Color:</span> {formData.color}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
