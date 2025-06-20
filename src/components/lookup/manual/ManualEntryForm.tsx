
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MakeAndModelSelector from "@/components/lookup/form-parts/MakeAndModelSelector";
import { ConditionSelectorSegmented } from "@/components/lookup/ConditionSelectorSegmented";
import { ZipCodeInput } from "@/components/common/ZipCodeInput";
import { toast } from "sonner";

interface ManualEntryFormProps {
  onSubmit?: (data: any) => void;
  isLoading?: boolean;
  tier?: "free" | "premium";
}

export function ManualEntryForm({ 
  onSubmit, 
  isLoading = false,
  tier = "free" 
}: ManualEntryFormProps) {
  const [makeId, setMakeId] = useState("");
  const [modelId, setModelId] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [mileage, setMileage] = useState("");
  const [condition, setCondition] = useState("good");
  const [zipCode, setZipCode] = useState("");
  const [vin, setVin] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!makeId || !modelId || !year || !mileage || !zipCode) {
      toast.error("Please fill in all required fields");
      return;
    }

    const formData = {
      makeId,
      modelId,
      year: Number(year),
      mileage: Number(mileage),
      condition,
      zipCode,
      vin: vin || undefined
    };

    console.log("Manual entry form submitted:", formData);
    onSubmit?.(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enter Vehicle Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* VIN Field (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="vin">VIN (Optional)</Label>
            <Input
              id="vin"
              value={vin}
              onChange={(e) => setVin(e.target.value.toUpperCase())}
              placeholder="Enter VIN if available"
              maxLength={17}
            />
          </div>

          {/* Make and Model Selector */}
          <div className="space-y-2">
            <Label>Make and Model</Label>
            <MakeAndModelSelector
              makeId={makeId}
              setMakeId={setMakeId}
              modelId={modelId}
              setModelId={setModelId}
            />
          </div>

          {/* Year and Mileage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value ? Number(e.target.value) : "")}
                placeholder="2020"
                min="1900"
                max={new Date().getFullYear() + 1}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileage">Mileage</Label>
              <Input
                id="mileage"
                type="number"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                placeholder="50,000"
                min="0"
              />
            </div>
          </div>

          {/* Condition */}
          <div className="space-y-2">
            <ConditionSelectorSegmented
              value={condition as any}
              onChange={(val) => setCondition(val as string)}
            />
          </div>

          {/* ZIP Code */}
          <div className="space-y-2">
            <Label>ZIP Code</Label>
            <ZipCodeInput
              value={zipCode}
              onChange={setZipCode}
              placeholder="Enter ZIP code"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Getting Valuation..." : "Get Valuation"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
