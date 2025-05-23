
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface ValuationFactorInteriorProps {
  value: string;
  onChange: (value: string) => void;
}

export function ValuationFactorInterior({ value, onChange }: ValuationFactorInteriorProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Interior Condition</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={value} 
          onValueChange={onChange}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="excellent" id="interior-excellent" />
            <Label htmlFor="interior-excellent">Excellent - Like new, no wear or stains</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="good" id="interior-good" />
            <Label htmlFor="interior-good">Good - Minor wear, no major stains</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fair" id="interior-fair" />
            <Label htmlFor="interior-fair">Fair - Visible wear, some stains</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="poor" id="interior-poor" />
            <Label htmlFor="interior-poor">Poor - Significant wear, tears or damage</Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
