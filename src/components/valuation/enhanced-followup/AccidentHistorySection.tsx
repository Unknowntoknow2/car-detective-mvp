
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, AlertTriangle } from 'lucide-react';
import { AccidentDetails } from '@/types/follow-up-answers';

interface AccidentHistorySectionProps {
  value?: AccidentDetails;
  onChange: (value: AccidentDetails) => void;
}

export function AccidentHistorySection({ value = { hadAccident: false }, onChange }: AccidentHistorySectionProps) {
  const handleAccidentChange = (hadAccident: boolean) => {
    if (hadAccident) {
      onChange({ hadAccident, count: 1, severity: 'minor', repaired: false, frameDamage: false });
    } else {
      onChange({ hadAccident: false });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          <CardTitle className="text-lg">Accident History</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Accidents impact value based on severity and repair quality.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-base font-medium">Has this vehicle been in any accidents?</Label>
          <RadioGroup
            value={value.hadAccident ? 'yes' : 'no'}
            onValueChange={(val) => handleAccidentChange(val === 'yes')}
            className="flex gap-6 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no-accident" />
              <Label htmlFor="no-accident">No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes-accident" />
              <Label htmlFor="yes-accident">Yes</Label>
            </div>
          </RadioGroup>
        </div>

        {value.hadAccident && (
          <div className="space-y-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="accident-count">Number of Accidents</Label>
                <Input
                  id="accident-count"
                  type="number"
                  min="1"
                  max="10"
                  value={value.count || 1}
                  onChange={(e) => onChange({ ...value, count: parseInt(e.target.value) || 1 })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="accident-severity">Most Severe Accident</Label>
                <Select
                  value={value.severity || 'minor'}
                  onValueChange={(severity: 'minor' | 'moderate' | 'major') => 
                    onChange({ ...value, severity })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minor">Minor (cosmetic damage only)</SelectItem>
                    <SelectItem value="moderate">Moderate (required repairs)</SelectItem>
                    <SelectItem value="major">Major (structural damage)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Was it professionally repaired?</Label>
                <RadioGroup
                  value={value.repaired ? 'yes' : 'no'}
                  onValueChange={(val) => onChange({ ...value, repaired: val === 'yes' })}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="repaired-yes" />
                    <Label htmlFor="repaired-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="repaired-no" />
                    <Label htmlFor="repaired-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-sm font-medium">Any frame damage?</Label>
                <RadioGroup
                  value={value.frameDamage ? 'yes' : 'no'}
                  onValueChange={(val) => onChange({ ...value, frameDamage: val === 'yes' })}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="frame-yes" />
                    <Label htmlFor="frame-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="frame-no" />
                    <Label htmlFor="frame-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
