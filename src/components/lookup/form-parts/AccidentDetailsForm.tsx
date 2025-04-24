
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AccidentDetails } from '../types/manualEntry';
import { Label } from '@/components/ui/label';
import { Car, AlertTriangle, FileBarChart } from 'lucide-react';

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <FileBarChart className="h-4 w-4 text-primary" />
          Number of accidents
        </Label>
        <Input 
          placeholder="How many accidents?" 
          value={accidentDetails.count}
          onChange={e => setAccidentDetails({ ...accidentDetails, count: e.target.value })}
          disabled={disabled}
          className="input-3d"
        />
        <p className="text-xs text-text-secondary mt-1">
          Enter the total number of reported accidents
        </p>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          Severity of damage
        </Label>
        <Select 
          value={accidentDetails.severity}
          onValueChange={(value) => setAccidentDetails({ ...accidentDetails, severity: value })}
          disabled={disabled}
        >
          <SelectTrigger className="input-3d">
            <SelectValue placeholder="Select severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="minor">Minor</SelectItem>
            <SelectItem value="moderate">Moderate</SelectItem>
            <SelectItem value="major">Major</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-text-secondary mt-1">
          The extent of damage from the accidents
        </p>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Car className="h-4 w-4 text-primary" />
          Area of impact
        </Label>
        <Select 
          value={accidentDetails.area}
          onValueChange={(value) => setAccidentDetails({ ...accidentDetails, area: value })}
          disabled={disabled}
        >
          <SelectTrigger className="input-3d">
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
        <p className="text-xs text-text-secondary mt-1">
          Which part of the vehicle was impacted
        </p>
      </div>
    </div>
  );
};
