
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VehicleDetailsForm } from "./form-parts/VehicleDetailsForm";
import { AccidentDetailsForm, AccidentDetails } from "./form-parts/AccidentDetailsForm";
import { toast } from 'sonner';

interface ManualEntryTabProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export function ManualEntryTab({ onSubmit, isLoading }: ManualEntryTabProps) {
  const [vehicleDetails, setVehicleDetails] = useState({
    make: '',
    model: '',
    year: '',
    mileage: '',
    trim: '',
    zipCode: '',
    condition: 'good'
  });

  const [accidentDetails, setAccidentDetails] = useState<AccidentDetails>({
    hasAccident: false,
    accidentDescription: ''
  });

  const handleSubmit = () => {
    // Validation
    if (!vehicleDetails.make) {
      toast({
        description: "Please enter the vehicle make",
        variant: "destructive"
      });
      return;
    }
    
    if (!vehicleDetails.model) {
      toast({
        description: "Please enter the vehicle model",
        variant: "destructive"
      });
      return;
    }
    
    if (!vehicleDetails.year) {
      toast({
        description: "Please enter the vehicle year",
        variant: "destructive"
      });
      return;
    }
    
    if (!vehicleDetails.zipCode) {
      toast({
        description: "Please enter your ZIP code",
        variant: "destructive"
      });
      return;
    }

    // Combine data and submit
    const combinedData = {
      ...vehicleDetails,
      hasAccident: accidentDetails.hasAccident,
      accidentDescription: accidentDetails.accidentDescription,
      accidentSeverity: accidentDetails.severity
    };

    onSubmit(combinedData);
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <h3 className="text-lg font-semibold">Manual Vehicle Entry</h3>
        
        <VehicleDetailsForm 
          vehicleDetails={vehicleDetails}
          setVehicleDetails={setVehicleDetails}
        />
        
        <AccidentDetailsForm 
          accidentInfo={accidentDetails}
          setAccidentInfo={setAccidentDetails}
        />
        
        <div className="flex justify-end">
          <Button 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit Vehicle Details'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
