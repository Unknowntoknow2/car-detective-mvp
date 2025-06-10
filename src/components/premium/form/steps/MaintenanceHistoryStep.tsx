import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormData } from "@/types/premium-valuation";

interface MaintenanceHistoryStepProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onNext: () => void;
  onBack: () => void;
}

export function MaintenanceHistoryStep({
  formData,
  setFormData,
  onNext,
  onBack,
}: MaintenanceHistoryStepProps) {
  const [maintenanceRecords, setMaintenanceRecords] = useState<any[]>([]);

  const handleHistoryChange = (newHistory: string) => {
    setFormData((prev: FormData) => ({
      ...prev,
      serviceHistory: newHistory
    }));
  };

  const handleMaintenanceChange = (hasRegular: boolean) => {
    setFormData((prev: FormData) => ({
      ...prev,
      hasRegularMaintenance: hasRegular
    }));
  };

  const handleNotesChange = (notes: string) => {
    setFormData((prev: FormData) => ({
      ...prev,
      maintenanceNotes: notes
    }));
  };

  const addMaintenanceRecord = (val: any) => {
    console.log("Adding maintenance record:", val);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="service-history">Service History</Label>
          <Input
            type="text"
            id="service-history"
            value={formData.serviceHistory || ""}
            onChange={(e) => handleHistoryChange(e.target.value)}
            placeholder="Enter service history"
          />
        </div>

        <div>
          <Label htmlFor="regular-maintenance">Regular Maintenance</Label>
          <select
            id="regular-maintenance"
            value={formData.hasRegularMaintenance !== null ? formData.hasRegularMaintenance.toString() : ""}
            onChange={(e) => handleMaintenanceChange(e.target.value === "true")}
            className="w-full border rounded-md py-2 px-3"
          >
            <option value="">Select</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        <div>
          <Label htmlFor="maintenance-notes">Maintenance Notes</Label>
          <Input
            type="text"
            id="maintenance-notes"
            value={formData.maintenanceNotes || ""}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Enter maintenance notes"
          />
        </div>

        <div>
          <Button onClick={() => addMaintenanceRecord(null)}>Add Maintenance Record</Button>
          {maintenanceRecords.map((record, index) => (
            <div key={index}>
              {/* Display maintenance record details */}
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext}>Next</Button>
        </div>
      </CardContent>
    </Card>
  );
}
