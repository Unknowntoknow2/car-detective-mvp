
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from '@/lib/utils';

interface AccidentHistoryInputProps {
  accidents: {
    hasAccident: boolean;
    count?: number;
    severity?: string;
  };
  onAccidentChange: (accidents: {
    hasAccident: boolean;
    count?: number;
    severity?: string;
  }) => void;
}

export const AccidentHistoryInput: React.FC<AccidentHistoryInputProps> = ({
  accidents,
  onAccidentChange
}) => {
  const handleHasAccidentChange = (value: string | null) => {
    const hasAccident = value === 'yes';
    onAccidentChange({
      hasAccident,
      count: hasAccident ? accidents.count : undefined,
      severity: hasAccident ? accidents.severity : undefined,
    });
  };

  const handleAccidentCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value);
    onAccidentChange({
      hasAccident: accidents.hasAccident,
      count: isNaN(count) ? undefined : count,
      severity: accidents.severity,
    });
  };

  const handleAccidentSeverityChange = (value: string) => {
    onAccidentChange({
      hasAccident: accidents.hasAccident,
      count: accidents.count,
      severity: value,
    });
  };

  return (
    <>
      <Card className="p-4 space-y-3">
        <CardHeader>
          <CardTitle>Accident History</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="has-accident">Has the vehicle been in any accidents?</Label>
            <RadioGroup defaultValue={accidents.hasAccident ? 'yes' : 'no'} onValueChange={handleHasAccidentChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="r1" className="peer h-4 w-4 shrink-0 rounded-full border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
                <Label htmlFor="r1" className="cursor-pointer peer-data-[state=checked]:text-primary">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="r2" className="peer h-4 w-4 shrink-0 rounded-full border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
                <Label htmlFor="r2" className="cursor-pointer peer-data-[state=checked]:text-primary">No</Label>
              </div>
            </RadioGroup>
          </div>

          {accidents.hasAccident && (
            <>
              <div className="space-y-2">
                <Label htmlFor="accident-count">Number of Accidents</Label>
                <Input
                  id="accident-count"
                  type="number"
                  placeholder="Enter number of accidents"
                  value={accidents.count || ''}
                  onChange={handleAccidentCountChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accident-severity">Accident Severity</Label>
                <Select onValueChange={handleAccidentSeverityChange} defaultValue={accidents.severity || ''}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minor">Minor</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="severe">Severe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="p-4 space-y-3">
        <CardHeader>
          <CardTitle>Title Transfer</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="has-title-issue">Does the vehicle have any title issues (e.g., salvage, flood, rebuilt)?</Label>
            <RadioGroup>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="ti1" className="peer h-4 w-4 shrink-0 rounded-full border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
                <Label htmlFor="ti1" className="cursor-pointer peer-data-[state=checked]:text-primary">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="ti2" className="peer h-4 w-4 shrink-0 rounded-full border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
                <Label htmlFor="ti2" className="cursor-pointer peer-data-[state=checked]:text-primary">No</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
