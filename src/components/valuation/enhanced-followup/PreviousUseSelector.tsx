
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface PreviousUseSelectorProps {
  value?: string;
  onChange: (value: string) => void;
}

const PREVIOUS_USE_OPTIONS = [
  { value: 'personal', label: 'Personal Use', description: 'Used for personal transportation' },
  { value: 'commercial', label: 'Commercial Use', description: 'Used for business purposes' },
  { value: 'rental', label: 'Rental Vehicle', description: 'Previously used as a rental car' },
  { value: 'lease', label: 'Lease Return', description: 'Previously leased vehicle' }
];

export function PreviousUseSelector({ value, onChange }: PreviousUseSelectorProps) {
  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">Previous Use</Label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {PREVIOUS_USE_OPTIONS.map((option) => (
          <Card 
            key={option.value}
            className={`cursor-pointer transition-all hover:shadow-md ${
              value === option.value 
                ? 'ring-2 ring-primary bg-primary/5' 
                : 'hover:bg-muted/50'
            }`}
            onClick={() => onChange(option.value)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium">{option.label}</h4>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  value === option.value 
                    ? 'bg-primary border-primary' 
                    : 'border-muted-foreground'
                }`}>
                  {value === option.value && (
                    <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{option.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
