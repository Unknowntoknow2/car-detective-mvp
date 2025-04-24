
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DesignCard } from "@/components/ui/design-system";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Car, ShieldAlert, CheckCircle, AlertTriangle } from "lucide-react";

interface AccidentHistoryInputProps {
  hasAccidents: string;
  setHasAccidents: (value: string) => void;
  accidentCount: string;
  setAccidentCount: (value: string) => void;
  accidentSeverity: string;
  setAccidentSeverity: (value: string) => void;
  disabled?: boolean;
}

export const AccidentHistoryInput: React.FC<AccidentHistoryInputProps> = ({
  hasAccidents,
  setHasAccidents,
  accidentCount,
  setAccidentCount,
  accidentSeverity,
  setAccidentSeverity,
  disabled = false,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-primary" />
          Accident History
        </h3>

        <p className="text-sm text-text-secondary mb-4">
          Providing accurate accident information helps us deliver a more precise
          valuation. Accidents typically reduce a vehicle's value by 5-20%
          depending on severity.
        </p>

        <div className="flex items-center gap-6">
          <Label className="font-medium">
            Has this vehicle been in an accident?
          </Label>
          <RadioGroup
            value={hasAccidents}
            onValueChange={setHasAccidents}
            className="flex space-x-6"
            disabled={disabled}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no" />
              <Label htmlFor="no" className="font-normal">
                No
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes" />
              <Label htmlFor="yes" className="font-normal">
                Yes
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      {hasAccidents === "yes" ? (
        <DesignCard
          variant="outline"
          className="border-primary/20 bg-primary-light/10"
        >
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-warning mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Accident Details</h4>
                <p className="text-sm text-text-secondary mt-1">
                  Provide additional information about the accident(s) to improve
                  valuation accuracy.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accident-count">Number of Accidents</Label>
                <Select
                  value={accidentCount}
                  onValueChange={setAccidentCount}
                  disabled={disabled}
                >
                  <SelectTrigger id="accident-count">
                    <SelectValue placeholder="Select count" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4 or more</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accident-severity">Accident Severity</Label>
                <Select
                  value={accidentSeverity}
                  onValueChange={setAccidentSeverity}
                  disabled={disabled}
                >
                  <SelectTrigger id="accident-severity">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minor">Minor (cosmetic damage)</SelectItem>
                    <SelectItem value="moderate">
                      Moderate (repairable damage)
                    </SelectItem>
                    <SelectItem value="severe">
                      Severe (structural damage)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg text-sm text-text-secondary">
              <p className="flex items-center gap-2">
                <Car className="h-4 w-4 text-warning" />
                <span>
                  <strong>Value Impact:</strong> Based on your inputs, these
                  accidents could reduce your vehicle's value by approximately{" "}
                  {accidentCount && accidentSeverity
                    ? `${
                        parseInt(accidentCount) *
                        (accidentSeverity === "minor"
                          ? 3
                          : accidentSeverity === "moderate"
                          ? 7
                          : 12)
                      }%`
                    : "5-15%"}
                  .
                </span>
              </p>
            </div>
          </div>
        </DesignCard>
      ) : (
        <DesignCard
          variant="outline"
          className="border-success/20 bg-success-light/10"
        >
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-success mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium">No Accidents Reported</h4>
              <p className="text-sm text-text-secondary mt-1">
                Vehicles without accident history typically maintain higher
                resale value. Our premium report can verify this status through
                CARFAX® records.
              </p>
            </div>
          </div>
        </DesignCard>
      )}
    </div>
  );
};
