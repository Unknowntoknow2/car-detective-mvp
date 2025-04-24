
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AccidentDetails } from '../types/manualEntry';

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 col-span-2">
      <Input 
        placeholder="How many?" 
        value={accidentDetails.count}
        onChange={e => setAccidentDetails({ ...accidentDetails, count: e.target.value })}
        disabled={disabled}
      />
      <Select 
        onValueChange={(value) => setAccidentDetails({ ...accidentDetails, severity: value })}
        disabled={disabled}
      >
        <SelectTrigger><SelectValue placeholder="Severity" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="minor">Minor</SelectItem>
          <SelectItem value="major">Major</SelectItem>
        </SelectContent>
      </Select>
      <Select 
        onValueChange={(value) => setAccidentDetails({ ...accidentDetails, area: value })}
        disabled={disabled}
      >
        <SelectTrigger><SelectValue placeholder="Area" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="front">Front</SelectItem>
          <SelectItem value="rear">Rear</SelectItem>
          <SelectItem value="left">Left Side</SelectItem>
          <SelectItem value="right">Right Side</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
