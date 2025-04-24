
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

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
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Has this vehicle been in an accident?</Label>
        <RadioGroup
          value={accident}
          onValueChange={setAccident}
          className="flex space-x-4"
          disabled={isDisabled}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="no" />
            <Label htmlFor="no">No</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="yes" />
            <Label htmlFor="yes">Yes</Label>
          </div>
        </RadioGroup>
      </div>

      {accident === "yes" && (
        <div className="space-y-4 border-l-2 border-primary/20 pl-4">
          <p className="text-sm text-muted-foreground">
            Optional: Provide additional details about the accident to improve valuation accuracy
          </p>
          <AccidentDetailsForm
            accidentDetails={accidentDetails}
            setAccidentDetails={setAccidentDetails}
            disabled={isDisabled}
          />
        </div>
      )}
    </div>
  );
};
