import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { VehicleDetailsForm } from './form-parts/VehicleDetailsForm';
import { AccidentDetailsForm } from './form-parts/AccidentDetailsForm';

interface ManualEntryTabProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export function ManualEntryTab({ onSubmit, isLoading }: ManualEntryTabProps) {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [mileage, setMileage] = useState('');
  const [condition, setCondition] = useState('');
  const [zipCode, setZipCode] = useState('');
	const [accidentDetails, setAccidentDetails] = useState({
    hasAccident: 'no',
    accidentDescription: ''
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();

    if (!make || !model || !year || !mileage || !condition || !zipCode) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    const manualData = {
      make,
      model,
      year,
      mileage,
      condition,
      zipCode,
			...accidentDetails
    };

    onSubmit(manualData);
  }, [make, model, year, mileage, condition, zipCode, onSubmit, accidentDetails, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manual Entry</CardTitle>
        <CardDescription>Enter vehicle details manually</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <VehicleDetailsForm
            make={make}
            setMake={setMake}
            model={model}
            setModel={setModel}
            year={year}
            setYear={setYear}
            mileage={mileage}
            setMileage={setMileage}
            condition={condition}
            setCondition={setCondition}
            zipCode={zipCode}
            setZipCode={setZipCode}
          />
					<AccidentDetailsForm
            onDetailsChange={setAccidentDetails}
            initialDetails={accidentDetails}
          />
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
