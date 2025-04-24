
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AccidentDetails } from '../types/manualEntry';
import { Label } from '@/components/ui/label';

interface AccidentDetailsFormProps {
  accidentDetails: AccidentDetails;
  setAccidentDetails: (details: AccidentDetails) => void;
  disabled?: boolean;
}

export const AccidentDetailsForm: React.FC<AccidentDetailsFormProps> = ({
  accidentDetails,
  setAccidentDetails,
  disabled = false
}) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="space-y-2">
        <Label>Number of accidents</Label>
        <Input 
          placeholder="How many accidents?" 
          value={accidentDetails.count}
          onChange={e => setAccidentDetails({ ...accidentDetails, count: e.target.value })}
          disabled={disabled}
        />
      </div>

      <div className="space-y-2">
        <Label>Severity of damage</Label>
        <Select 
          value={accidentDetails.severity}
          onValueChange={(value) => setAccidentDetails({ ...accidentDetails, severity: value })}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="minor">Minor</SelectItem>
            <SelectItem value="moderate">Moderate</SelectItem>
            <SelectItem value="major">Major</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Area of impact</Label>
        <Select 
          value={accidentDetails.area}
          onValueChange={(value) => setAccidentDetails({ ...accidentDetails, area: value })}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select area" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="front">Front</SelectItem>
            <SelectItem value="rear">Rear</SelectItem>
            <SelectItem value="left">Left Side</SelectItem>
            <SelectItem value="right">Right Side</SelectItem>
            <SelectItem value="multiple">Multiple Areas</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
