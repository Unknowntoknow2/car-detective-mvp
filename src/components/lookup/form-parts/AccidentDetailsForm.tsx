
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AccidentDetails } from '../types/manualEntry';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface AccidentDetailsFormProps {
  accidentDetails: AccidentDetails;
  setAccidentDetails: (details: AccidentDetails) => void;
}

export const AccidentDetailsForm: React.FC<AccidentDetailsFormProps> = ({
  accidentDetails,
  setAccidentDetails
}) => {
  const handleHasAccidentChange = (value: string) => {
    setAccidentDetails({
      ...accidentDetails,
      hasAccident: value === 'yes'
    });
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAccidentDetails({
      ...accidentDetails,
      description: e.target.value
    });
  };
  
  const handleSeverityChange = (value: string) => {
    setAccidentDetails({
      ...accidentDetails,
      severity: value as 'Minor' | 'Moderate' | 'Severe'
    });
  };
  
  const handleRepairedChange = (value: string) => {
    setAccidentDetails({
      ...accidentDetails,
      repaired: value === 'yes'
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Has this vehicle been in an accident?</Label>
        <RadioGroup
          value={accidentDetails.hasAccident ? 'yes' : 'no'}
          onValueChange={handleHasAccidentChange}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="accident-yes" />
            <Label htmlFor="accident-yes" className="cursor-pointer">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="accident-no" />
            <Label htmlFor="accident-no" className="cursor-pointer">No</Label>
          </div>
        </RadioGroup>
      </div>
      
      {accidentDetails.hasAccident && (
        <>
          <div className="space-y-2">
            <Label htmlFor="accidentDescription">Describe the accident</Label>
            <Textarea
              id="accidentDescription"
              value={accidentDetails.description || ''}
              onChange={handleDescriptionChange}
              placeholder="Please provide details about the accident"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Severity</Label>
            <RadioGroup
              value={accidentDetails.severity || 'Minor'}
              onValueChange={handleSeverityChange}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Minor" id="severity-minor" />
                <Label htmlFor="severity-minor" className="cursor-pointer">Minor - Cosmetic damage only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Moderate" id="severity-moderate" />
                <Label htmlFor="severity-moderate" className="cursor-pointer">Moderate - Some structural damage</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Severe" id="severity-severe" />
                <Label htmlFor="severity-severe" className="cursor-pointer">Severe - Major structural damage</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label>Was the vehicle professionally repaired?</Label>
            <RadioGroup
              value={accidentDetails.repaired ? 'yes' : 'no'}
              onValueChange={handleRepairedChange}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="repaired-yes" />
                <Label htmlFor="repaired-yes" className="cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="repaired-no" />
                <Label htmlFor="repaired-no" className="cursor-pointer">No</Label>
              </div>
            </RadioGroup>
          </div>
        </>
      )}
    </div>
  );
};
