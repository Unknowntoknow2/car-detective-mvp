
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EnhancedPlateLookupProps {
  plate: string;
  state: string;
  onPlateChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onLookup: () => void;
  isLoading: boolean;
  vehicle?: any;
}

interface PlateLookupTabProps {
  value: string;
  state: string;
  onPlateChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onLookup: () => void;
  isLoading: boolean;
  vehicle: any;
}

export function PlateLookupTab({ value, state, onPlateChange, onStateChange, onLookup, isLoading, vehicle }: PlateLookupTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">License Plate</label>
          <Input
            value={value}
            onChange={(e) => onPlateChange(e.target.value)}
            placeholder="Enter license plate"
          />
        </div>
        <div>
          <label className="text-sm font-medium">State</label>
          <Select value={state} onValueChange={onStateChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CA">California</SelectItem>
              <SelectItem value="TX">Texas</SelectItem>
              <SelectItem value="FL">Florida</SelectItem>
              <SelectItem value="NY">New York</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={onLookup} disabled={isLoading || !value || !state} className="w-full">
        {isLoading ? "Looking up..." : "Lookup Vehicle"}
      </Button>
      {vehicle && (
        <div className="mt-4 p-4 border rounded-md bg-gray-50">
          <p className="font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</p>
        </div>
      )}
    </div>
  );
}
