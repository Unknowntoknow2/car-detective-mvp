
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface ValuationFactorTiresProps {
  value: string;
  onChange: (value: string) => void;
}

export function ValuationFactorTires({ value, onChange }: ValuationFactorTiresProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Tire Condition</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={value} 
          onValueChange={onChange}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="new" id="tires-new" />
            <Label htmlFor="tires-new">New - Recently replaced, 90-100% tread</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="good" id="tires-good" />
            <Label htmlFor="tires-good">Good - 50-90% tread remaining</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fair" id="tires-fair" />
            <Label htmlFor="tires-fair">Fair - 25-50% tread remaining</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="poor" id="tires-poor" />
            <Label htmlFor="tires-poor">Poor - Less than 25% tread, needs replacement</Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
