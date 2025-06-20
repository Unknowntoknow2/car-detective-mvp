
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Define condition levels locally
export enum ConditionLevel {
  Poor = "Poor",
  Fair = "Fair",
  Good = "Good", 
  VeryGood = "Very Good",
  Excellent = "Excellent"
}

interface ConditionAndFuelInputsProps {
  condition: ConditionLevel;
  setCondition: (condition: ConditionLevel) => void;
  fuelType: string;
  setFuelType: (fuelType: string) => void;
  transmission: string;
  setTransmission: (transmission: string) => void;
}

export const ConditionAndFuelInputs: React.FC<ConditionAndFuelInputsProps> = ({
  condition,
  setCondition,
  fuelType,
  setFuelType,
  transmission,
  setTransmission,
}) => {
  const handleConditionChange = (value: string) => {
    switch (value) {
      case "Excellent":
        setCondition(ConditionLevel.Excellent);
        break;
      case "Good":
        setCondition(ConditionLevel.Good);
        break;
      case "Fair":
        setCondition(ConditionLevel.Fair);
        break;
      case "Poor":
        setCondition(ConditionLevel.Poor);
        break;
      default:
        setCondition(ConditionLevel.Good);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="condition">Condition</Label>
          <Select
            value={condition}
            onValueChange={handleConditionChange}
          >
            <SelectTrigger id="condition">
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ConditionLevel.Excellent}>
                Excellent
              </SelectItem>
              <SelectItem value={ConditionLevel.Good}>Good</SelectItem>
              <SelectItem value={ConditionLevel.Fair}>Fair</SelectItem>
              <SelectItem value={ConditionLevel.Poor}>Poor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fuelType">Fuel Type</Label>
          <Select
            value={fuelType}
            onValueChange={setFuelType}
          >
            <SelectTrigger id="fuelType">
              <SelectValue placeholder="Select fuel type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Gasoline">Gasoline</SelectItem>
              <SelectItem value="Diesel">Diesel</SelectItem>
              <SelectItem value="Electric">Electric</SelectItem>
              <SelectItem value="Hybrid">Hybrid</SelectItem>
              <SelectItem value="Plug-in Hybrid">Plug-in Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="transmission">Transmission</Label>
          <Select
            value={transmission}
            onValueChange={setTransmission}
          >
            <SelectTrigger id="transmission">
              <SelectValue placeholder="Select transmission" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Automatic">Automatic</SelectItem>
              <SelectItem value="Manual">Manual</SelectItem>
              <SelectItem value="CVT">CVT</SelectItem>
              <SelectItem value="Semi-Automatic">Semi-Automatic</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
