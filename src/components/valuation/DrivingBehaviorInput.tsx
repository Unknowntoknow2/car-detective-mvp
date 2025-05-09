
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Car } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface DrivingBehaviorInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function DrivingBehaviorInput({ value, onChange }: DrivingBehaviorInputProps) {
  // Convert string value to numeric for slider
  const getValue = (): number => {
    switch(value) {
      case 'Very Conservative': return 0;
      case 'Conservative': return 25;
      case 'Normal': return 50;
      case 'Aggressive': return 75;
      case 'Very Aggressive': return 100;
      default: return 50;
    }
  };
  
  // Convert numeric slider value to string
  const getLabel = (value: number): string => {
    if (value <= 12) return 'Very Conservative';
    if (value <= 37) return 'Conservative';
    if (value <= 62) return 'Normal';
    if (value <= 87) return 'Aggressive';
    return 'Very Aggressive';
  };
  
  const handleSliderChange = (value: number[]) => {
    onChange(getLabel(value[0]));
  };
  
  const currentValue = getValue();
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Driving Style</span>
            <Badge 
              variant="outline" 
              className={
                currentValue <= 12 ? 'bg-blue-50 text-blue-700 border-blue-200' :
                currentValue <= 37 ? 'bg-cyan-50 text-cyan-700 border-cyan-200' :
                currentValue <= 62 ? 'bg-green-50 text-green-700 border-green-200' :
                currentValue <= 87 ? 'bg-orange-50 text-orange-700 border-orange-200' :
                'bg-red-50 text-red-700 border-red-200'
              }
            >
              {getLabel(currentValue)}
            </Badge>
          </div>
          
          <div className="px-2">
            <Slider 
              defaultValue={[currentValue]} 
              max={100} 
              step={1}
              onValueChange={handleSliderChange}
            />
          </div>
          
          <div className="grid grid-cols-5 text-center text-xs text-muted-foreground pt-1">
            <div>Very Conservative</div>
            <div>Conservative</div>
            <div>Normal</div>
            <div>Aggressive</div>
            <div>Very Aggressive</div>
          </div>
          
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 rounded-full p-2 mt-0.5">
                <Car className="h-4 w-4 text-primary" />
              </div>
              <div className="text-sm">
                <p className="font-medium">How This Affects Your Valuation</p>
                <p className="text-muted-foreground mt-1">
                  Conservative drivers typically experience less wear and tear on vehicle components like brakes and transmission.
                  This can positively impact your vehicle's value by 2-3% compared to aggressive driving patterns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default DrivingBehaviorInput;
