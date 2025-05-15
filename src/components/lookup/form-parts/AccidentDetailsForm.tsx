
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { AccidentDetails } from '../types/manualEntry';

interface AccidentDetailsFormProps {
  accidentDetails: AccidentDetails;
  setAccidentDetails: (details: AccidentDetails) => void;
}

export const AccidentDetailsForm: React.FC<AccidentDetailsFormProps> = ({
  accidentDetails,
  setAccidentDetails
}) => {
  const handleSeverityChange = (value: string) => {
    setAccidentDetails({
      ...accidentDetails,
      severity: value as 'Minor' | 'Moderate' | 'Severe'
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAccidentDetails({
      ...accidentDetails,
      description: e.target.value
    });
  };

  const handleRepairedChange = (checked: boolean) => {
    setAccidentDetails({
      ...accidentDetails,
      repaired: checked
    });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/10">
      <h3 className="font-medium">Accident Details</h3>
      
      <div className="space-y-3">
        <div>
          <Label className="mb-2 block">Severity</Label>
          <RadioGroup
            value={accidentDetails.severity || 'Minor'}
            onValueChange={handleSeverityChange}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Minor" id="severity-minor" />
              <Label htmlFor="severity-minor" className="cursor-pointer">Minor (Cosmetic damage)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Moderate" id="severity-moderate" />
              <Label htmlFor="severity-moderate" className="cursor-pointer">Moderate (Significant damage, but repairable)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Severe" id="severity-severe" />
              <Label htmlFor="severity-severe" className="cursor-pointer">Severe (Major structural or mechanical damage)</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div>
          <Label htmlFor="accident-description">Description (Optional)</Label>
          <Textarea
            id="accident-description"
            placeholder="Briefly describe the accident and damage..."
            value={accidentDetails.description || ''}
            onChange={handleDescriptionChange}
            className="resize-none h-24"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="repaired"
            checked={accidentDetails.repaired || false}
            onCheckedChange={handleRepairedChange}
          />
          <Label htmlFor="repaired" className="cursor-pointer">Has the damage been fully repaired?</Label>
        </div>
      </div>
    </div>
  );
};

export default AccidentDetailsForm;
