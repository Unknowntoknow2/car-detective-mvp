<<<<<<< HEAD

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ManualEntryForm } from "@/components/lookup/ManualEntryForm";
import { ManualEntryFormData } from "@/components/lookup/types/manualEntry";
=======
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AccidentDetails,
  ConditionLevel,
  ManualEntryFormData,
} from "@/components/lookup/types/manualEntry";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { VehicleDetailsInputs } from "@/components/lookup/form-parts/VehicleDetailsInputs";
import { ConditionAndFuelInputs } from "@/components/lookup/form-parts/ConditionAndFuelInputs";
import { ZipCodeInput } from "@/components/lookup/form-parts/ZipCodeInput";
import { PremiumFields } from "@/components/lookup/form-parts/PremiumFields";
import { AccidentDetailsForm } from "@/components/lookup/form-parts/AccidentDetailsForm";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface ManualEntryTabProps {
  isLoading: boolean;
  onSubmit: (data: ManualEntryFormData) => void;
}

<<<<<<< HEAD
export function ManualEntryTab({
  isLoading,
  onSubmit
}: ManualEntryTabProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <ManualEntryForm
          onSubmit={onSubmit}
          isLoading={isLoading}
          submitButtonText="Continue"
          isPremium={true}
        />
      </CardContent>
    </Card>
=======
export const ManualEntryTab: React.FC<ManualEntryTabProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  // Basic vehicle info
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [mileage, setMileage] = useState<number>(0);
  const [condition, setCondition] = useState<ConditionLevel>(
    ConditionLevel.Good,
  );
  const [zipCode, setZipCode] = useState("");

  // Additional details
  const [fuelType, setFuelType] = useState("Gasoline");
  const [transmission, setTransmission] = useState("Automatic");
  const [trim, setTrim] = useState("");
  const [color, setColor] = useState("");
  const [bodyType, setBodyType] = useState("");

  // Premium fields
  const [accidentDetails, setAccidentDetails] = useState<AccidentDetails>({
    hasAccident: false,
  });
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!make) {
      toast.error("Make is required");
      return;
    }

    if (!model) {
      toast.error("Model is required");
      return;
    }

    if (!zipCode) {
      toast.error("ZIP code is required");
      return;
    }

    // Create form data object
    const formData: ManualEntryFormData = {
      make,
      model,
      year,
      mileage,
      condition,
      zipCode,
      fuelType,
      transmission,
      trim,
      color,
      bodyType,
      accidentDetails,
      selectedFeatures,
      features: selectedFeatures, // Map selectedFeatures to features for compatibility
    };

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <VehicleDetailsInputs
        make={make}
        setMake={setMake}
        model={model}
        setModel={setModel}
        year={year}
        setYear={setYear}
        mileage={mileage}
        setMileage={setMileage}
        trim={trim}
        setTrim={setTrim}
        color={color}
        setColor={setColor}
      />

      <ConditionAndFuelInputs
        condition={condition}
        setCondition={setCondition}
        fuelType={fuelType}
        setFuelType={setFuelType}
        transmission={transmission}
        setTransmission={setTransmission}
      />

      <ZipCodeInput
        zipCode={zipCode}
        setZipCode={setZipCode}
      />

      <PremiumFields
        trim={trim}
        setTrim={setTrim}
        color={color}
        setColor={setColor}
        bodyType={bodyType}
        setBodyType={setBodyType}
        accidentDetails={accidentDetails}
        setAccidentDetails={setAccidentDetails}
        features={selectedFeatures}
        setFeatures={setSelectedFeatures}
      />

      {accidentDetails.hasAccident && (
        <AccidentDetailsForm
          accidentDetails={accidentDetails}
          setAccidentDetails={setAccidentDetails}
        />
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading
          ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          )
          : (
            "Submit Vehicle Details"
          )}
      </Button>
    </form>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  );
}
