
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VEHICLE_MAKES, CONDITION_OPTIONS, FUEL_TYPES, TRANSMISSION_TYPES } from "@/lib/constants";
import { getModelsForMake, VEHICLE_YEARS } from "@/data/vehicle-data";
import { useManualValuation } from "@/hooks/useManualValuation";

interface ManualEntryFormProps {
  onVehicleFound: (vehicle: any) => void;
  tier?: "free" | "premium";
}

export function ManualEntryForm({ onVehicleFound, tier = "free" }: ManualEntryFormProps) {
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    mileage: "",
    condition: "",
    fuelType: "",
    transmission: "",
    zipCode: "",
  });

  const { submitManualValuation, isLoading, error } = useManualValuation();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMakeChange = (make: string) => {
    setFormData(prev => ({
      ...prev,
      make,
      model: "" // Reset model when make changes
    }));
  };

  const availableModels = formData.make ? getModelsForMake(formData.make) : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const vehicle = {
        make: formData.make,
        model: formData.model,
        year: parseInt(formData.year),
        mileage: parseInt(formData.mileage),
        condition: formData.condition,
        fuelType: formData.fuelType,
        transmission: formData.transmission,
        zipCode: formData.zipCode,
      };

      const result = await submitManualValuation(vehicle);
      if (result) {
        onVehicleFound(result);
      }
    } catch (err) {
      console.error('Manual valuation failed:', err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manual Vehicle Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="make">Make</Label>
              <Select value={formData.make} onValueChange={handleMakeChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select make" />
                </SelectTrigger>
                <SelectContent>
                  {VEHICLE_MAKES.map((make) => (
                    <SelectItem key={make} value={make}>
                      {make}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Select 
                value={formData.model} 
                onValueChange={(value) => handleInputChange("model", value)}
                disabled={!formData.make}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {availableModels.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Select value={formData.year} onValueChange={(value) => handleInputChange("year", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {VEHICLE_YEARS.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileage">Mileage</Label>
              <Input
                id="mileage"
                type="number"
                placeholder="Enter mileage"
                value={formData.mileage}
                onChange={(e) => handleInputChange("mileage", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Select value={formData.condition} onValueChange={(condition: string) => handleInputChange("condition", condition)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {CONDITION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuelType">Fuel Type</Label>
              <Select value={formData.fuelType} onValueChange={(fuel: string) => handleInputChange("fuelType", fuel)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  {FUEL_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transmission">Transmission</Label>
              <Select value={formData.transmission} onValueChange={(trans: string) => handleInputChange("transmission", trans)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select transmission" />
                </SelectTrigger>
                <SelectContent>
                  {TRANSMISSION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                type="text"
                placeholder="Enter ZIP code"
                value={formData.zipCode}
                onChange={(e) => handleInputChange("zipCode", e.target.value)}
                maxLength={5}
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Get Valuation"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
