
import React from "react";
import { FormData } from "@/types/premium-valuation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VehicleDetailsFields } from "./VehicleDetailsFields";
import { AccidentHistorySection } from "./AccidentHistorySection";

interface VehicleDetailsFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export function VehicleDetailsForm({ formData, setFormData }: VehicleDetailsFormProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Specifications</CardTitle>
        </CardHeader>
        <CardContent>
          <VehicleDetailsFields formData={formData} setFormData={setFormData} />
        </CardContent>
      </Card>

      <AccidentHistorySection formData={formData} setFormData={setFormData} />
    </div>
  );
}
