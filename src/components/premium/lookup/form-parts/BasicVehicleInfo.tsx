
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MakeAndModelSelector } from "@/components/lookup/form-parts/MakeAndModelSelector";
import { YearMileageInputs } from "@/components/premium/lookup/form-parts/fields/YearMileageInputs";

interface BasicVehicleInfoProps {
  selectedMakeId: string;
  setSelectedMakeId: (id: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  selectedYear: number | "";
  setSelectedYear: (year: number | "") => void;
  mileage: string;
  setMileage: (mileage: string) => void;
  isDisabled?: boolean;
  errors?: Record<string, string>;
}

export function BasicVehicleInfo({
  selectedMakeId,
  setSelectedMakeId,
  selectedModel,
  setSelectedModel,
  selectedYear,
  setSelectedYear,
  mileage,
  setMileage,
  isDisabled,
  errors = {},
}: BasicVehicleInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MakeAndModelSelector
            makeId={selectedMakeId}
            setMakeId={setSelectedMakeId}
            modelId={selectedModel}
            setModelId={setSelectedModel}
            isDisabled={isDisabled}
            errors={errors}
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <YearMileageInputs
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            mileage={mileage}
            setMileage={setMileage}
            isDisabled={isDisabled}
            errors={errors}
          />
        </div>
      </CardContent>
    </Card>
  );
}
