
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Wrench } from 'lucide-react';

interface MaintenanceStatusSelectorProps {
  value?: string;
  onChange: (value: string) => void;
}

const MAINTENANCE_STATUS_OPTIONS = [
  { value: 'up-to-date', label: 'Up to Date', description: 'All maintenance current and completed' },
  { value: 'needs-service', label: 'Needs Service', description: 'Some maintenance items are due' },
  { value: 'overdue', label: 'Overdue', description: 'Multiple maintenance items are overdue' }
];

export function MaintenanceStatusSelector({ value, onChange }: MaintenanceStatusSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wrench className="h-5 w-5 text-green-500" />
          <CardTitle className="text-lg">Maintenance Status</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Current maintenance status affects vehicle reliability and value.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <Label className="text-base font-medium mb-4 block">
          What is the current maintenance status?
        </Label>
        
        <RadioGroup value={value} onValueChange={onChange} className="space-y-3">
          {MAINTENANCE_STATUS_OPTIONS.map((option) => (
            <div
              key={option.value}
              className={`p-3 rounded-lg border transition-all ${
                value === option.value
                  ? 'bg-primary/5 border-primary'
                  : 'bg-muted/30 border-muted hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value={option.value} id={option.value} />
                <div className="flex-1">
                  <Label htmlFor={option.value} className="font-medium cursor-pointer">
                    {option.label}
                  </Label>
                  <div className="text-sm text-muted-foreground mt-1">
                    {option.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
