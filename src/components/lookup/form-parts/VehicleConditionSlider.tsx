
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface VehicleConditionSliderProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  className?: string;
}

export function VehicleConditionSlider({
  value,
  onChange,
  label = "Vehicle Condition",
  className
}: VehicleConditionSliderProps) {
  const handleValueChange = (values: number[]) => {
    onChange(values[0]);
  };

  const getConditionLabel = (value: number) => {
    if (value <= 20) return "Poor";
    if (value <= 40) return "Fair";
    if (value <= 60) return "Good";
    if (value <= 80) return "Very Good";
    return "Excellent";
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">{label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Current Rating</Label>
            <span className="text-sm font-medium">
              {getConditionLabel(value)} ({value}%)
            </span>
          </div>
          <Slider
            value={[value]}
            onValueChange={handleValueChange}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Poor</span>
            <span>Fair</span>
            <span>Good</span>
            <span>Very Good</span>
            <span>Excellent</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
