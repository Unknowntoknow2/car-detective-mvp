<<<<<<< HEAD

import React, { useEffect } from 'react';
import { FormData } from '@/types/premium-valuation';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Car, Activity, Coffee } from 'lucide-react';
=======
import React from "react";
import { FormData } from "@/types/premium-valuation";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Car, Gauge, ShieldCheck } from "lucide-react";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface DrivingBehaviorStepProps {
  step: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity: (step: number, isValid: boolean) => void;
}

export function DrivingBehaviorStep({
  step,
  formData,
  setFormData,
  updateValidity,
}: DrivingBehaviorStepProps) {
  // Set default value if not present
  useEffect(() => {
    if (!formData.drivingProfile) {
<<<<<<< HEAD
      setFormData(prev => ({ ...prev, drivingProfile: 'average' }));
    }
    
    // This step is always valid as we set a default value
    updateValidity(step, true);
  }, [step, formData.drivingProfile, setFormData, updateValidity]);

  const handleDrivingProfileChange = (value: 'light' | 'average' | 'heavy') => {
    setFormData(prev => ({ ...prev, drivingProfile: value }));
=======
      setFormData((prev) => ({
        ...prev,
        drivingProfile: "average", // Changed from "Normal" to "average" to match the type
      }));
    }

    // This step is always valid since we have defaults
    updateValidity(step, true);
  }, [step, formData.drivingProfile, setFormData, updateValidity]);

  const handleDrivingProfileChange = (value: string) => {
    // Ensure we're only setting allowed values
    let validValue = value;
    if (value !== "light" && value !== "average" && value !== "heavy") {
      validValue = "average"; // Default to average if not a valid option
    }

    setFormData((prev) => ({
      ...prev,
      drivingProfile: validValue as "light" | "average" | "heavy",
    }));
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  };

  return (
    <div className="space-y-6">
      <div>
<<<<<<< HEAD
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Driving Behavior</h2>
        <p className="text-gray-600 mb-6">
          Tell us about your driving habits to help refine your valuation estimate.
        </p>
      </div>

      <div className="space-y-6">
        <RadioGroup 
          value={formData.drivingProfile || 'average'} 
          onValueChange={(val) => handleDrivingProfileChange(val as 'light' | 'average' | 'heavy')}
          className="grid grid-cols-1 gap-4 pt-2"
        >
          <div className="flex items-start space-x-2 border p-4 rounded-md hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="light" id="light" className="mt-1" />
            <div className="flex-grow">
              <Label htmlFor="light" className="flex items-center text-base font-medium cursor-pointer">
                <Coffee className="h-5 w-5 mr-2 text-blue-500" />
                Light Usage
              </Label>
              <p className="text-sm text-gray-500 mt-1">
                Weekends and occasional use. Less than 8,000 miles per year.
=======
        <h2 className="text-xl font-semibold mb-2">Driving Behavior</h2>
        <p className="text-muted-foreground">
          Your driving habits can affect vehicle wear and tear, which impacts
          its value. Select the option that best describes your driving style.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <RadioGroup
            value={formData.drivingProfile}
            onValueChange={handleDrivingProfileChange}
            className="space-y-4"
          >
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="light" id="careful" className="mt-1" />
              <div className="grid gap-1.5">
                <Label
                  htmlFor="careful"
                  className="font-medium flex items-center"
                >
                  <ShieldCheck className="h-4 w-4 text-blue-500 mr-2" />
                  Careful Driver
                </Label>
                <p className="text-sm text-muted-foreground">
                  I drive cautiously, avoid hard braking, and rarely exceed
                  speed limits. I maintain consistent speeds and avoid rapid
                  acceleration.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <RadioGroupItem value="average" id="normal" className="mt-1" />
              <div className="grid gap-1.5">
                <Label
                  htmlFor="normal"
                  className="font-medium flex items-center"
                >
                  <Car className="h-4 w-4 text-green-500 mr-2" />
                  Average Driver
                </Label>
                <p className="text-sm text-muted-foreground">
                  I drive normally, sometimes in city traffic and sometimes on
                  highways. I occasionally accelerate quickly but generally
                  maintain moderate driving habits.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <RadioGroupItem value="heavy" id="spirited" className="mt-1" />
              <div className="grid gap-1.5">
                <Label
                  htmlFor="spirited"
                  className="font-medium flex items-center"
                >
                  <Gauge className="h-4 w-4 text-amber-500 mr-2" />
                  Spirited Driver
                </Label>
                <p className="text-sm text-muted-foreground">
                  I enjoy driving dynamically, with frequent acceleration and
                  higher speeds when conditions allow. I may drive more
                  aggressively in traffic situations.
                </p>
              </div>
            </div>
          </RadioGroup>

          <div className="mt-6 pt-6 border-t">
            <h3 className="text-sm font-medium mb-2">
              How This Affects Your Vehicle's Value
            </h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                <span className="font-medium">Careful driving</span>: May reduce
                wear on brakes, transmission, and engine components, potentially
                increasing vehicle value by 2-5%.
              </p>
              <p>
                <span className="font-medium">Average driving</span>: Reflects
                typical usage patterns and has a neutral impact on valuation.
              </p>
              <p>
                <span className="font-medium">Spirited driving</span>: Can lead
                to increased wear on drivetrain components and may reduce
                vehicle value by 1-3%.
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2 border p-4 rounded-md hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="average" id="average" className="mt-1" />
            <div className="flex-grow">
              <Label htmlFor="average" className="flex items-center text-base font-medium cursor-pointer">
                <Car className="h-5 w-5 mr-2 text-green-500" />
                Average Usage
              </Label>
              <p className="text-sm text-gray-500 mt-1">
                Daily commuting and regular trips. Between 8,000-15,000 miles per year.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2 border p-4 rounded-md hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="heavy" id="heavy" className="mt-1" />
            <div className="flex-grow">
              <Label htmlFor="heavy" className="flex items-center text-base font-medium cursor-pointer">
                <Activity className="h-5 w-5 mr-2 text-red-500" />
                Heavy Usage
              </Label>
              <p className="text-sm text-gray-500 mt-1">
                Long commutes, frequent road trips, or commercial use. More than 15,000 miles per year.
              </p>
            </div>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
