
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface ValuationFactorTransmissionProps {
  value: string;
  onChange: (value: string) => void;
}

export function ValuationFactorTransmission({ value, onChange }: ValuationFactorTransmissionProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Transmission Condition</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={value} 
          onValueChange={onChange}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="excellent" id="transmission-excellent" />
            <Label htmlFor="transmission-excellent">Excellent - Shifts perfectly, no issues</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="good" id="transmission-good" />
            <Label htmlFor="transmission-good">Good - Shifts well, minor hesitation</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fair" id="transmission-fair" />
            <Label htmlFor="transmission-fair">Fair - Noticeable shift issues</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="poor" id="transmission-poor" />
            <Label htmlFor="transmission-poor">Poor - Major issues, needs repair</Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
