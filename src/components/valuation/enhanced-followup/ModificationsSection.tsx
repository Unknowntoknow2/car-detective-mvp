
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Wrench } from 'lucide-react';
import { ModificationDetails, MODIFICATION_TYPES } from '@/types/follow-up-answers';

interface ModificationsSectionProps {
  value?: ModificationDetails;
  onChange: (value: ModificationDetails) => void;
}

export function ModificationsSection({ 
  value = { modified: false }, 
  onChange 
}: ModificationsSectionProps) {
  const handleModifiedChange = (modified: boolean) => {
    if (modified) {
      onChange({ modified, types: [], reversible: true });
    } else {
      onChange({ modified: false });
    }
  };

  const handleTypeChange = (type: string, checked: boolean) => {
    const types = value.types || [];
    if (checked) {
      onChange({ ...value, types: [...types, type] });
    } else {
      onChange({ ...value, types: types.filter((t: string) => t !== type) });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wrench className="h-5 w-5 text-blue-500" />
          <CardTitle className="text-lg">Vehicle Modifications</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Modifications can affect resale value. Reversible modifications typically have less impact.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-base font-medium">Has this vehicle been modified from stock?</Label>
          <RadioGroup
            value={value.modified ? 'yes' : 'no'}
            onValueChange={(val) => handleModifiedChange(val === 'yes')}
            className="flex gap-6 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="not-modified" />
              <Label htmlFor="not-modified">No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="is-modified" />
              <Label htmlFor="is-modified">Yes</Label>
            </div>
          </RadioGroup>
        </div>

        {value.modified && (
          <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div>
              <Label className="text-base font-medium mb-3 block">What types of modifications?</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {MODIFICATION_TYPES.map((type: string) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={value.types?.includes(type) || false}
                      onCheckedChange={(checked) => 
                        handleTypeChange(type, checked as boolean)
                      }
                    />
                    <Label htmlFor={type} className="text-sm cursor-pointer">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Are the modifications reversible?</Label>
              <RadioGroup
                value={value.reversible ? 'yes' : 'no'}
                onValueChange={(val) => onChange({ ...value, reversible: val === 'yes' })}
                className="flex gap-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="reversible-yes" />
                  <Label htmlFor="reversible-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="reversible-no" />
                  <Label htmlFor="reversible-no">No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
