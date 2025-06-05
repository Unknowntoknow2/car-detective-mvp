
import React from "react";
import { FormData } from "@/types/premium-valuation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VehicleDetailsFieldsProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export function VehicleDetailsFields({ formData, setFormData }: VehicleDetailsFieldsProps) {
  const handleTrimChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, trim: e.target.value }));
  };

  const handleTransmissionChange = (value: string) => {
    setFormData(prev => ({ ...prev, transmission: value }));
  };

  const handleFuelTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, fuelType: value }));
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, color: e.target.value }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="trim">Trim Level</Label>
        <Input
          id="trim"
          value={formData.trim || ""}
          onChange={handleTrimChange}
          placeholder="e.g., LE, EX, Sport"
        />
      </div>

      <div>
        <Label htmlFor="transmission">Transmission</Label>
        <Select onValueChange={handleTransmissionChange} value={formData.transmission || ""}>
          <SelectTrigger id="transmission">
            <SelectValue placeholder="Select transmission" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="automatic">Automatic</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
            <SelectItem value="cvt">CVT</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="fuel-type">Fuel Type</Label>
        <Select onValueChange={handleFuelTypeChange} value={formData.fuelType || ""}>
          <SelectTrigger id="fuel-type">
            <SelectValue placeholder="Select fuel type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gasoline">Gasoline</SelectItem>
            <SelectItem value="diesel">Diesel</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
            <SelectItem value="electric">Electric</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="color">Exterior Color</Label>
        <Input
          id="color"
          value={formData.color || ""}
          onChange={handleColorChange}
          placeholder="e.g., Silver, Black, White"
        />
      </div>
    </div>
  );
}
