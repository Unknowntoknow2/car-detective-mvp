
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VehicleDetailsInputsProps {
  mileage: string;
  setMileage: (value: string) => void;
  zipCode: string;
  setZipCode: (value: string) => void;
  trim?: string;
  setTrim?: (value: string) => void;
  transmission?: string;
  setTransmission?: (value: string) => void;
  fuelType?: string;
  setFuelType?: (value: string) => void;
}

export const VehicleDetailsInputs: React.FC<VehicleDetailsInputsProps> = ({
  mileage,
  setMileage,
  zipCode,
  setZipCode,
  trim,
  setTrim,
  transmission,
  setTransmission,
  fuelType,
  setFuelType,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="mileage">Mileage</Label>
          <Input
            id="mileage"
            type="number"
            placeholder="Enter mileage"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            id="zipCode"
            type="text"
            placeholder="Enter ZIP code"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            maxLength={5}
          />
        </div>
      </div>

      {(trim !== undefined || transmission !== undefined || fuelType !== undefined) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trim !== undefined && setTrim && (
            <div className="space-y-2">
              <Label htmlFor="trim">Trim (Optional)</Label>
              <Input
                id="trim"
                type="text"
                placeholder="e.g., LE, Sport"
                value={trim}
                onChange={(e) => setTrim(e.target.value)}
              />
            </div>
          )}

          {transmission !== undefined && setTransmission && (
            <div className="space-y-2">
              <Label htmlFor="transmission">Transmission</Label>
              <Select value={transmission} onValueChange={setTransmission}>
                <SelectTrigger id="transmission">
                  <SelectValue placeholder="Select transmission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Automatic">Automatic</SelectItem>
                  <SelectItem value="Manual">Manual</SelectItem>
                  <SelectItem value="CVT">CVT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {fuelType !== undefined && setFuelType && (
            <div className="space-y-2">
              <Label htmlFor="fuelType">Fuel Type</Label>
              <Select value={fuelType} onValueChange={setFuelType}>
                <SelectTrigger id="fuelType">
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Gasoline">Gasoline</SelectItem>
                  <SelectItem value="Diesel">Diesel</SelectItem>
                  <SelectItem value="Electric">Electric</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
