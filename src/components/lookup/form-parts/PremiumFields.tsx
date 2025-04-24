
import React from 'react';
import { AccidentDetailsForm } from './AccidentDetailsForm';
import { AccidentDetails } from '../types/manualEntry';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface PremiumFieldsProps {
  accident: string;
  setAccident: (value: string) => void;
  accidentDetails: AccidentDetails;
  setAccidentDetails: (details: AccidentDetails) => void;
  isDisabled: boolean;
}

export const PremiumFields: React.FC<PremiumFieldsProps> = ({
  accident,
  setAccident,
  accidentDetails,
  setAccidentDetails,
  isDisabled
}) => {
  if (!accident && !accidentDetails) return null;
  
  return (
    <>
      <Select 
        onValueChange={setAccident}
        disabled={isDisabled}
        value={accident}
      >
        <SelectTrigger>
          <SelectValue placeholder="Any Accidents?" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="no">No</SelectItem>
          <SelectItem value="yes">Yes</SelectItem>
        </SelectContent>
      </Select>

      {accident === "yes" && (
        <AccidentDetailsForm
          accidentDetails={accidentDetails}
          setAccidentDetails={setAccidentDetails}
          disabled={isDisabled}
        />
      )}
    </>
  );
};
