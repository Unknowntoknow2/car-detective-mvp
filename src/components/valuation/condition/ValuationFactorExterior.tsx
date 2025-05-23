
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface ValuationFactorExteriorProps {
  value: string;
  onChange: (value: string) => void;
}

export function ValuationFactorExterior({ value, onChange }: ValuationFactorExteriorProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Exterior Body Condition</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={value} 
          onValueChange={onChange}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="excellent" id="exterior-excellent" />
            <Label htmlFor="exterior-excellent">Excellent - No dents, dings or damage</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="good" id="exterior-good" />
            <Label htmlFor="exterior-good">Good - Minor dings, no major damage</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fair" id="exterior-fair" />
            <Label htmlFor="exterior-fair">Fair - Some dents or panel damage</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="poor" id="exterior-poor" />
            <Label htmlFor="exterior-poor">Poor - Significant body damage</Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
