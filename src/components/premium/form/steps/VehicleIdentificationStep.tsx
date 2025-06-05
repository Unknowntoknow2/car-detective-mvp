
import React, { useEffect, useState } from "react";
import { FormData } from "@/types/premium-valuation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VehicleIdentificationStepProps {
  step: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity: (step: number, isValid: boolean) => void;
}

export function VehicleIdentificationStep({
  step,
  formData,
  setFormData,
  updateValidity,
}: VehicleIdentificationStepProps) {
  const [lookupMethod, setLookupMethod] = useState<"vin" | "plate" | "manual">("vin");

  useEffect(() => {
    let isValid = false;
    
    switch (lookupMethod) {
      case "vin":
        isValid = Boolean(formData.vin && formData.vin.length === 17);
        break;
      case "plate":
        isValid = Boolean(formData.plate && formData.stateCode);
        break;
      case "manual":
        isValid = Boolean(formData.make && formData.model && formData.year);
        break;
    }
    
    updateValidity(step, isValid);
  }, [formData, lookupMethod, step, updateValidity]);

  const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vin = e.target.value.toUpperCase();
    setFormData(prev => ({ ...prev, vin }));
  };

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const plate = e.target.value.toUpperCase();
    setFormData(prev => ({ ...prev, plate }));
  };

  const handleStateChange = (value: string) => {
    setFormData(prev => ({ ...prev, stateCode: value }));
  };

  const handleMakeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, make: e.target.value }));
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, model: e.target.value }));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const year = parseInt(e.target.value);
    setFormData(prev => ({ ...prev, year: isNaN(year) ? undefined : year }));
  };

  const states = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Vehicle Identification
        </h2>
        <p className="text-gray-600 mb-6">
          Choose how you'd like to identify your vehicle for valuation.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lookup Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button
              variant={lookupMethod === "vin" ? "default" : "outline"}
              onClick={() => setLookupMethod("vin")}
              size="sm"
            >
              VIN
            </Button>
            <Button
              variant={lookupMethod === "plate" ? "default" : "outline"}
              onClick={() => setLookupMethod("plate")}
              size="sm"
            >
              License Plate
            </Button>
            <Button
              variant={lookupMethod === "manual" ? "default" : "outline"}
              onClick={() => setLookupMethod("manual")}
              size="sm"
            >
              Manual Entry
            </Button>
          </div>

          {lookupMethod === "vin" && (
            <div>
              <Label htmlFor="vin">Vehicle Identification Number (VIN)</Label>
              <Input
                id="vin"
                value={formData.vin || ""}
                onChange={handleVinChange}
                placeholder="Enter 17-character VIN"
                maxLength={17}
              />
              <p className="text-sm text-gray-500 mt-1">
                VIN must be exactly 17 characters
              </p>
            </div>
          )}

          {lookupMethod === "plate" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="plate">License Plate</Label>
                <Input
                  id="plate"
                  value={formData.plate || ""}
                  onChange={handlePlateChange}
                  placeholder="Enter license plate"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Select onValueChange={handleStateChange} value={formData.stateCode || ""}>
                  <SelectTrigger id="state">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {lookupMethod === "manual" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="make">Make</Label>
                <Input
                  id="make"
                  value={formData.make || ""}
                  onChange={handleMakeChange}
                  placeholder="e.g., Toyota"
                />
              </div>
              <div>
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.model || ""}
                  onChange={handleModelChange}
                  placeholder="e.g., Camry"
                />
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year || ""}
                  onChange={handleYearChange}
                  placeholder="e.g., 2020"
                  min="1990"
                  max={new Date().getFullYear() + 1}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
