
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

export interface AccidentDetails {
  hasAccident: boolean;
  accidentDescription: string;
  severity?: 'minor' | 'moderate' | 'severe';
}

export interface AccidentDetailsFormProps {
  accidentInfo: AccidentDetails;
  setAccidentInfo: React.Dispatch<React.SetStateAction<AccidentDetails>>;
}

export function AccidentDetailsForm({ accidentInfo, setAccidentInfo }: AccidentDetailsFormProps) {
  const handleAccidentToggle = (value: string) => {
    setAccidentInfo(prev => ({
      ...prev,
      hasAccident: value === 'yes'
    }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAccidentInfo(prev => ({
      ...prev,
      accidentDescription: e.target.value
    }));
  };

  const handleSeverityChange = (value: 'minor' | 'moderate' | 'severe') => {
    setAccidentInfo(prev => ({
      ...prev,
      severity: value
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-medium mb-3">Has this vehicle been in an accident?</h3>
        <RadioGroup
          value={accidentInfo.hasAccident ? 'yes' : 'no'}
          onValueChange={handleAccidentToggle}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="no-accident" />
            <Label htmlFor="no-accident">No accidents</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="yes-accident" />
            <Label htmlFor="yes-accident">Yes, it has been in accident(s)</Label>
          </div>
        </RadioGroup>
      </div>

      {accidentInfo.hasAccident && (
        <>
          <div>
            <Label htmlFor="accident-description">Describe the accident(s)</Label>
            <Textarea
              id="accident-description"
              placeholder="Please provide details about the accident(s), when they occurred, and what parts of the vehicle were damaged."
              value={accidentInfo.accidentDescription}
              onChange={handleDescriptionChange}
              className="mt-2"
            />
          </div>

          <div>
            <h3 className="text-base font-medium mb-3">Severity of damage</h3>
            <RadioGroup
              value={accidentInfo.severity || 'minor'}
              onValueChange={handleSeverityChange as (value: string) => void}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="minor" id="minor-damage" />
                <Label htmlFor="minor-damage">Minor (cosmetic damage only)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moderate" id="moderate-damage" />
                <Label htmlFor="moderate-damage">Moderate (required repairs, no structural damage)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="severe" id="severe-damage" />
                <Label htmlFor="severe-damage">Severe (structural damage, airbag deployment)</Label>
              </div>
            </RadioGroup>
          </div>
        </>
      )}
    </div>
  );
}
