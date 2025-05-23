
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface ValuationFactorPaintProps {
  value: string;
  onChange: (value: string) => void;
}

export function ValuationFactorPaint({ value, onChange }: ValuationFactorPaintProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Paint Condition</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={value} 
          onValueChange={onChange}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="excellent" id="paint-excellent" />
            <Label htmlFor="paint-excellent">Excellent - Like new, no visible issues</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="good" id="paint-good" />
            <Label htmlFor="paint-good">Good - Minor scratches or fading</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fair" id="paint-fair" />
            <Label htmlFor="paint-fair">Fair - Visible scratches or chips</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="poor" id="paint-poor" />
            <Label htmlFor="paint-poor">Poor - Major paint issues or damage</Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
