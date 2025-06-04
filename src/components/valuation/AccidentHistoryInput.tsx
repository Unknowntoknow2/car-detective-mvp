<<<<<<< HEAD

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from '@/lib/utils';
=======
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
import { AlertTriangle, Car, CheckCircle, ShieldAlert } from "lucide-react";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface AccidentHistoryInputProps {
  accidents: {
    hasAccident: boolean;
    count?: number;
    severity?: string;
  };
  onAccidentChange: (accidents: {
    hasAccident: boolean;
    count?: number;
    severity?: string;
  }) => void;
}

export const AccidentHistoryInput: React.FC<AccidentHistoryInputProps> = ({
  accidents,
  onAccidentChange
}) => {
  const handleHasAccidentChange = (value: string | null) => {
    const hasAccident = value === 'yes';
    onAccidentChange({
      hasAccident,
      count: hasAccident ? accidents.count : undefined,
      severity: hasAccident ? accidents.severity : undefined,
    });
  };

  const handleAccidentCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value);
    onAccidentChange({
      hasAccident: accidents.hasAccident,
      count: isNaN(count) ? undefined : count,
      severity: accidents.severity,
    });
  };

  const handleAccidentSeverityChange = (value: string) => {
    onAccidentChange({
      hasAccident: accidents.hasAccident,
      count: accidents.count,
      severity: value,
    });
  };

  return (
<<<<<<< HEAD
    <>
      <Card className="p-4 space-y-3">
        <CardHeader>
          <CardTitle>Accident History</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="has-accident">Has the vehicle been in any accidents?</Label>
            <RadioGroup defaultValue={accidents.hasAccident ? 'yes' : 'no'} onValueChange={handleHasAccidentChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="r1" className="peer h-4 w-4 shrink-0 rounded-full border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
                <Label htmlFor="r1" className="cursor-pointer peer-data-[state=checked]:text-primary">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="r2" className="peer h-4 w-4 shrink-0 rounded-full border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
                <Label htmlFor="r2" className="cursor-pointer peer-data-[state=checked]:text-primary">No</Label>
              </div>
            </RadioGroup>
          </div>

          {accidents.hasAccident && (
            <>
              <div className="space-y-2">
                <Label htmlFor="accident-count">Number of Accidents</Label>
                <Input
                  id="accident-count"
                  type="number"
                  placeholder="Enter number of accidents"
                  value={accidents.count || ''}
                  onChange={handleAccidentCountChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accident-severity">Accident Severity</Label>
                <Select onValueChange={handleAccidentSeverityChange} defaultValue={accidents.severity || ''}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minor">Minor</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="severe">Severe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="p-4 space-y-3">
        <CardHeader>
          <CardTitle>Title Transfer</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="has-title-issue">Does the vehicle have any title issues (e.g., salvage, flood, rebuilt)?</Label>
            <RadioGroup>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="ti1" className="peer h-4 w-4 shrink-0 rounded-full border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
                <Label htmlFor="ti1" className="cursor-pointer peer-data-[state=checked]:text-primary">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="ti2" className="peer h-4 w-4 shrink-0 rounded-full border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
                <Label htmlFor="ti2" className="cursor-pointer peer-data-[state=checked]:text-primary">No</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </>
=======
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-primary" />
          Accident History
        </h3>

        <p className="text-sm text-text-secondary mb-4">
          Providing accurate accident information helps us deliver a more
          precise valuation. Accidents typically reduce a vehicle's value by
          5-20% depending on severity.
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

      {hasAccidents === "yes"
        ? (
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
                    Provide additional information about the accident(s) to
                    improve valuation accuracy.
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
                      <SelectItem value="minor">
                        Minor (cosmetic damage)
                      </SelectItem>
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
                    <strong>Value Impact:</strong>{" "}
                    Based on your inputs, these accidents could reduce your
                    vehicle's value by approximately{" "}
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
        )
        : (
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
                  resale value. Our premium report can verify this status
                  through CARFAX® records.
                </p>
              </div>
            </div>
          </DesignCard>
        )}
    </div>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  );
};
