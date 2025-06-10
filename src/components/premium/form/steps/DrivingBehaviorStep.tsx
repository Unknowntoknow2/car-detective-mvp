
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormData } from "@/types/premium-valuation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface DrivingBehaviorStepProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity: (isValid: boolean) => void;
}

export function DrivingBehaviorStep({
  formData,
  setFormData,
  updateValidity,
}: DrivingBehaviorStepProps) {
  const handleDrivingBehaviorChange = (newValue: string) => {
    setFormData((prev: FormData) => ({
      ...prev,
      drivingBehavior: newValue
    }));
    updateValidity(true);
  };

  const handleAnnualMileageChange = (value: string) => {
    setFormData((prev: FormData) => ({
      ...prev,
      annualMileage: parseInt(value)
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Driving Behavior</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">How would you describe your driving style?</h3>
          <RadioGroup
            value={formData.drivingBehavior || "normal"}
            onValueChange={handleDrivingBehaviorChange}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="conservative" id="conservative" />
              <Label htmlFor="conservative">Conservative - I drive carefully and avoid risks</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="normal" id="normal" />
              <Label htmlFor="normal">Normal - I drive like most people</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="aggressive" id="aggressive" />
              <Label htmlFor="aggressive">Aggressive - I drive fast and take risks</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Annual Mileage</h3>
          <p className="text-sm text-muted-foreground">
            How many miles do you drive per year on average?
          </p>
          
          <div className="space-y-2">
            <Input
              type="number"
              value={formData.annualMileage || 12000}
              onChange={(e) => handleAnnualMileageChange(e.target.value)}
              min={0}
              max={100000}
            />
            <Slider
              value={[formData.annualMileage || 12000]}
              min={0}
              max={50000}
              step={1000}
              onValueChange={(values: number[]) => handleAnnualMileageChange(values[0].toString())}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0 miles</span>
              <span>25,000 miles</span>
              <span>50,000 miles</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
