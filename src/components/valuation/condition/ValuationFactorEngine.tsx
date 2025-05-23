
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface ValuationFactorEngineProps {
  value: string;
  onChange: (value: string) => void;
}

export function ValuationFactorEngine({ value, onChange }: ValuationFactorEngineProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Engine Condition</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={value} 
          onValueChange={onChange}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="excellent" id="engine-excellent" />
            <Label htmlFor="engine-excellent">Excellent - Runs perfectly, no issues</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="good" id="engine-good" />
            <Label htmlFor="engine-good">Good - Runs well, minor maintenance needed</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fair" id="engine-fair" />
            <Label htmlFor="engine-fair">Fair - Runs, but has noticeable issues</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="poor" id="engine-poor" />
            <Label htmlFor="engine-poor">Poor - Major issues, needs repair</Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
